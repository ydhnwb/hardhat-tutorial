const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token.sol contract", () => {
    it("Deployment should assign the total supply of tokens to the owner", async () => {
        console.log('Step 1');
        const [owner] = await ethers.getSigners();
        console.log('Step 2');
        const Token = await ethers.getContractFactory("Token");
        console.log('Step 3');
        const hardhatToken = await Token.deploy();
        console.log('Step 4');
        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        console.log('Step 5');
        expect(await hardhatToken.totalSupply()).equal(ownerBalance);
    })
})