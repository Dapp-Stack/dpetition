pragma solidity ^0.5.0;

import "./Ownable.sol";

contract Petition is Ownable {

    event PetitionCreated(uint256 _id);
    event PetitionSigned(uint256 _id, address _signer);
    event PetitionMarkAsWithdraw(uint256 _id, address _signer);

    struct Details {
        string title;
        string descriptionHash;
        uint256 expiration;
        uint256 deposit;
        address owner;
    }

    Details[] public petitions;
    mapping (uint256 => address[]) public signers;
    mapping (address => uint256[]) public signed;
    mapping (address => uint256[]) public withdraws;

    function length() public view returns(uint256) {
        return petitions.length;
    }

    function create(string memory _title,
                    string memory _descriptionHash,
                    uint256 _expiration,
                    uint256 _deposit,
                    address _owner) public onlyOwner {
        require(bytes(_title).length > 0, "Title cannot be empty.");
        require(bytes(_descriptionHash).length > 0, "DescriptionHash cannot be empty.");
        require(_deposit > 0, "Deposit cannot be less than 1 Wei.");

        uint256 minExpiration = now + 1 days;
        require(_expiration > minExpiration, "Must expires in at least 1 day.");

        Details memory details = Details(_title, _descriptionHash, _expiration, _deposit, _owner);
        uint256 id = petitions.push(details) - 1;

        emit PetitionCreated(id);
    }

    function sign(uint256 _id, address _sender) public onlyOwner {
        Details storage details = petitions[_id];
        require(details.owner != address(0x0), "Petition does not exist.");

        bool alreadySigned = didSign(_id, _sender);
        require(alreadySigned == false, "Already signed.");

        signers[_id].push(_sender);
        signed[_sender].push(_id);

        emit PetitionSigned(_id, _sender);
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
        require(alreadySigned == true, "Not signed.");

        bool alreadyWithdraw = didWithdraw(_id, _sender);
        require(alreadyWithdraw == false, "Already withdrawn.");

        return details.expiration >= now;
    }

    function markAsWithdraw(uint256 _id, address _sender) public onlyOwner {
        Details storage details = petitions[_id];
        require(details.owner != address(0x0), "Petition does not exist.");

        bool alreadySigned = didSign(_id, _sender);
        require(alreadySigned == true, "Not signed.");

        bool alreadyWithdraw = didWithdraw(_id, _sender);
        require(alreadyWithdraw == false, "Already withdrawn.");
        
        require(details.expiration >= now, "Petition cannot be withdraw yet.");
        
        withdraws[_sender].push(_id);

        emit PetitionMarkAsWithdraw(_id, _sender);
    }
}