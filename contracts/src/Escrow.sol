pragma solidity ^0.5.0;

import "./SafeMath.sol";
import "./Ownable.sol";

 /**
 * @title Escrow
 * @dev Base escrow contract, holds funds designated for a payee until they
 * withdraw them.
 * @dev Intended usage: This contract (and derived escrow contracts) should be a
 * standalone contract, that only interacts with the contract that instantiated
 * it. That way, it is guaranteed that all Ether will be handled according to
 * the Escrow rules, and there is no need to check for payable functions or
 * transfers in the inheritance tree. The contract that uses the escrow as its
 * payment method should be its primary, and provide public methods redirecting
 * to the escrow's deposit and withdraw.
 */
contract Escrow is Ownable {
    using SafeMath for uint256;

    event Deposited(address indexed payee, uint256 weiAmount);
    event Withdrawn(address indexed payee, uint256 weiAmount);

    mapping(address => uint256) private _deposits;

    function depositsOf(address payee) public view returns (uint256) {
        return _deposits[payee];
    }

    /**
    * @dev Stores the sent amount as credit to be withdrawn.
    * @param payee The destination address of the funds.
    * @param amount The amount to deposit.
    */
    function deposit(address payable payee, uint256 amount) public onlyOwner {
        _deposits[payee] = _deposits[payee].add(amount);

        emit Deposited(payee, amount);
    }

    /**
    * @dev Withdraw choosen amount for a payee.
    * @param payee The address whose funds will be withdrawn and transferred to.
    * @param amount The amount to withdraw
    */
    function withdraw(address payable payee, uint256 amount) public onlyOwner {
        uint256 currentBalance = _deposits[payee];

        require(currentBalance >= amount, "Balance for the payee is not enough.");

        _deposits[payee] = currentBalance - amount;
        payee.transfer(amount);

        emit Withdrawn(payee, amount);
    }
}