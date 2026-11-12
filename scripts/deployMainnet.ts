import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("====================================================");
  console.log("🚀 DEPLOYING METERLOG TO MAINNET");
  console.log("Network Name   :", network.name);
  console.log("Chain ID       :", Number(network.chainId));
  console.log("Deployer Wallet:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer Bal   :", ethers.formatEther(balance), "BOT");

  if (balance === BigInt(0)) {
    throw new Error("Deployer account has 0 BOT balance. Please fund the wallet before deploying.");
  }

  // Fetch optimal gas price to avoid overpaying
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
  console.log("Network GasPrice:", ethers.formatUnits(gasPrice, "gwei"), "gwei");

  const MeterLogFactory = await ethers.getContractFactory("MeterLog", deployer);
  const deployTx = await MeterLogFactory.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  const estimatedCost = estimatedGas * gasPrice;

  console.log("Estimated Gas  :", estimatedGas.toString(), "units");
  console.log("Estimated Cost :", ethers.formatEther(estimatedCost), "BOT");
  console.log("====================================================");

  // Deploy with exact gas parameters to prevent overcharging
  console.log("Broadcasting deployment transaction...");
  const meterLog = await MeterLogFactory.deploy({
    gasPrice: gasPrice,
  });

  console.log("Tx hash:", meterLog.deploymentTransaction()?.hash);
  console.log("Waiting for confirmation on Botchain Mainnet...");
  await meterLog.waitForDeployment();

  const contractAddress = await meterLog.getAddress();
  console.log("----------------------------------------------------");
  console.log("🎉 MeterLog deployed successfully to:", contractAddress);
  console.log("Explorer URL:", `https://scan.botchain.ai/address/${contractAddress}`);
  console.log("----------------------------------------------------");

  // Save metadata
  const deployedInfo = {
    address: contractAddress,
    network: "botchainMainnet",
    chainId: 677,
    deployedAt: new Date().toISOString(),
    txHash: meterLog.deploymentTransaction()?.hash,
  };

  const libDir = path.join(process.cwd(), "lib");
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(libDir, "deployedContract.json"),
    JSON.stringify(deployedInfo, null, 2)
  );
  console.log("Deployment record saved to lib/deployedContract.json");

  // Update .env.local
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");
    if (envContent.includes("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log("Updated NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
  }
}

main().catch((error) => {
  console.error("Mainnet deployment failed:", error);
  process.exitCode = 1;
});
