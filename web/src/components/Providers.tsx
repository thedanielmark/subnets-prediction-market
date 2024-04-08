"use client";
import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import {
  mainnet,
  optimism,
  arbitrum,
  sepolia,
  optimismSepolia,
  arbitrumSepolia,
  polygonMumbai,
} from "wagmi/chains";
import { API_URL } from "@/lib/utils";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { chainConfig } from "viem/zksync";
const queryClient = new QueryClient();

const getChainConfig = async () => {
  console.log('Getting chain config...')
  const data = await fetch(`${API_URL}/subnet-chainId`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const res = await data.json()
  console.log(res)
  if (!res) {
    return polygonMumbai
  }
  return {
    id: parseInt(JSON.parse(res.output).result),
    name: 'Local IPC Subnet',
    network: 'Local IPC Subnet',
    iconBackground: '#fff',
    nativeCurrency: {
      decimals: 18,
      name: 'tFIL',
      symbol: 'tFIL',
    },
    rpcUrls: {
      public: { http: ['https://localhost:8565/'] },
      default: { http: ['https://localhost:8565/'] },
    },
    blockExplorers: {
      default: { name: 'LocalDevNet', url: 'https://localhost:8565/' },
    },
    testnet: true,
  }

}



export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {

  const [chainConfig, setChainConfig] = React.useState<any>(null)
  React.useEffect(() => {
    getChainConfig().then((config) => {
      setChainConfig(config)
    })
  }, [])

  const config = getDefaultConfig({
    appName: "Shady",
    projectId:
      process.env.NEXT_PUBLIC_PROJECT_ID || "2588db3d04914636093b01d564610991",
    chains: [
      // mainnet,
      // optimism,
      // arbitrum,
      // sepolia,
      // optimismSepolia,
      // arbitrumSepolia,
      // polygonMumbai,
      chainConfig ? chainConfig : polygonMumbai
    ],
    ssr: true, // If your dApp uses server side rendering (SSR)
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#111111",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
