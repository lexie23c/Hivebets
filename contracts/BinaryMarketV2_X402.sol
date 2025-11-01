// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "usingtellor/contracts/UsingTellor.sol";

/**
 * @title BinaryMarketV2_X402
 * @notice Prediction market with x402 gasless betting support via EIP-712 signatures
 * @dev Extends BinaryMarketV2 with signature-based betting for x402 protocol
 */
contract BinaryMarketV2_X402 is ReentrancyGuard, UsingTellor, EIP712 {
    using ECDSA for bytes32;

    enum State { Open, Resolved, Cancelled }
    enum Outcome { Undecided, Yes, No }

    // Immutable state
    address public immutable factory;
    address public immutable resolver;        // Fallback manual resolver
    uint256 public immutable deadline;        // UNIX seconds
    uint256 public immutable maxPerWallet;    // Max bet per wallet per side
    uint16  public immutable feeBps;          // Fee in basis points (100 = 1%)
    bytes32 public immutable queryId;         // Tellor queryId for market cap data

    // Market details
    string public tokenName;
    string public dataSourceURL;
    uint256 public targetMcapUsd;             // Target market cap (8 decimals)

    // Market state
    State public state;
    Outcome public finalOutcome;

    // Betting pools
    mapping(address => uint256) public yesStake;
    mapping(address => uint256) public noStake;
    uint256 public yesPool;
    uint256 public noPool;

    // x402 Signature support
    mapping(address => uint256) public nonces;  // Replay protection
    address public facilitator;                  // Authorized facilitator/relayer

    // EIP-712 Type Hash for Bet
    bytes32 public constant BET_TYPEHASH = keccak256(
        "Bet(address user,address marketAddress,uint256 amount,bool isYes,uint256 nonce,uint256 deadline)"
    );

    // Oracle resolution settings
    uint256 public constant MIN_BUFFER_TIME = 1 hours;
    uint256 public constant MAX_DATA_AGE = 24 hours;

    // Events
    event Bet(address indexed user, bool yes, uint256 amount);
    event X402Bet(address indexed user, bool yes, uint256 amount, address facilitator);
    event Resolved(Outcome outcome, bool fromOracle, uint256 mcapValue);
    event Claimed(address indexed user, uint256 amount);
    event Cancelled();
    event FacilitatorUpdated(address indexed oldFacilitator, address indexed newFacilitator);

    // Modifiers
    modifier onlyResolver() { 
        require(msg.sender == resolver, "!resolver"); 
        _; 
    }
    
    modifier beforeDeadline() { 
        require(block.timestamp < deadline, "after deadline"); 
        _; 
    }

    modifier onlyFacilitator() {
        require(msg.sender == facilitator, "!facilitator");
        _;
    }

    constructor(
        address payable _tellorOracle,
        address _resolver,
        address _facilitator,
        uint256 _deadline,
        uint256 _maxPerWallet,
        uint16 _feeBps,
        string memory _tokenName,
        string memory _dataSourceURL,
        uint256 _targetMcapUsd,
        bytes32 _queryId
    ) 
        UsingTellor(_tellorOracle) 
        EIP712("HivebetsBinaryMarket", "1") 
    {
        require(_resolver != address(0), "bad resolver");
        require(_facilitator != address(0), "bad facilitator");
        require(_deadline > block.timestamp, "bad deadline");
        require(_queryId != bytes32(0), "bad queryId");
        
        factory = msg.sender;
        resolver = _resolver;
        facilitator = _facilitator;
        deadline = _deadline;
        maxPerWallet = _maxPerWallet;
        feeBps = _feeBps;
        tokenName = _tokenName;
        dataSourceURL = _dataSourceURL;
        targetMcapUsd = _targetMcapUsd;
        queryId = _queryId;
        state = State.Open;
    }

    receive() external payable { revert("use bet"); }

    /**
     * @notice Standard bet function (requires gas from user)
     * @param yes True for YES, false for NO
     */
    function bet(bool yes) external payable beforeDeadline nonReentrant {
        require(state == State.Open, "not open");
        require(msg.value > 0, "no value");
        
        uint256 totalForUser = yes ? yesStake[msg.sender] + msg.value : noStake[msg.sender] + msg.value;
        require(totalForUser <= maxPerWallet, "exceeds cap");

        if (yes) { 
            yesStake[msg.sender] += msg.value; 
            yesPool += msg.value; 
        } else { 
            noStake[msg.sender] += msg.value; 
            noPool += msg.value; 
        }

        emit Bet(msg.sender, yes, msg.value);
    }

    /**
     * @notice x402 Gasless bet using EIP-712 signature
     * @dev Facilitator calls this with user's signature and sponsors gas
     * @param user The user placing the bet
     * @param amount The bet amount in wei
     * @param isYes True for YES, false for NO
     * @param nonce User's current nonce for replay protection
     * @param signatureDeadline Signature expiry timestamp
     * @param v ECDSA signature v component
     * @param r ECDSA signature r component
     * @param s ECDSA signature s component
     */
    function betWithSignature(
        address user,
        uint256 amount,
        bool isYes,
        uint256 nonce,
        uint256 signatureDeadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external payable onlyFacilitator beforeDeadline nonReentrant {
        require(state == State.Open, "not open");
        require(msg.value == amount, "amount mismatch");
        require(block.timestamp <= signatureDeadline, "signature expired");
        require(nonce == nonces[user], "invalid nonce");

        // Verify EIP-712 signature
        bytes32 structHash = keccak256(
            abi.encode(
                BET_TYPEHASH,
                user,
                address(this),
                amount,
                isYes,
                nonce,
                signatureDeadline
            )
        );
        
        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(digest, v, r, s);
        require(signer == user, "invalid signature");

        // Increment nonce to prevent replay
        nonces[user]++;

        // Check max per wallet
        uint256 totalForUser = isYes ? yesStake[user] + amount : noStake[user] + amount;
        require(totalForUser <= maxPerWallet, "exceeds cap");

        // Update pools
        if (isYes) {
            yesStake[user] += amount;
            yesPool += amount;
        } else {
            noStake[user] += amount;
            noPool += amount;
        }

        emit X402Bet(user, isYes, amount, msg.sender);
        emit Bet(user, isYes, amount);
    }

    /**
     * @notice Update facilitator address (only factory can call)
     */
    function updateFacilitator(address newFacilitator) external {
        require(msg.sender == factory, "!factory");
        require(newFacilitator != address(0), "bad facilitator");
        address oldFacilitator = facilitator;
        facilitator = newFacilitator;
        emit FacilitatorUpdated(oldFacilitator, newFacilitator);
    }

    /**
     * @notice Automatically resolve market using Tellor oracle data
     */
    function resolveFromTellor() external nonReentrant {
        require(state == State.Open, "not open");
        require(block.timestamp >= deadline, "before deadline");
        require(
            block.timestamp >= deadline + MIN_BUFFER_TIME,
            "buffer period not elapsed"
        );

        (bytes memory valueBytes, uint256 timestampRetrieved) = _getDataBefore(
            queryId,
            deadline + 1
        );

        require(valueBytes.length > 0, "no oracle data");
        require(
            deadline - timestampRetrieved <= MAX_DATA_AGE,
            "oracle data too old"
        );

        uint256 mcapValue = abi.decode(valueBytes, (uint256));
        bool reachedTarget = mcapValue >= targetMcapUsd;
        
        state = State.Resolved;
        finalOutcome = reachedTarget ? Outcome.Yes : Outcome.No;

        emit Resolved(finalOutcome, true, mcapValue);
    }

    /**
     * @notice Manual resolution fallback
     */
    function resolve(Outcome outcome) external onlyResolver nonReentrant {
        require(state == State.Open, "not open");
        require(block.timestamp >= deadline, "before deadline");
        require(outcome != Outcome.Undecided, "bad outcome");

        state = State.Resolved;
        finalOutcome = outcome;

        emit Resolved(outcome, false, 0);
    }

    /**
     * @notice Cancel market (only resolver)
     */
    function cancel() external onlyResolver nonReentrant {
        require(state == State.Open, "not open");
        state = State.Cancelled;
        emit Cancelled();
    }

    /**
     * @notice Claim winnings or refund
     */
    function claim() external nonReentrant {
        require(state != State.Open, "still open");
        
        uint256 userYes = yesStake[msg.sender];
        uint256 userNo = noStake[msg.sender];
        uint256 payout = 0;

        if (state == State.Cancelled) {
            payout = userYes + userNo;
        } else if (state == State.Resolved) {
            if (finalOutcome == Outcome.Yes && userYes > 0) {
                uint256 totalPool = yesPool + noPool;
                uint256 grossPayout = (userYes * totalPool) / yesPool;
                uint256 fee = ((grossPayout - userYes) * feeBps) / 10000;
                payout = grossPayout - fee;
            } else if (finalOutcome == Outcome.No && userNo > 0) {
                uint256 totalPool = yesPool + noPool;
                uint256 grossPayout = (userNo * totalPool) / noPool;
                uint256 fee = ((grossPayout - userNo) * feeBps) / 10000;
                payout = grossPayout - fee;
            }
        }

        require(payout > 0, "nothing to claim");

        yesStake[msg.sender] = 0;
        noStake[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: payout}("");
        require(success, "transfer failed");

        emit Claimed(msg.sender, payout);
    }

    /**
     * @notice View current odds
     */
    function viewOdds() external view returns (uint256 pYes_bps, uint256 pNo_bps) {
        uint256 total = yesPool + noPool;
        if (total == 0) {
            return (5000, 5000);
        }
        pYes_bps = (yesPool * 10000) / total;
        pNo_bps = (noPool * 10000) / total;
    }

    /**
     * @notice Get DOMAIN_SEPARATOR for EIP-712
     */
    function DOMAIN_SEPARATOR() external view returns (bytes32) {
        return _domainSeparatorV4();
    }
}

