import { contract } from "@/lib/consts";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWriteContract } from "wagmi";
import { useToast } from "@/components/ui/use-toast";

function ResolveTrueButton({ marketId }: { marketId: string }) {
  const { data: hash, writeContract } = useWriteContract();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Transactions Success",
      description: `Tx Hash: ${hash}`,
    });
  }, []);
  return (
    <div className="mx-1">
      <Button
        onClick={() => {
          writeContract({
            address: contract.address as any,
            abi: contract.abi,
            functionName: "resolveMarket",
            args: [BigInt(marketId), true],
          });
        }}
      >
        Call
      </Button>
    </div>
  );
}

function ResolveFalseButton({ marketId }: { marketId: string }) {
  const { data: hash, writeContract } = useWriteContract();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Transactions Success",
      description: `Tx Hash: ${hash}`,
    });
  }, []);
  return (
    <div className="mx-1">
      <Button
        onClick={() => {
          writeContract({
            address: contract.address as any,
            abi: contract.abi,
            functionName: "resolveMarket",
            args: [BigInt(marketId), false],
          });
        }}
      >
        Put
      </Button>
    </div>
  );
}

export default function ResolveMarket({ marketId }: { marketId: string }) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="font-bold">
        3) Resolve Market for {marketId ? String(marketId) : "0"}
      </h1>

      <div className="flex">
        <ResolveTrueButton marketId={marketId} />
        <ResolveFalseButton marketId={marketId} />
      </div>
    </div>
  );
}
