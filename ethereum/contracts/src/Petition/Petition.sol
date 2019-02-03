pragma solidity ^0.5.0;

import "./Mixin/Ownable.sol";
import "./Interfaces/IERC20.sol";

contract Petition is Ownable {

    event PetitionSigned(address _signer);
    event PetitionMarkAsWithdraw(address _signer);

    string public title;
    string public descriptionHash;
    uint256 public expireOn;
    uint256 public deposit;
    address[] public signers;
    address[] public withdraws;
    IERC20 public erc20;
    address public recipient;
    mapping(address => bool) public whitelistSigners;
    mapping(address => bool) public whitelistWithdraws;
    
    constructor(string memory _title,
                string memory _descriptionHash,
                uint256 _expireOn,
                uint256 _deposit,
                IERC20 _erc20,
                address _recipient) public {
        require(bytes(_title).length > 0, "Title cannot be empty.");
        require(bytes(_descriptionHash).length > 0, "DescriptionHash cannot be empty.");
        require(_deposit > 0, "Deposit cannot be less than 1 Wei.");

        uint256 minExpireOn = now + 1 days;
        require(_expireOn > minExpireOn, "Must expires in at least 1 day.");

        title = _title;
        descriptionHash = _descriptionHash;
        expireOn = _expireOn;
        deposit = _deposit;
        erc20 = _erc20;
        recipient = _recipient;
    }

    function getSigners() public view returns(address[] memory) {
        return signers;
    }

    function getWithdraws() public view returns(address[] memory) {
        return withdraws;
    }

    function get() public view returns(address, string memory, string memory, uint256, uint256) {
        return (address(this), title, descriptionHash, expireOn, deposit);
    }

    function sign() public payable {
        require(!whitelistSigners[msg.sender], "Already signed.");
        require(erc20.balanceOf(msg.sender) >= deposit, "Not enough token");
        
        whitelistSigners[msg.sender] = true;
        signers.push(msg.sender);
        erc20.transfer(recipient, deposit);
        emit PetitionSigned(msg.sender);
    }

    function canWithdraw(address _sender) public view returns (bool) {
        if (!whitelistSigners[_sender]) {
            return false;
        }

        if (whitelistWithdraws[_sender]) {
            return false;
        }

        return expireOn >= now;
    }

    function withdraw() public payable {
        bool ok = canWithdraw(msg.sender);
        require(ok, "Cannot widraw fund.");

        whitelistWithdraws[msg.sender] = true;
        withdraws.push(msg.sender);
        erc20.transferFrom(msg.sender, recipient, deposit);
        emit PetitionMarkAsWithdraw(msg.sender);
    }
}