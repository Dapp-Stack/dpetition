pragma solidity ^0.5.0;

import "./Interfaces/IERC20.sol";
import "./Mixin/Ownable.sol";
import "./Petition.sol";

contract Controller is Ownable {

    event PetitionCreated(address _address, string _title, string _descriptionHash, uint256 _expireOn, uint256 _deposit);

    address[] public petitions;

    IERC20 public erc20;
    address public recipient;

    constructor(IERC20 _erc20, address _recipient) public {
        erc20 = _erc20;
        recipient = _recipient;
    }

    function setERC20(IERC20 _erc20) public onlyOwner {
        erc20 = _erc20;
    }

    function setRecipient(address _recipient) public onlyOwner {
        recipient = _recipient;
    }

    function create(string memory _title, string memory _descriptionHash, uint256 _expireOn, uint256 _deposit) public {
        Petition petition = new Petition(_title, _descriptionHash, _expireOn, _deposit, erc20, recipient);
        petitions.push(address(petition));
        emit PetitionCreated(address(petition), _title, _descriptionHash, _expireOn, _deposit);
    }

    function getAddresses() public view returns(address[] memory) {
        return petitions;
    }

    function getLength() public view returns(uint256) {
        return petitions.length;
    }
}