pragma solidity ^0.5.0;

contract IERC725 {    
    event ExecutionRequested(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);
    event Executed(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);
    event ExecutionFailed(uint256 indexed executionId, address indexed to, uint256 indexed value, bytes data);
    event Approved(uint256 indexed executionId, bool approved);
    
    function execute(address _to, uint256 _value, bytes memory _data) public returns (uint256 executionId);
    function approve(uint256 _id) public returns (bool success);
}
