import { contract } from "@/lib/consts";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWriteContract } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function CreateWallet() {
  const { data: hash, writeContract } = useWriteContract();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    toast({
      title: "Transactions Success",
      description: `Tx Hash: ${hash}`,
    });
  }, []);

  return (
    <div className="grid w-full gap-2 mt-10">
      <h1 className="font-bold text-center">
        Let&apos;s get started by creating a subnet wallet first!
      </h1>
      <Button
        className="inline-block"
        onClick={() => {
          router.push("/subnet");
          // writeContract({
          //   address: contract.address as any,
          //   abi: contract.abi,
          //   functionName: "createMarket",
          //   args: [question],
          // });
        }}
      >
        Create Subnet Wallet
      </Button>
    </div>
  );
}
