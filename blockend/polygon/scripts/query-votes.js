const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function queryVotes() {
    const [deployer] = await ethers.getSigners()
    const predictionMarket = await ethers.getContract("PredictionMarket")

    let proposalVotes = await predictionMarket.getVotes(5)
    console.log(proposalVotes)
    console.log("--------------------------------------------------------------")
}

queryVotes()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
