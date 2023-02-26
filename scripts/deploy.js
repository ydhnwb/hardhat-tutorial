const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contract with account:', deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

    const Token = await ethers.getContractFactory("Token")
    const token = await Token.deploy()


    console.log('Token address:', token.address)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


//npx run scripts/deploy.js
// or
//npx run scripts/deploy.js --network localhost