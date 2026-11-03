# MeterLog ⚡

An on-chain electricity meter reading and energy consumption tracker deployed to **Botchain Testnet**. MeterLog enables landlords, property managers, tenants, and businesses to register electricity meters, record periodic meter readings (kWh), compute real-time electricity consumption, and inspect immutable chronological reading histories on-chain.

---

## 🌟 Key Features

1. **MetaMask & Web3 Wallet Integration**
   - Seamless MetaMask connection via Wagmi & Viem.
   - Real-time network detection for **Botchain Testnet (Chain ID: 968)**.
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

## ⛓️ Blockchain Configuration (Botchain Testnet)

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Block Explorer** | `https://scan.bohr.life` |
| **Native Currency** | BOHR |

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
│   ├── botchain.ts           # Botchain Testnet Viem chain definition
│   ├── contractAbi.ts        # Smart contract ABI and TypeScript interfaces
│   ├── utils.ts              # Formatting & helper utilities
│   └── wagmi.ts              # Wagmi configuration
├── scripts/
│   └── deploy.ts             # Hardhat deployment script for Botchain
├── test/
│   └── MeterLog.test.ts      # Comprehensive Hardhat smart contract tests
├── hardhat.config.ts         # Hardhat configuration with Botchain Testnet
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
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_BOTCHAIN_CHAIN_ID=968
NEXT_PUBLIC_BOTCHAIN_EXPLORER=https://scan.bohr.life
NEXT_PUBLIC_CONTRACT_ADDRESS=<DEPLOYED_CONTRACT_ADDRESS>

# For contract deployment
PRIVATE_KEY=<YOUR_PRIVATE_KEY_WITHOUT_0x_OR_WITH_0x>
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

The test suite covers:
- Meter registration and auto-incremented IDs.
- Input validation (rejects empty name or location).
- Initial reading recording (zero baseline consumption).
- Subsequent readings and accurate incremental consumption computation.
- Rejection of readings lower than the previous reading.
- Access control verification (preventing unauthorized reading submissions and edits).
- Meter information updates by owner.
- Chronological reading history retrieval.
- Global statistics aggregation.

---

## 🚢 Deploying to Botchain Testnet

Ensure your deployer account has testnet **BOHR** tokens, then run:

```bash
npm run deploy:botchain
```

The script will:
1. Connect to Botchain Testnet via `https://rpc.bohr.life`.
2. Deploy `MeterLog.sol`.
3. Output the deployed contract address.
4. Update `lib/deployedContract.json` with deployment metadata.

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

Connect MetaMask, make sure your wallet is set to **Botchain Testnet (Chain ID 968)**, and begin logging meter readings!

---

## 🛡️ Security & Integrity

- **On-chain Validation**: Meter readings and ownership access controls are enforced at the smart contract level (`onlyMeterOwner`), preventing invalid or unauthorized state modifications.
- **Permanent Immutable Logs**: Timestamps are secured using `block.timestamp`.
- **Zero Secrets in Frontend**: Private keys are solely used during the deployment phase and never included in client-side bundles.

