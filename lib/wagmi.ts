import { http, createConfig } from "wagmi";
import { botchainMainnet, botchainTestnet } from "./botchain";
import { injected } from "wagmi/connectors";

export const config = createConfig({
  chains: [botchainMainnet, botchainTestnet],
  connectors: [
    injected({
      target: "metaMask",
    }),
  ],
  transports: {
    [botchainMainnet.id]: http(process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai"),
    [botchainTestnet.id]: http("https://rpc.bohr.life"),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;
