// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/**
 * @title HivebetsOracle
 * @notice HiveBets proprietary oracle system for prediction markets
 * @dev Stores timestamped data feeds from multiple sources (BSCScan, Four.meme API, CoinGecko, DexScreener)
 */
contract HivebetsOracle {
    // Storage
    mapping(bytes32 => mapping(uint256 => bytes)) private values; // queryId -> timestamp -> value
    mapping(bytes32 => uint256[]) private timestamps; // queryId -> array of timestamps
    mapping(bytes32 => bool) private isDisputed; // queryId -> dispute status
    
    // Events
    event NewValue(bytes32 _queryId, uint256 _time, bytes _value, uint256 _nonce, bytes _queryData);
    event ValueDisputed(bytes32 _queryId, uint256 _time);
    
    /**
     * @notice Submit a new value to the oracle
     * @param _queryId unique identifier for the data feed
     * @param _value the value to submit (encoded)
     * @param _nonce current number of values for this queryId
     * @param _queryData the data used to generate the queryId
     */
    function submitValue(
        bytes32 _queryId,
        bytes calldata _value,
        uint256 _nonce,
        bytes memory _queryData
    ) external {
        uint256 _time = block.timestamp;
        values[_queryId][_time] = _value;
        timestamps[_queryId].push(_time);
        
        emit NewValue(_queryId, _time, _value, _nonce, _queryData);
    }
    
    /**
     * @notice Retrieve the latest value for a queryId
     * @param _queryId the unique identifier for the data feed
     * @return _value the latest submitted value
     * @return _timestampRetrieved the timestamp of the value
     */
    function getDataBefore(bytes32 _queryId, uint256 _timestamp)
        external
        view
        returns (bytes memory _value, uint256 _timestampRetrieved)
    {
        uint256[] storage _timestamps = timestamps[_queryId];
        if (_timestamps.length == 0) {
            return ("", 0);
        }
        
        // Find the most recent timestamp before the given timestamp
        for (uint256 i = _timestamps.length; i > 0; i--) {
            if (_timestamps[i - 1] < _timestamp) {
                _timestampRetrieved = _timestamps[i - 1];
                _value = values[_queryId][_timestampRetrieved];
                return (_value, _timestampRetrieved);
            }
        }
        
        return ("", 0);
    }
    
    /**
     * @notice Retrieve value by queryId and timestamp
     * @param _queryId the unique identifier
     * @param _timestamp the timestamp to retrieve data from
     */
    function retrieveData(bytes32 _queryId, uint256 _timestamp)
        external
        view
        returns (bytes memory)
    {
        return values[_queryId][_timestamp];
    }
    
    /**
     * @notice Get count of timestamps for a queryId
     * @param _queryId the unique identifier
     */
    function getNewValueCountbyQueryId(bytes32 _queryId)
        external
        view
        returns (uint256)
    {
        return timestamps[_queryId].length;
    }
    
    /**
     * @notice Get timestamp by queryId and index
     * @param _queryId the unique identifier
     * @param _index the index of the timestamp
     */
    function getTimestampbyQueryIdandIndex(bytes32 _queryId, uint256 _index)
        external
        view
        returns (uint256)
    {
        return timestamps[_queryId][_index];
    }
}
