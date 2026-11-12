import { http, createConfig } from "wagmi";
import { botchain } from "./botchain";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [botchain],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchain.id]: http(process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai"),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x05a9C5f650e497790116855838616f30b4E3E8bF") as `0x${string}`;
