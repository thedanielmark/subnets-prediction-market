import { contract } from "@/lib/consts";
import { useReadContract } from "wagmi";

export default function ViewMarket({ marketId }: { marketId: string }) {
  const { data: markets } = useReadContract({
    address: contract.address as any,
    abi: contract.abi,
    functionName: "markets",
    args: [BigInt(marketId)],
  });

  return (
    <div className="grid w-full gap-2">
      <div>Market: {markets?.toString()}</div>
    </div>
  );
}
