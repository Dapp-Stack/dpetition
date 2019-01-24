pragma solidity ^0.5.0;

import "./Mixin/Ownable.sol";
import "./Mixin/Initializable.sol";
import "./Petition.sol";

contract Controller is Initializable{

    event PetitionCreated(address _address, string _title, string _descriptionHash, uint256 _expireOn, uint256 _deposit);

    address[] public petitions;
    address public escrow;

    function initialize(address _escrow) public initializer {
        escrow = _escrow;
    }

    function create(string memory _title, string memory _descriptionHash, uint256 _expireOn, uint256 _deposit) public {
        Petition petition = new Petition(_title, _descriptionHash, _expireOn, _deposit, escrow);
        petitions.push(address(petition));
        emit PetitionCreated(address(petition), _title, _descriptionHash, _expireOn, _deposit);
    }


    function petitionLength() public view returns(uint256) {
        return petitions.length;
    }
}