import hre from "hardhat";
const { ethers } = hre;
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("----------------------------------------------------");
  console.log("Deploying MeterLog contract with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BOT");

  const MeterLogFactory = await ethers.getContractFactory("MeterLog");
  const meterLog = await MeterLogFactory.deploy();
  await meterLog.waitForDeployment();

  const contractAddress = await meterLog.getAddress();
  console.log("MeterLog successfully deployed to:", contractAddress);
  console.log("Explorer:", `https://scan.botchain.ai/address/${contractAddress}`);
  console.log("----------------------------------------------------");

  // Save deployed address and ABI to frontend lib directory
  const deployedInfo = {
    address: contractAddress,
    network: "botchain",
    chainId: 677,
    deployedAt: new Date().toISOString(),
  };

  const libDir = path.join(process.cwd(), "lib");
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(libDir, "deployedContract.json"),
    JSON.stringify(deployedInfo, null, 2)
  );

  console.log("Contract deployment metadata saved to lib/deployedContract.json");

  // Also update .env.local
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
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
