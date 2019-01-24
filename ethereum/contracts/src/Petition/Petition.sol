pragma solidity ^0.5.0;

import "./Mixin/Ownable.sol";
import "./Mixin/Initializable.sol";
import "./Escrow.sol";

contract Petition is Ownable, Initializable {

    event PetitionCreated(uint256 _id, string _title, string _descriptionHash, uint256 _expireOn, uint256 _depoit);
    event PetitionSigned(uint256 _id, address _signer);
    event PetitionMarkAsWithdraw(uint256 _id, address _signer);

    struct Details {
        string title;
        string descriptionHash;
        uint256 expireOn;
        uint256 deposit;
        address owner;
    }

    Escrow public escrow;
    Details[] public petitions;
    mapping (uint256 => address[]) public signers;
    mapping (address => uint256[]) public signed;
    mapping (address => uint256[]) public withdraws;

    function initialize(address _escrow) public initializer {
        escrow = Escrow(_escrow);
    }

    function length() public view returns(uint256) {
        return petitions.length;
    }

    function create(string memory _title,
                    string memory _descriptionHash,
                    uint256 _expireOn,
                    uint256 _deposit,
                    address _owner) public {
        require(bytes(_title).length > 0, "Title cannot be empty.");
        require(bytes(_descriptionHash).length > 0, "DescriptionHash cannot be empty.");
        require(_deposit > 0, "Deposit cannot be less than 1 Wei.");

        uint256 minExpireOn = now + 1 days;
        require(_expireOn > minExpireOn, "Must expires in at least 1 day.");

        Details memory details = Details(_title, _descriptionHash, _expireOn, _deposit, _owner);
        uint256 id = petitions.push(details) - 1;

        emit PetitionCreated(id, _title, _descriptionHash, _expireOn, _deposit);
    }

    function sign(uint256 _id) public payable {
        Details storage details = petitions[_id];
        require(details.owner != address(0x0), "Petition does not exist.");

        bool alreadySigned = didSign(_id, msg.sender);
        require(alreadySigned == false, "Already signed.");

        signers[_id].push(msg.sender);
        signed[msg.sender].push(_id);
        escrow.deposit(msg.sender, msg.value);
        emit PetitionSigned(_id, msg.sender);
    }

    function didSign(uint256 _id, address _sender) public view returns (bool) {
        for (uint i = 0; i < signed[_sender].length; i++) {
            if (signed[_sender][i] == _id) {
                return true;
            }
        }

        return false;
    }

    function didWithdraw(uint256 _id, address _sender) public view returns (bool) {
        for (uint i = 0; i < withdraws[_sender].length; i++) {
            if (withdraws[_sender][i] == _id) {
                return true;
            }
        }

        return false;
    }

    function canWithdraw(uint256 _id, address _sender) public view returns (bool) {
        Details storage details = petitions[_id];
        require(details.owner != address(0x0), "Petition does not exist.");

        bool alreadySigned = didSign(_id, _sender);
        if (!alreadySigned) {
            return false;
        }

        bool alreadyWithdraw = didWithdraw(_id, _sender);
        if (alreadyWithdraw) {
            return false;
        }

        return details.expireOn >= now;
    }

    function withdraw(uint256 _id) public payable {
        bool ok = canWithdraw(_id, msg.sender);
        require(ok, "Cannot widraw fund.");

        withdraws[msg.sender].push(_id);
        escrow.withdraw(msg.sender, msg.value);
        emit PetitionMarkAsWithdraw(_id, msg.sender);
    }
}