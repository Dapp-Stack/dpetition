pragma solidity ^0.5.0;

import "./Mixin/Ownable.sol";

contract Petition is Ownable {

    event PetitionSigned(address _signer);

    string public title;
    string public descriptionHash;
    uint256 public expireOn;
    address[] public signers;
    mapping(address => bool) public whitelistSigners;
    
    constructor(string memory _title,
                string memory _descriptionHash,
                uint256 _expireOn) public {
        require(bytes(_title).length > 0, "Title cannot be empty.");
        require(bytes(_descriptionHash).length > 0, "DescriptionHash cannot be empty.");

        uint256 minExpireOn = now + 1 days;
        require(_expireOn > minExpireOn, "Must expires in at least 1 day.");

        title = _title;
        descriptionHash = _descriptionHash;
        expireOn = _expireOn;
    }

    function getSigners() public view returns(address[] memory) {
        return signers;
    }

    function get() public view returns(address, string memory, string memory, uint256) {
        return (address(this), title, descriptionHash, expireOn);
    }

    function sign() public {
        require(!whitelistSigners[msg.sender], "Already signed.");
        
        whitelistSigners[msg.sender] = true;
        signers.push(msg.sender);
        emit PetitionSigned(msg.sender);
    }
}