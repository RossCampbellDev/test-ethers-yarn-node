// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
/**
 * @title ContractName
 * @dev ContractDescription
 * @custom:dev-run-script file_path
 */
import "console.sol"; // copied from hardhat raw.  the URL wouldn't work for some reason

contract ERC20Token {
    string public name;
    mapping(address => uint256) public balances;

    constructor(string memory _name) {
        name = _name;
    }

    function mint() public virtual {
        balances[tx.origin]++;
    }
}

contract Contract8mytoken is
    ERC20Token // inherit from ERC20Token "class"
{
    //string public name = "RossToken";   // we are overriding the name
    string public symbol;
    address[] public owners; // array of who owns tokens
    uint256 ownerCount;

    // we can accept the 2 args to this contract's constructor, use 1 when constructing the ERC20Token contract
    // then the other locally.  this is overriding the constructor from ERC20Token
    constructor(string memory _name, string memory _symbol) ERC20Token(_name) {
        symbol = _symbol;
    }

    // create another version of the mint function but adds some more.  Override.
    function mint() public override {
        super.mint();
        ownerCount++;
        owners.push(msg.sender);
    }
}
