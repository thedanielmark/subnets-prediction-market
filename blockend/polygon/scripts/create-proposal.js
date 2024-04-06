const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function createProposal() {
    // const [deployer] = await ethers.getSigners()
    const predictionMarket = await ethers.getContract("PredictionMarket")

    // Log the balances before swapping.
    let description = 'Who will win the WTC 2026?'
    let quorum = 1;
    let proposal = await predictionMarket.createProposal(description, quorum);
    console.log(`Proposal created with hash ${proposal.hash}.`)

    console.log("--------------------------------------------------------------")
}

createProposal()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
