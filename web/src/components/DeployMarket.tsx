import { contract } from "@/lib/consts";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWriteContract } from "wagmi";
import { useToast } from "@/components/ui/use-toast";

export default function DeployMarket() {
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
        Finally... let&apos;s deploy your prediction market!
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
        Deploy Market
      </Button>
    </div>
  );
}
