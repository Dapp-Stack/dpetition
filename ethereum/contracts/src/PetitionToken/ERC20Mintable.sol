pragma solidity ^0.5.0;

import "./Mixin/ERC20.sol";

/**
 * @title ERC20Mintable
 * @dev ERC20 minting logic
 */
contract ERC20Mintable is ERC20 {
    uint8 constant public decimals = 18;
    string constant public name = "Petition Protocol Token";
    string constant public symbol = "PPT";
    uint256 private _totalSupply = 0;

    /**
     * @dev Function to mint tokens
     * @param to The address that will receive the minted tokens.
     * @param value The amount of tokens to mint.
     * @return A boolean that indicates if the operation was successful.
     */
    function mint(address to, uint256 value) public returns (bool) {
        _mint(to, value);
        return true;
    }
}