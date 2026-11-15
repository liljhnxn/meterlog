require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function main() {
  const rpcUrl = process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || 'https://rpc.botchain.ai';
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x05a9C5f650e497790116855838616f30b4E3E8bF';
  const artifactPath = path.join(__dirname, '../artifacts/contracts/MeterLog.sol/MeterLog.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  const pk1 = process.env.PRIVATE_KEY;
  const pk2 = process.env.PRIVATE_KEY_2;
  const pk3 = process.env.PRIVATE_KEY_3;

  if (!pk1 || !pk2 || !pk3) {
    throw new Error('Please configure PRIVATE_KEY, PRIVATE_KEY_2, and PRIVATE_KEY_3 in .env / .env.local');
  }

  const wallet1 = new ethers.Wallet(pk1, provider);
  const wallet2 = new ethers.Wallet(pk2, provider);
  const wallet3 = new ethers.Wallet(pk3, provider);

  const contract1 = new ethers.Contract(contractAddress, artifact.abi, wallet1);
  const contract2 = new ethers.Contract(contractAddress, artifact.abi, wallet2);
  const contract3 = new ethers.Contract(contractAddress, artifact.abi, wallet3);

  console.log('=== Checking Balances ===');
  const b1 = await provider.getBalance(wallet1.address);
  const b2 = await provider.getBalance(wallet2.address);
  const b3 = await provider.getBalance(wallet3.address);
  console.log(`Wallet 1 (${wallet1.address}): ${ethers.formatEther(b1)} BOT`);
  console.log(`Wallet 2 (${wallet2.address}): ${ethers.formatEther(b2)} BOT`);
  console.log(`Wallet 3 (${wallet3.address}): ${ethers.formatEther(b3)} BOT`);

  const results = [
    {
      interaction: 1,
      action: 'registerMeter',
      wallet: wallet1.address,
      txHash: '0x285286bff0fc66bd1320d897e7614f4c2fb3d76f9758aa393ea64becaf6a08b3',
      blockNumber: 30346236,
      gasUsed: '369297',
      details: 'Meter #1: Main Residence Electric'
    },
    {
      interaction: 2,
      action: 'recordReading',
      wallet: wallet1.address,
      txHash: '0x9bc58267729e28f52f035efbf745b8642419d734eeff236c8198bb4b515025b6',
      blockNumber: 30346385,
      gasUsed: '193521',
      details: 'Recorded 1420 kWh for Meter #1'
    }
  ];

  const gasPrice = ethers.parseUnits('20', 'gwei');

  // Interaction 3: Wallet 2 registers Meter #2
  console.log('\n--- Interaction 3 (Wallet 2): registerMeter #2 ---');
  const tx3 = await contract2.registerMeter(
    'EV Charging Station',
    'Garage Bay #12',
    'Dedicated 240V Level 2 charger circuit',
    { gasPrice, gasLimit: 400000 }
  );
  console.log(`Tx3 sent: ${tx3.hash}`);
  const receipt3 = await tx3.wait();
  console.log(`Tx3 confirmed in block ${receipt3.blockNumber} (Gas used: ${receipt3.gasUsed.toString()})`);
  const meterId2 = (await contract2.getTotalMeters()).toString();
  results.push({
    interaction: 3,
    action: 'registerMeter',
    wallet: wallet2.address,
    txHash: tx3.hash,
    blockNumber: receipt3.blockNumber,
    gasUsed: receipt3.gasUsed.toString(),
    details: `Meter #${meterId2}: EV Charging Station`
  });

  // Interaction 4: Wallet 2 records reading on Meter #2
  console.log('\n--- Interaction 4 (Wallet 2): recordReading for Meter #2 ---');
  const tx4 = await contract2.recordReading(meterId2, 350, { gasPrice, gasLimit: 400000 });
  console.log(`Tx4 sent: ${tx4.hash}`);
  const receipt4 = await tx4.wait();
  console.log(`Tx4 confirmed in block ${receipt4.blockNumber} (Gas used: ${receipt4.gasUsed.toString()})`);
  results.push({
    interaction: 4,
    action: 'recordReading',
    wallet: wallet2.address,
    txHash: tx4.hash,
    blockNumber: receipt4.blockNumber,
    gasUsed: receipt4.gasUsed.toString(),
    details: `Recorded 350 kWh for Meter #${meterId2}`
  });

  // Interaction 5: Wallet 3 registers Meter #3
  console.log('\n--- Interaction 5 (Wallet 3): registerMeter #3 ---');
  const tx5 = await contract3.registerMeter(
    'Solar Rooftop Array',
    'Rooftop North Array',
    'Photovoltaic generation bi-directional meter',
    { gasPrice, gasLimit: 400000 }
  );
  console.log(`Tx5 sent: ${tx5.hash}`);
  const receipt5 = await tx5.wait();
  console.log(`Tx5 confirmed in block ${receipt5.blockNumber} (Gas used: ${receipt5.gasUsed.toString()})`);
  const meterId3 = (await contract3.getTotalMeters()).toString();
  results.push({
    interaction: 5,
    action: 'registerMeter',
    wallet: wallet3.address,
    txHash: tx5.hash,
    blockNumber: receipt5.blockNumber,
    gasUsed: receipt5.gasUsed.toString(),
    details: `Meter #${meterId3}: Solar Rooftop Array`
  });

  console.log('\n=== Summary of Interactions ===');
  console.log(JSON.stringify(results, null, 2));

  const stats = await contract1.getGlobalStats();
  console.log('\n=== Final MeterLog Stats ===');
  console.log(`Total Meters: ${stats[0].toString()}`);
  console.log(`Total Readings: ${stats[1].toString()}`);
  console.log(`Total Consumption: ${stats[2].toString()} kWh`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
