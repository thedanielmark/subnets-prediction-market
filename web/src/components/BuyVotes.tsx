import { contract } from "@/lib/consts";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWriteContract } from "wagmi";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

function CallButton({ marketId }: { marketId: string }) {
  const { data: hash, writeContract } = useWriteContract();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Transactions Success",
      description: `Tx Hash: ${hash}`,
    });
  }, []);

  return (
    <div className="">
      <Button
        onClick={() => {
          writeContract({
            address: contract.address as any,
            abi: contract.abi,
            functionName: "createMarket",
            args: [BigInt(marketId), true],
          });
        }}
      >
        Call
      </Button>
    </div>
  );
}

function PutButton({ marketId }: { marketId: string }) {
  const { data: hash, writeContract } = useWriteContract();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Transactions Success",
      description: `Tx Hash: ${hash}`,
    });
  }, []);

  return (
    <div className="">
      <Button
        onClick={() => {
          writeContract({
            address: contract.address as any,
            abi: contract.abi,
            functionName: "buyVotes",
            args: [BigInt(marketId), false],
          });
        }}
      >
        Put
      </Button>
    </div>
  );
}

export default function BuyVotes({ marketId }: { marketId: string }) {
  return (
    <div>
      <CallButton marketId={marketId} />
      <PutButton marketId={marketId} />
    </div>
  );
}
