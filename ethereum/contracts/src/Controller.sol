pragma solidity ^0.5.0;

import "./Initializable.sol";
import "./Petition.sol";
import "./Escrow.sol";

contract Controller is Initializable {
    Escrow public escrow;
    Petition public petition;

    function initialize(address _escrow, address _petition) public initializer {
        escrow = Escrow(_escrow);
        petition = Petition(_petition);
    }

    function create(string memory _title,
                    string memory _descriptionHash,
                    uint256 _expiration,
                    uint256 _deposit) public {
        petition.create(_title, _descriptionHash, _expiration, _deposit, msg.sender);
    }

    function sign(uint256 _id) public payable {
        petition.sign(_id, msg.sender);
        escrow.deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _id) public payable {
        bool canWithdraw = petition.canWithdraw(_id, msg.sender);
        require(canWithdraw, "Cannot widraw fund.");

        petition.markAsWithdraw(_id, msg.sender);
        escrow.withdraw(msg.sender, msg.value);
    }

}