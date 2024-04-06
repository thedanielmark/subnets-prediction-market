const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

async function queryByID(proposalId) {
    const [deployer] = await ethers.getSigners()
    const predictionMarket = await ethers.getContract("PredictionMarket")
    const proposal = await predictionMarket.getProposal(proposalId)

    console.log({
        id: proposal[0].toNumber(),
        description: proposal[1],
        quorum: proposal[2].toNumber(),
        voteCount: proposal[3].toNumber(),
    })
    console.log("--------------------------------------------------------------")

    return {
        id: proposal[0].toNumber(),
        description: proposal[1],
        quorum: proposal[2].toNumber(),
        voteCount: proposal[3].toNumber(),
    }
}

module.exports = {
    queryByID,

}

// queryByID(4)
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })
