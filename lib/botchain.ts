import { defineChain } from "viem";

export const botchainMainnet = defineChain({
  id: 677,
  name: "Botchain Mainnet",
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
      name: "BotchainScan",
      url: process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER || "https://scan.botchain.ai",
    },
  },
  testnet: false,
});

export const botchainTestnet = defineChain({
  id: 968,
  name: "Botchain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "BOHR",
    symbol: "BOHR",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.bohr.life"],
    },
    public: {
      http: ["https://rpc.bohr.life"],
    },
  },
  blockExplorers: {
    default: {
      name: "BohrScan",
      url: "https://scan.bohr.life",
    },
  },
  testnet: true,
});

export const activeChain = botchainMainnet;
