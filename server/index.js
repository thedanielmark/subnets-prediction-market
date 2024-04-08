const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const abi = [
    {
        "inputs": [],
        "name": "retrieve",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "num",
                "type": "uint256"
            }
        ],
        "name": "store",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

const byteCode = "0x6080604052348015600e575f80fd5b506101438061001c5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80632e64cec1146100385780636057361d14610056575b5f80fd5b610040610072565b60405161004d919061009b565b60405180910390f35b610070600480360381019061006b91906100e2565b61007a565b005b5f8054905090565b805f8190555050565b5f819050919050565b61009581610083565b82525050565b5f6020820190506100ae5f83018461008c565b92915050565b5f80fd5b6100c181610083565b81146100cb575f80fd5b50565b5f813590506100dc816100b8565b92915050565b5f602082840312156100f7576100f66100b4565b5b5f610104848285016100ce565b9150509291505056fea2646970667358221220a6710181372d0f08d0c328ad9dc690bcf7935799fa8c413722ea2563efaa104b64736f6c63430008190033"

const extractSubnetID = (output) => {
    const regex = /created subnet actor with id: (\S+)/;
    const match = output.match(regex);
    return match ? match[1] : '';
};

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Hello world!"
    })
})

app.post("/create-wallet", async (req, res) => {
    const { exec } = require('child_process');
    exec('/workspaces/filecoin-data-economy/ipc/target/release/ipc-cli wallet new --wallet-type evm', (error, stdout, stderr) => {
        if (error) {
            console.error('Error running ipc-cli to creaate a wallet:', error);
            return;
        }
        console.log({
            stdout,
            stderr
        })
        res.json({
            success: true,
            message: "Wallet created successfully. Fund you wallet using the faucet https://faucet.calibnet.chainsafe-fil.io/funds.html",
            address: stdout.trim()
        })
    });
})

app.post("/create-child-subnet", async (req, res) => {
    const { exec } = require('child_process');
    const { address } = req.body;
    exec(`/workspaces/filecoin-data-economy/ipc/target/release/ipc-cli subnet create --parent /r314159 --min-validator-stake 10 --from ${address} --min-validators 1  --bottomup-check-period 300 --permission-mode collateral --supply-source-kind native`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running ipc-cli to create a child subnet:', error);
            return;
        }
        const subnetIdOutput = stderr;
        const subnetId = extractSubnetID(subnetIdOutput);
        console.log({
            stdout,
            stderr
        })
        res.json({
            success: true,
            message: "Child subnet created successfully",
            subnetId: subnetId
        })
    });
})

app.post("/create-validator", async (req, res) => {
    const { exec } = require('child_process');
    const { address, subnetId } = req.body;
    exec(`/workspaces/filecoin-data-economy/ipc/target/release/ipc-cli wallet pub-key --wallet-type evm --address ${address}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running ipc-cli to create a validator:', error);
            return;
        }
        console.log({
            stdout,
            stderr
        })
        exec(`/workspaces/filecoin-data-economy/ipc/target/release/ipc-cli subnet join --from=${address} --subnet=${subnetId} --collateral=10 --public-key=${stdout.trim()} --initial-balance 10`, (error, stdout, stderr) => {
            console.log({
                stdout,
                stderr
            })
            res.json({
                success: true,
                message: "Validator created and joined the subnet successfully",
                stdout,
                stderr
            })
        })
    });
})

app.post("/deploy-subnet", async (req, res) => {
    const { exec } = require('child_process');
    const { address, subnetId } = req.body;
    exec(`/workspaces/filecoin-data-economy/ipc/target/release/ipc-cli wallet export --wallet-type evm --address ${address} --hex > /home/vscode/.ipc/${address}.sk`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running ipc-cli to deploy a subnet:', error);
            return;
        }
        console.log({
            stdout,
            stderr
        })
        exec(`docker run -it --add-host=host.docker.internal:host-gateway -e "PORT=8545" -d -p 8565:443 esplo/docker-local-ssl-termination-proxy`, (error, stdout, stderr) => {
            console.log({
                stdout,
                stderr
            })
            exec(`cargo make --makefile /workspaces/filecoin-data-economy/ipc/infra/fendermint/Makefile.toml -e NODE_NAME=${address} -e PRIVATE_KEY_PATH=/home/vscode/.ipc/${address}.sk -e SUBNET_ID=${subnetId} -e CMT_P2P_HOST_PORT=26656 -e CMT_RPC_HOST_PORT=26657 -e ETHAPI_HOST_PORT=8545 -e RESOLVER_HOST_PORT=26655 -e PARENT_GATEWAY=$(curl -s https://raw.githubusercontent.com/consensus-shipyard/ipc/cd/contracts/deployments/r314159.json | jq -r '.gateway_addr') -e PARENT_REGISTRY=$(curl -s https://raw.githubusercontent.com/consensus-shipyard/ipc/cd/contracts/deployments/r314159.json | jq -r '.registry_addr') -e FM_PULL_SKIP=1 child-validator
            `, (error, stdout, stderr) => {
                console.log({
                    stdout,
                    stderr
                })
                res.json({
                    success: true,
                    message: "Subnet deployed successfully",
                    stdout,
                    stderr
                })
            })
        })
    });
})

// app.post("/deploy-market", async (req, res) => {
//     const { address } = req.body;
//     const { exec } = require('child_process');
//     const { createWalletClient, http , custom} = require("viem")
//     const { privateKeyToAccount } = require("viem/accounts")

//     const walletClient = createWalletClient({
//         transport: http('http://localhost:8545/')
//     })

//     exec(`cat /home/vscode/.ipc/${address}.sk`, (error, stdout, stderr) => {
//         if (error) {
//             console.error('Error running ipc-cli to deploy a subnet:', error);
//             return;
//         }
//         let key = `0x${stdout.trim()}`
//         console.log(key)
//         const account = privateKeyToAccount(key)
//         walletClient.deployContract({
//             abi,
//             account,
//             bytecode: byteCode,
//             chain: custom('0xac99e23a108a1')
//         }).then((hash) => {
//             console.log(hash)
//             res.json({
//                 success: true,
//                 hash
//             })
//         })
//     })
// })

app.get("/subnet-chainId", async (req, res) => {
    const { exec } = require('child_process');
    exec(`curl http://localhost:8545/ -X POST -H "Content-Type: application/json" --data '{"method":"eth_chainId","params":[],"id":1,"jsonrpc":"2.0"}'`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running ipc-cli to get chainId:', error);
            return;
        }
        console.log({
            stdout,
            stderr
        })
        res.json({
            success: true,
            output: stdout
        })
    })
})

app.listen(8000, () => {
    console.log("Server is running on port 8000")
})