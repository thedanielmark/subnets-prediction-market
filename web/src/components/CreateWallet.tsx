import { contract } from "@/lib/consts";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWriteContract } from "wagmi";
import { useToast } from "@/components/ui/use-toast";

export default function CreateWallet() {
  const { data: hash, writeContract } = useWriteContract();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Transactions Success",
      description: `Tx Hash: ${hash}`,
    });
  }, []);

  return (
    <div className="grid w-full gap-2 mt-10">
      <h1 className="font-bold text-center">
        Let&apos;s get started by creating a wallet first!
      </h1>
      <Button
        className="inline-block"
        onClick={() => {
          // writeContract({
          //   address: contract.address as any,
          //   abi: contract.abi,
          //   functionName: "createMarket",
          //   args: [question],
          // });
        }}
      >
        Create Wallet
      </Button>
    </div>
  );
}
