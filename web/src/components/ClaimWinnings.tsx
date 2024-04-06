import { contract } from "@/lib/consts";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWriteContract } from "wagmi";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function ClaimWinnings({ marketId }: { marketId: string }) {
  const { data: hash, writeContract } = useWriteContract();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Transactions Success",
      description: `Tx Hash: ${hash}`,
    });
  }, []);

  return (
    <div className="grid w-full gap-2">
      <Button
        onClick={() => {
          writeContract({
            address: contract.address as any,
            abi: contract.abi,
            functionName: "claimWinnings",
            args: [BigInt(marketId)],
          });
        }}
      >
        Claim Winnings
      </Button>
    </div>
  );
}
