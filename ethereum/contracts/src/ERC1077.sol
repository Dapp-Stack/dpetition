pragma solidity ^0.5.0;

import "./KeyHolder.sol";
import "./IERC1077.sol";
import "./ECRecovery.sol";
import "./SafeMath.sol";
import "./ERC20.sol";

contract ERC1077 is KeyHolder, IERC1077 {
    using ECRecovery for bytes32;
    using SafeMath for uint;

    uint _lastNonce;

    constructor(bytes32 _key) KeyHolder(_key) public {
    }

    function lastNonce() public view returns (uint) {
        return _lastNonce;
    }

    function canExecute(
        address to,
        uint256 value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes memory signatures) public view returns (bool)
    {
        address signer = getSigner(
            address(this),
            to,
            value,
            data,
            nonce,
            gasPrice,
            gasToken,
            gasLimit,
            operationType,
            signatures);
        return keyExist(bytes32(uint256(signer)));
    }

    function calculateMessageHash(
        address from,
        address to,
        uint256 value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType) public pure returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                from,
                to,
                value,
                keccak256(data),
                nonce,
                gasPrice,
                gasToken,
                gasLimit,
                uint(operationType)
        ));
    }

    function getSigner(
        address from,
        address to,
        uint value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes memory signatures ) public pure returns (address)
    {
        return calculateMessageHash(
            from,
            to,
            value,
            data,
            nonce,
            gasPrice,
            gasToken,
            gasLimit,
            operationType).toEthSignedMessageHash().recover(signatures);
    }

    function executeSigned(
        address to,
        uint256 value,
        bytes memory data,
        uint nonce,
        uint gasPrice,
        address gasToken,
        uint gasLimit,
        OperationType operationType,
        bytes memory signatures) public returns (bytes32)
    {
        require(nonce == _lastNonce, "Invalid nonce");
        require(canExecute(to, value, data, nonce, gasPrice, gasToken, gasLimit, operationType, signatures), "Invalid signature");
        uint256 startingGas = gasleft();
        /* solium-disable-next-line security/no-call-value */
        (bool success, ) = to.call.value(value)(data);
        bytes32 messageHash = calculateMessageHash(address(this), to, value, data, nonce, gasPrice, gasToken, gasLimit, operationType);
        emit ExecutedSigned(messageHash, _lastNonce, success);
        _lastNonce++;
        uint256 gasUsed = startingGas.sub(gasleft());
        refund(gasUsed, gasPrice, gasToken);
        return messageHash;
    }

    function refund(uint256 gasUsed, uint gasPrice, address gasToken) private {
        if (gasToken != address(0)) {
            ERC20 token = ERC20(gasToken);
            token.transfer(msg.sender, gasUsed.mul(gasPrice));
        } else {
            msg.sender.transfer(gasUsed.mul(gasPrice));
        }
    }
}
