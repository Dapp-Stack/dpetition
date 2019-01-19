pragma solidity ^0.5.0;

import "../DappHub/token.sol";

contract GemPit {
    function burn(DSToken gem) public {
        gem.burn(gem.balanceOf(address(this)));
    }
}