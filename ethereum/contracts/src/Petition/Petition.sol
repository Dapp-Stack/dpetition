pragma solidity ^0.5.0;

import "./Mixin/Ownable.sol";
import "./Escrow.sol";

contract Petition is Ownable {

    event PetitionSigned(address _signer);
    event PetitionMarkAsWithdraw(address _signer);

    string public title;
    string public descriptionHash;
    uint256 public expireOn;
    uint256 public deposit;
    mapping(address => bool) public signers;
    mapping(address => bool) public withdraws;

    Escrow public escrow;
    
    constructor(string memory _title, string memory _descriptionHash, uint256 _expireOn, uint256 _deposit, address _escrow) public {
        require(bytes(_title).length > 0, "Title cannot be empty.");
        require(bytes(_descriptionHash).length > 0, "DescriptionHash cannot be empty.");
        require(_deposit > 0, "Deposit cannot be less than 1 Wei.");

        uint256 minExpireOn = now + 1 days;
        require(_expireOn > minExpireOn, "Must expires in at least 1 day.");

        title = _title;
        descriptionHash = _descriptionHash;
        expireOn = _expireOn;
        deposit = _deposit;
        escrow = Escrow(_escrow);
    }

    function sign() public payable {
        require(!signers[msg.sender], "Already signed.");

        signers[msg.sender] = true;
        escrow.deposit(msg.sender, msg.value);
        emit PetitionSigned(msg.sender);
    }

    function canWithdraw(address _sender) public view returns (bool) {
        if (!signers[_sender]) {
            return false;
        }

        if (withdraws[_sender]) {
            return false;
        }

        return expireOn >= now;
    }

    function withdraw() public payable {
        bool ok = canWithdraw(msg.sender);
        require(ok, "Cannot widraw fund.");

        withdraws[msg.sender] = true;
        escrow.withdraw(msg.sender, msg.value);
        emit PetitionMarkAsWithdraw(msg.sender);
    }
}