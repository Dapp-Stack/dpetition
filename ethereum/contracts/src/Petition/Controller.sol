pragma solidity ^0.5.0;

import "./Mixin/Ownable.sol";
import "./Petition.sol";

contract Controller is Ownable {

    event PetitionCreated(address _address, string _title, string _descriptionHash, uint256 _expireOn);

    address[] public petitions;

    function create(string memory _title, string memory _descriptionHash, uint256 _expireOn) public {
        Petition petition = new Petition(_title, _descriptionHash, _expireOn);
        petitions.push(address(petition));
        emit PetitionCreated(address(petition), _title, _descriptionHash, _expireOn);
    }

    function getAddresses() public view returns(address[] memory) {
        return petitions;
    }

    function getLength() public view returns(uint256) {
        return petitions.length;
    }
}