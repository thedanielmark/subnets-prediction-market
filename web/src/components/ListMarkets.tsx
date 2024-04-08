import { contract } from "@/lib/consts";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReadContract } from "wagmi";

export default function ListMarkets() {
  const { data: markets, refetch: getMarketData } = useReadContract({
    address: contract.address as any,
    abi: contract.abi,
    functionName: "marketCount",
    args: [],
  });

  useEffect(() => {
    getMarketData().then(() => console.log(markets)) 
  }, [])

  return (
    <div className="grid w-full mt-10 gap-2">
      <h1 className="font-bold">2) View Markets</h1>

      <div>Markets: {JSON.stringify(markets)}</div>
    </div>
  );
}
