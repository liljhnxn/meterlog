import { defineChain } from "viem";

export const botchain = defineChain({
  id: 677,
  name: "BOT Chain",
  nativeCurrency: {
    decimals: 18,
    name: "BOT",
    symbol: "BOT",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai"],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai"],
    },
  },
  blockExplorers: {
    default: {
      name: "BOT Chain Explorer",
      url: process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER || "https://scan.botchain.ai",
    },
  },
  testnet: false,
});

export const botchainMainnet = botchain;
export const activeChain = botchain;
