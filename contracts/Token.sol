pragma solidity ^0.8.9;

//This is the main building lock for smart contract
contract Token {
    //some string type variables to identify the token
    string public name = "My hardhat token";
    string public symbol = "MHT";

    // The fixed amount of tokens, stored in an unsigned int type variable
    uint256 public totalSupply = 100000;

    // An address type variable is used to store ethereum  accounts
    address public owner;

    // A mapping is key/value map. Here we store each account's balance
    mapping(address => uint256) balances;

    //The transfer event helps off-chain applications understand
    // what happens within your contract
    event Transfer(address indexed _from, address indexed _to, uint256 _value);


    /**
     *  Contract initizialization
     */

    constructor(){
        // The totalSupply is assigned to the transaction sender, which is the
        // accoount that is deploying the contract
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }


    /** 
    * A function to transfer to token.
    *
    * The `external` modifier makes a function *only* callable from *outside*
    * the contract    
     */

    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will be reverted
        require(balances[msg.sender] >= amount, "Not enough tokens");

        //Transfer the amount
        balances[msg.sender] -= amount;
        balances[to] += amount;

        //Notify off-chain applications of the transfer.abi
        emit Transfer(msg.sender, to, amount);

    }

    /**
     * Read only fuction to retrieve the token balance of a given account
     * The `view` modifier indicates that it doesnt modify the contract (view-only)
     * state, which allows us to call it without executing a transaction
     * 
     * @param account is address what we gonna see the balance
     * 
     */
    function balanceOf(address account) external view returns (uint256){
        return balances[account];
    }
}