import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

const rawPrivateKey = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";
const BOTCHAIN_PRIVATE_KEY = rawPrivateKey.startsWith("0x") ? rawPrivateKey : `0x${rawPrivateKey}`;
const BOTCHAIN_RPC_URL = process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545",
    },
    botchain: {
      chainId: 677,
      url: BOTCHAIN_RPC_URL,
      accounts: [BOTCHAIN_PRIVATE_KEY],
    },
    botchainMainnet: {
      chainId: 677,
      url: BOTCHAIN_RPC_URL,
      accounts: [BOTCHAIN_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      botchain: process.env.ETHERSCAN_API_KEY || "empty",
      botchainMainnet: process.env.ETHERSCAN_API_KEY || "empty",
    },
    customChains: [
      {
        network: "botchain",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
      {
        network: "botchainMainnet",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
