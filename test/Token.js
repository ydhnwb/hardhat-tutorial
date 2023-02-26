const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token.sol contract", () => {
    it("Deployment should assign the total supply of tokens to the owner", async () => {
        const [owner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Token");
        const hardhatToken = await Token.deploy();
        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        expect(await hardhatToken.totalSupply()).equal(ownerBalance);
    })

    it('Should transfer between accounts (signer, in ethers term)', async () => {
        const [owner, address1, address2] = await ethers.getSigners()
        const Token = await ethers.getContractFactory("Token")
        const hardhatToken = await Token.deploy()


        //transfer 50 token from owner to address1
        await hardhatToken.transfer(address1.address, 50)
        expect(await hardhatToken.balanceOf(address1.address)).equal(50)

        /**
         * you can use the connect() method on your ethers.js Contract object to connect it to a different account, like this:
         * 
         */
        await hardhatToken.connect(address1).transfer(address2.address, 50)
        expect(await hardhatToken.balanceOf(address2.address)).equal(50)
    })
})