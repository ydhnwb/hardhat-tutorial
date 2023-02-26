// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const { ethers } = require("hardhat")

// Hardhat tests are normally written with Mocha and Chai.


describe("Token contract", () => {
    async function deployTokenFixture() {
        const Token = await ethers.getContractFactory('Token')
        const [owner, addr1, addr2] = await ethers.getSigners()

        //To deploy our contract, we just need to call .deploy() and await its deployed().
        //which happens once each transaction has been mined.
        const hardhatToken = await Token.deploy()
        await hardhatToken.deployed() //make sure it's already deployed

        //Fixtures can return anyhing you consider useful
        return { Token, hardhatToken, owner, addr1, addr2 }

    }


    describe('Deployment', () => {
        it('Should set the right owner', async () => {
            // We use loadFixture to setup  our environment. and then assert that things went well
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture)
            // This test expects the owner variable stored in the contract to be
            // equal to our Signer's owner.
            expect(await hardhatToken.owner()).equal(owner.address)
        })

        it('Should assign the total supply of the token to the owner', async () => {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture)
            const ownerBalance = await hardhatToken.balanceOf(owner.address)
            expect(ownerBalance).equal(await hardhatToken.totalSupply())
        })
    })


    describe("Transaction", () => {
        it('Should transfer token between accounts', async () => {
            const { Token, hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)

            //transfer 50 token from owner account to addr1 account
            expect(await hardhatToken.transfer(addr1.address, 50)).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50])

            //transfer 50 token from address1 to address2
            expect(await hardhatToken.connect(addr1).transfer(addr2.address, 50)).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50])
        })

        it("Should emit Transfer events", async function () {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );

            // Transfer 50 tokens from owner to addr1
            await expect(hardhatToken.transfer(addr1.address, 50))
                .to.emit(hardhatToken, "Transfer")
                .withArgs(owner.address, addr1.address, 50);

            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
                .to.emit(hardhatToken, "Transfer")
                .withArgs(addr1.address, addr2.address, 50);
        });


        it('Transfer should fail when not enough token', async () => {
            const { Token, hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)

            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
            console.log('initialOwnerbalance:', initialOwnerBalance)

            // Try to send 1 token from addr1 (0 tokens) to owner.
            // `require` will evaluate false and revert the transaction.
            await expect(
                hardhatToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("Not enough tokens");
            //when failed, balance shouldnt changed
            expect(await hardhatToken.balanceOf(owner.address)).equal(initialOwnerBalance)
        })
    })


})