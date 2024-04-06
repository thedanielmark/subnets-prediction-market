"use client";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import CreateWallet from "@/components/CreateWallet";
import ListMarkets from "@/components/ListMarkets";
import ResolveMarket from "@/components/ResolveMarket";

export default function Home() {
  const account = useAccount();

  return (
    <main className="container flex min-h-screen flex-col items-center justify-between p-10">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <div className="relative flex flex-col place-items-center">
        <Image
          className="relative dark:filter dark:invert"
          src="/logo/logo-dark.png"
          alt="Logo"
          width={130}
          height={130}
          priority
        />
        <div className="text-center">
          <div className="text-3xl font-bold">shady</div>
          <div className="text-lg ">Predict with Privacy</div>
        </div>
      </div>

      <section className="lg:max-w-5xl lg:w-full ">
        <div className="text-zinc-400 text-center mb-2">
          {" "}
          &quot;shady&quot; is a Privacy enabled Prediction market that runs on IPC subnets and
          let&apos;s you encrypt your votes to prevent copy-trading and market
          manipulations.{" "}
        </div>{" "}
        <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-full">
          {/* {!account?.address ? (
            <div className="flex justify-center items-center flex-col">
              <h3 className="text-md mb-5">
                Connect your wallet to get started
              </h3>
              <ConnectButton />
            </div>
          ) : (
            <div className="flex justify-center items-start flex-col">
              <div className="flex w-full justify-center items-center">
                <ConnectButton />
              </div>

              {account?.address && (
                <div className="mt-10 flex justify-center items-between flex-col w-full">
                  <CreateWallet />
                </div>
              )}
            </div>
          )} */}
          <div className="mt-2 flex justify-center items-between flex-col w-full">
            <CreateWallet />
          </div>
        </div>
        <p className="text-md mt-3 text-center text-zinc-600">
          Powered by{" "}
          <a className="font-bold" target="_blank" href="https://scrt.network/">
            Secret Network
          </a>
        </p>
      </section>

      <section className="mt-10 ">
        <h3 className="text-md ml-5 text-zinc-600 mb-1">For Hack Secret</h3>
      </section>
    </main>
  );
}
