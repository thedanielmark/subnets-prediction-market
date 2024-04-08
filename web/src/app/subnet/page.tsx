"use client";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { API_URL } from "@/lib/utils";
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"


export default function Home() {
    const [operatorWalletAddress, setOperatorWalletAddress] = useState()
    const [subnetId, setSubnetId] = useState()
    const [createWalletLoading, setCreateWalletLoading] = useState(false)
    const [createSubnetLoading, setCreateSubnetLoading] = useState(false)
    const [createValidatorLoading, setCreateValidatorLoading] = useState(false)
    const [deploySubnetLoading, setDeploySubnetLoading] = useState(false)
    const [deployMarketLoading, setDeployMarketLoading] = useState(false)
    const [chainConfigLoading, setChainConfigLoading] = useState(false)
    const [chainDetails, setChainDetails] = useState({
        url: "https://calibration-rpc.ipc.space",
        hexId: "0x1",
        decId: 1
    })
    const router = useRouter();

    useEffect(() => { }, []);

    const createWallet = async () => {
        console.log('Creating wallet...')
        setCreateWalletLoading(true)
        const data = await fetch(`${API_URL}/create-wallet`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
        const res = await data.json()
        // console.log(res)
        setOperatorWalletAddress(res.address.toString().replaceAll("\"", ""))
        setCreateWalletLoading(false)
    }

    const createSubnet = async () => {
        console.log('Creating subnet...')
        setCreateSubnetLoading(true)
        const data = await fetch(`${API_URL}/create-child-subnet`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: operatorWalletAddress
            }),
        })
        const res = await data.json()
        // console.log(res)
        setSubnetId(res.subnetId.toString())
        setCreateSubnetLoading(false)
    }

    const createValidator = async () => {
        console.log('Creating validator...')
        setCreateValidatorLoading(true)
        const data = await fetch(`${API_URL}/create-validator`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: operatorWalletAddress,
                subnetId: subnetId
            }),
        })
        const res = await data.json()
        console.log(res)
        setCreateValidatorLoading(false)
    }

    const deploySubnet = async () => {
        console.log('Deploying subnet...')
        setDeploySubnetLoading(true)
        const data = await fetch(`${API_URL}/deploy-subnet`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: operatorWalletAddress,
                subnetId: subnetId
            }),
        })
        const res = await data.json()
        console.log(res)
        setDeploySubnetLoading(false)
    }

    const deployMarket = async () => {
        console.log('Deploying market...')
        setDeployMarketLoading(true)
        const data = await fetch(`${API_URL}/deploy-market`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: operatorWalletAddress,
            }),
        })
        const res = await data.json()
        console.log(res)
        setDeployMarketLoading(false)
    }

    const getChainConfig = async () => {
        console.log('Getting chain config...')
        setChainConfigLoading(true)
        const data = await fetch(`${API_URL}/subnet-chainId`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const res = await data.json()
        console.log(res)
        setChainDetails({
            url: 'http://localhost:8545/',
            hexId: JSON.parse(res.output).result,
            decId: parseInt(JSON.parse(res.output).result)
        })

        setChainConfigLoading(false)
    }

    return (
        <main className="container flex min-h-screen flex-col items-center justify-between p-10">
            <div className="absolute top-5 right-5">
                <ModeToggle />
            </div>
            <section className="lg:max-w-5xl lg:w-full mt-24">
                <div className="text-zinc-400 text-center mb-2">
                    {" "}
                    &quot;shady&quot; is a Privacy enabled Prediction market that runs on IPC Subnets
                    and
                    let&apos;s you encrypt your votes to prevent copy-trading and market
                    manipulations.{" "}
                </div>

                <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-full">
                    <div className="grid w-full gap-2 mt-10">
                        <h1 className="font-bold">1) Create Subnet Wallet</h1>
                        <p>Your subnet wallet address : {operatorWalletAddress && operatorWalletAddress}</p>
                        <Button onClick={() => createWallet()} disabled={createWalletLoading}>
                            {createWalletLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                : null}
                            Create Wallet
                        </Button>
                        <p className="text-sm mt-2 text-zinc-600">
                            Fund your wallet using{" "}
                            <a className="font-bold" target="_blank" href="https://faucet.calibnet.chainsafe-fil.io/funds.html">
                                Calibration Faucets
                            </a>
                        </p>
                    </div>
                    <div className="grid w-full gap-2 mt-10">
                        <h1 className="font-bold">2) Create Child Subnet</h1>
                        <p>Your subnet ID : {subnetId && subnetId}</p>
                        <Button onClick={() => createSubnet()} disabled={createSubnetLoading}>
                            {createSubnetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                : null}
                            Create Subnet
                        </Button>
                    </div>
                    <div className="grid w-full gap-2 mt-10">
                        <h1 className="font-bold">3) Create validator node</h1>
                        <div className="flex gap-3">
                            <Input
                                className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black"
                                value={operatorWalletAddress}
                                placeholder="Operator subnet wallet address goes here."
                                readOnly
                            />
                            <Input
                                className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black"
                                value={subnetId}
                                placeholder="Your subnet Id goes here."
                                readOnly
                            />
                        </div>
                        <Button onClick={createValidator} disabled={createValidatorLoading}>
                            {createValidatorLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create Validator
                        </Button>
                    </div>
                    <div className="grid w-full gap-2 mt-10">
                        <h1 className="font-bold">4) Deploy subnet infrastructure</h1>
                        <div className="flex gap-3">
                            <Input
                                className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black"
                                value={operatorWalletAddress}
                                placeholder="Operator subnet wallet address goes here."
                                readOnly
                            />
                            <Input
                                className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black"
                                value={subnetId}
                                placeholder="Your subnet Id goes here."
                                readOnly
                            />
                        </div>
                        <Button onClick={deploySubnet} disabled={deploySubnetLoading}>
                            {deploySubnetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Deploy Subnet
                        </Button>
                    </div>
                    {/* <div className="grid w-full gap-2 mt-10">
                        <h1 className="font-bold">5) Yaaay.. Deploy your contract</h1>
                        <Button onClick={() => deployMarket()} disabled={deployMarketLoading}>
                            {deployMarketLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Deploy contract
                        </Button>
                    </div> */}
                    <div className="grid w-full gap-2 mt-10">
                        <h1 className="font-bold">5) Yaaay.. Get your chain Configuration</h1>
                        <Button onClick={() => getChainConfig()} disabled={chainConfigLoading}>
                            {chainConfigLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Get Chain Configuration
                        </Button>
                        <div className="flex justify-around">
                            <p className="mt-2 font-medium">RPC Url : {chainDetails.url}</p>
                            {/* <p className="mt-2 font-medium">Hex ChainId : {chainDetails.hexId}</p> */}
                            <p className="mt-2 font-medium">Dec ChainId : {chainDetails.decId}</p>
                        </div>
                    </div>
                    <div className="flex justify-center my-6">
                        <Button onClick={() => router.push("/")}>Back to Home</Button>
                    </div>
                </div>
                <p className="text-md mt-3 text-center text-zinc-600">
                    Powered by{" "}
                    <a className="font-bold" target="_blank" href="https://ipc.space/">
                        IPC Subnets
                    </a>
                </p>
            </section>

            <section className="mt-10 ">
                <h3 className="text-md ml-5 text-zinc-600 mb-1">For Hack Secret</h3>
            </section>
        </main>
    );
}
