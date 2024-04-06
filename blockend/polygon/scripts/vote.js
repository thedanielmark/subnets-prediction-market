const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")
require("dotenv").config()
const axios = require("axios")
const { queryByID } = require("./query_by_proposal_id")

async function vote() {
    const [deployer] = await ethers.getSigners()
    const predictionMarket = await ethers.getContract("PredictionMarket")
    let proposalDetails = await queryByID(5)

    let msg = {
        answer: "India",
        proposal_id: proposalDetails.id,
        proposal_description: proposalDetails.description,
        salt: Math.random(),
    }

    const getEncryptedMessageBytes = async (message) => {
        console.log(process.env.ECC_PRIVATE_KEY)
        let { data } = await axios.post("http://localhost:3000/api/shared-secret", {
            privateKey: process.env.ECC_PRIVATE_KEY,
            publicKey: process.env.SECRET_PUBLIC_KEY,
            message,
        })
        return data.encryptedData.ciphertext.split(",").map((num) => parseInt(num, 10))
    }

    let encryptedBytes = await getEncryptedMessageBytes(JSON.stringify(msg))
    // Log the balances before swapping.
    console.log(encryptedBytes)
    let proposal = await predictionMarket.vote(proposalDetails.id, encryptedBytes)
    console.log(`Proposal created with hash ${proposal.hash}.`)

    console.log("--------------------------------------------------------------")
}

vote()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
