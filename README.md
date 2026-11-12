# MeterLog ⚡

An on-chain electricity meter reading and energy consumption tracker deployed to **Botchain Mainnet**. MeterLog enables landlords, property managers, tenants, and businesses to register electricity meters, record periodic meter readings (kWh), compute real-time electricity consumption, and inspect immutable chronological reading histories on-chain.

---

## 🌟 Key Features

1. **MetaMask & Web3 Wallet Integration**
   - Seamless MetaMask connection via Wagmi & Viem.
   - Real-time network detection for **Botchain Mainnet (Chain ID: 677)**.
   - Interactive prompt to switch networks with a single click if an unsupported chain is selected.

2. **Meter Registration**
   - Register new electricity meters with Name, Location, and optional Description.
   - Automatic unique ID generation and ownership attribution to the submitter's wallet address.
   - Emits the `MeterRegistered` event on-chain.

3. **Meter Reading Logging & Automatic Consumption Computation**
   - Record subsequent meter readings in kilowatt-hours (kWh).
   - Validates that new readings are strictly non-decreasing (`newReading >= latestReading`).
   - Automatically computes incremental consumption (`readingKwh - previousReading`).
   - First reading establishes the baseline, showing consumption as "Initial Reading".
   - Emits the `ReadingRecorded` event on-chain.

4. **Public Verification & Strict Access Control**
   - **Public Records**: Anyone can inspect public meter records, latest readings, and full chronological history.
   - **Owner Controls**: Only the registered meter owner has permission to submit new readings or modify meter metadata (`updateMeter`).

5. **Utility-Tech Dashboard**
   - Dark charcoal palette with muted emerald green accents, soft gray text, and subtle card borders.
   - Summary cards displaying total registered meters, total readings submitted, latest meter reading, and cumulative system consumption.
   - Search & filter capabilities (Search by name/location/ID, or filter by "My Meters").
   - Detailed modal showing complete chronological logs with timestamps, delta kWh, and recorder addresses.

---

## ⛓️ Blockchain Configuration (Botchain Mainnet)

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Mainnet |
| **Chain ID** | `677` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Native Currency** | BOT |
| **Deployed Contract** | [`0x05a9C5f650e497790116855838616f30b4E3E8bF`](https://scan.botchain.ai/address/0x05a9C5f650e497790116855838616f30b4E3E8bF#code) |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Smart Contracts**: Solidity `^0.8.20`
- **Development & Testing Harness**: Hardhat
- **Web3 Libraries**: Wagmi v2, Viem v2, TanStack React Query

---

## 📂 Project Structure

```text
MeterLog/
├── app/
│   ├── globals.css           # Custom theme colors (charcoal, muted green)
│   ├── layout.tsx            # Root layout with Wagmi & React Query providers
│   └── page.tsx              # Main dashboard page
├── components/
│   ├── Header.tsx            # Navigation, wallet connection, network pill
│   ├── NetworkBanner.tsx     # Wrong-network warning banner
│   ├── SummaryCards.tsx      # High-level statistics
│   ├── MeterList.tsx         # Searchable meter table & filter
│   ├── MeterDetailModal.tsx  # Chronological reading history modal
│   ├── RegisterMeterModal.tsx# Meter registration dialog
│   ├── RecordReadingModal.tsx# kWh reading submission modal
│   └── EditMeterModal.tsx    # Meter metadata edit modal
├── contracts/
│   └── MeterLog.sol          # Primary Solidity smart contract
├── lib/
│   ├── botchain.ts           # BOT Chain Viem chain definition
│   ├── contractAbi.ts        # Smart contract ABI and TypeScript interfaces
│   ├── utils.ts              # Formatting & helper utilities
│   └── wagmi.ts              # Wagmi configuration
├── scripts/
│   ├── deploy.ts             # Hardhat deployment script for BOT Chain
│   └── deployMainnet.ts      # Gas-optimized mainnet deploy script
├── test/
│   └── MeterLog.test.ts      # Comprehensive Hardhat smart contract tests
├── hardhat.config.ts         # Hardhat configuration with BOT Chain Mainnet
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Ensure your `.env.local` contains:
```env
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_BOTCHAIN_CHAIN_ID=677
NEXT_PUBLIC_BOTCHAIN_EXPLORER=https://scan.botchain.ai
NEXT_PUBLIC_CONTRACT_ADDRESS=0x05a9C5f650e497790116855838616f30b4E3E8bF

# For contract deployment
PRIVATE_KEY=<YOUR_PRIVATE_KEY>
```

---

## 🧪 Smart Contract Testing & Compilation

Compile the Solidity contract:
```bash
npm run compile
```

Run the complete test suite:
```bash
npm run test
```

---

## 🚢 Deploying to Botchain Mainnet

Ensure your deployer account has native **BOT** tokens, then run:

```bash
npm run deploy:mainnet
```

The script will:
1. Connect to Botchain Mainnet via `https://rpc.botchain.ai`.
2. Estimate optimal gas parameters (~0.028 BOT) to prevent overpaying fees.
3. Deploy `MeterLog.sol`.
4. Output the deployed contract address.
5. Update `lib/deployedContract.json` and `.env.local` automatically.

After deploying, copy the deployed address into your `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedAddressHere
```

---

## 💻 Running the Web Application

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Connect MetaMask, make sure your wallet is set to **BOT Chain Mainnet (Chain ID 677)**, and begin logging meter readings!

---

## 🔗 Official Ecosystem Links

* **BOT Chain Website**: [https://botchain.ai](https://botchain.ai)
* **BOT Chain Explorer**: [https://scan.botchain.ai](https://scan.botchain.ai)
* **Verified Contract**: [https://scan.botchain.ai/address/0x05a9C5f650e497790116855838616f30b4E3E8bF#code](https://scan.botchain.ai/address/0x05a9C5f650e497790116855838616f30b4E3E8bF#code)

---

## 🛡️ Security & Integrity

- **On-chain Validation**: Meter readings and ownership access controls are enforced at the smart contract level (`onlyMeterOwner`), preventing invalid or unauthorized state modifications.
- **Permanent Immutable Logs**: Timestamps are secured using `block.timestamp`.
- **Zero Secrets in Frontend**: Private keys are solely used during the deployment phase and never included in client-side bundles.

