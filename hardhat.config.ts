import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

const rawPrivateKey = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";
const BOTCHAIN_PRIVATE_KEY = rawPrivateKey.startsWith("0x") ? rawPrivateKey : `0x${rawPrivateKey}`;
const BOTCHAIN_MAINNET_RPC_URL = process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";
const BOTCHAIN_TESTNET_RPC_URL = "https://rpc.bohr.life";

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
    botchainMainnet: {
      chainId: 677,
      url: BOTCHAIN_MAINNET_RPC_URL,
      accounts: [BOTCHAIN_PRIVATE_KEY],
    },
    botchain: {
      chainId: 968,
      url: BOTCHAIN_TESTNET_RPC_URL,
      accounts: [BOTCHAIN_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      botchainMainnet: process.env.ETHERSCAN_API_KEY || "empty",
      botchain: process.env.ETHERSCAN_API_KEY || "empty",
    },
    customChains: [
      {
        network: "botchainMainnet",
        chainId: 677,
        urls: {
          apiURL: "https://scan.botchain.ai/api",
          browserURL: "https://scan.botchain.ai",
        },
      },
      {
        network: "botchain",
        chainId: 968,
        urls: {
          apiURL: "https://scan.bohr.life/api",
          browserURL: "https://scan.bohr.life",
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
