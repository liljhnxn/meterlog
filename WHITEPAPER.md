# MeterLog: Decentralized Electricity Meter & Consumption Ledger
**A Lightweight On-Chain Utility Verification Protocol on Botchain**

*Version 1.1 — November 2026*  
*Network: Botchain Mainnet (Chain ID: 677)*  
*Verified Mainnet Contract: [0x05a9C5f650e497790116855838616f30b4E3E8bF](https://scan.botchain.ai/address/0x05a9C5f650e497790116855838616f30b4E3E8bF#code)*  
*GitHub: [https://github.com/liljhnxn/meterlog](https://github.com/liljhnxn/meterlog)*

---

## 1. Executive Summary

Utility billing disputes between property managers, landlords, tenants, and commercial occupants are among the most persistent points of friction in global property leasing. Traditional utility tracking relies on manual meter checks, error-prone paper logs, or centralized spreadsheets with zero cryptographic verifiability.

**MeterLog** is an on-chain electricity meter logging and energy consumption protocol deployed on **Botchain Testnet**. It enables property managers and occupants to register meters, log periodic kilowatt-hour (kWh) readings, and calculate energy consumption through automated smart contract logic. By ensuring that historical data is immutable, timestamped by the block header, and publicly verifiable, MeterLog removes trust dependencies, eliminates billing disagreements, and establishes an auditable baseline for energy accountability.

---

## 2. Problem Statement

1. **Information Asymmetry & Disputes**: Landlords and sub-tenants frequently argue over post-dated utility bills due to the lack of transparent, verifiable intermediate readings.
2. **Data Tampering & Fabrication**: Centralized databases and paper notebooks can be easily retroactively altered or lost.
3. **Hardware Lock-in & High Costs**: Proprietary smart-meter IoT hardware with centralized SaaS subscriptions is prohibitively expensive for small landlords, student hostels, and developing markets.
4. **Lack of Standardized Audit Trails**: Dispute resolution typically requires manual third-party mediation without an immutable historical record.

---

## 3. The MeterLog Solution

MeterLog delivers a lightweight, accessible Web3 alternative that works with **any standard electricity meter** (digital or analog dial):

* **Cryptographic Immutability**: Every meter reading (kWh) is recorded as an immutable blockchain transaction.
* **On-Chain Consumption Calculation**: Delta energy consumption is computed automatically by contract code (`currentReading - previousReading`), preventing arbitrary calculations.
* **Mathematical Integrity Enforcement**: Smart contract bytecode strictly rejects backwards or decreasing readings (`require(readingKwh >= latestReading)`).
* **Decentralized Access Control**: Only authenticated meter owners can submit readings or edit metadata; all reading logs remain publicly inspectable by tenants and auditors.
* **Low-Cost Execution**: Built on Botchain's high-throughput, low-latency architecture, making periodic updates negligible in gas costs.

---

## 4. System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Frontend Layer                       │
│     Next.js 14 App Router • Tailwind CSS • Wagmi v2    │
└───────────────────────────┬────────────────────────────┘
                            │ Viem / EIP-1193 (MetaMask)
┌───────────────────────────▼────────────────────────────┐
│                Botchain Testnet (EVM)                  │
│       RPC: https://rpc.bohr.life (Chain ID: 968)       │
└───────────────────────────┬────────────────────────────┘
                            │ EVM Bytecode Execution
┌───────────────────────────▼────────────────────────────┐
│                    MeterLog.sol                        │
│   • registerMeter()       • recordReading()            │
│   • updateMeter()         • getMeterReadings()         │
│   • getAllMeters()        • calculateConsumption()     │
└────────────────────────────────────────────────────────┘
```

### Smart Contract Structure (`MeterLog.sol`)

- **`Reading` Struct**: Stores `readingKwh`, `consumption`, `timestamp`, `recordedBy`, and `isInitial`.
- **`Meter` Struct**: Stores `id`, `owner`, `name`, `location`, `description`, `registrationDate`, `lastUpdated`, `latestReading`, `totalConsumption`, and `readingCount`.
- **Events Emitted**:
  - `MeterRegistered(uint256 indexed meterId, address indexed owner, string name, string location, uint256 timestamp)`
  - `ReadingRecorded(uint256 indexed meterId, uint256 readingKwh, uint256 consumption, uint256 timestamp, address indexed recordedBy)`
  - `MeterUpdated(uint256 indexed meterId, string name, string location, string description, uint256 timestamp)`

---

## 5. Pitch Deck Overview (Slides Breakdown)

### Slide 1: Cover
* **Title**: MeterLog ⚡
* **Subtitle**: Verifiable, On-Chain Utility Tracking on Botchain
* **Tagline**: Eliminating utility billing disputes with immutable energy accounting.

### Slide 2: The Problem
* Landlords & tenants face constant billing disagreements.
* Sub-metered properties (hostels, co-working spaces, commercial plazas) lack transparent data.
* Proprietary IoT solutions are too expensive ($500+ per meter + monthly SaaS).

### Slide 3: The Solution
* An accessible dApp that turns any standard meter into a transparent, verifiable on-chain utility log.
* Zero proprietary hardware required.
* Strict smart-contract enforced calculations and timestamps.

### Slide 4: Target Market
* **Student Hostels & Co-living Spaces**: Sub-metered rooms with frequent tenant turnover.
* **Commercial Plazas & Multi-Tenant Offices**: Transparent sub-leasing utility allocation.
* **Residential Landlords**: Trustless historical records for security deposit reconciliations.

### Slide 5: Product & Live Demo
* **Live Deployment**: Botchain Mainnet (Chain ID 677).
* **Contract**: `0x05a9C5f650e497790116855838616f30b4E3E8bF`
* **Features**: One-click MetaMask connect, network switch prompts, live kWh delta previews, chronological audit modals, and search filters.

### Slide 6: Ecosystem Synergy with Botchain
* High transaction volume from frequent utility logs.
* Real-world asset (RWA) data bridging physical utilities onto Botchain.
* Foundation for automated micropayments and AI-driven energy optimization agents.

### Slide 7: Roadmap
* **Phase 1 (Completed)**: Core protocol deployment to Botchain Mainnet, unit tests (17/17 passing), BotchainScan verification, responsive dApp.
* **Phase 2 (Q1 2027)**: Mobile-optimized photo verification (OCR reading recognition) & push alerts.
* **Phase 3 (Q2 2027)**: Automated tariff rate conversion (kWh to BOT native token billing & escrow settlements).
* **Phase 4 (Q3 2027)**: Botchain AI agent integration for predictive energy consumption and anomaly detection.

---

## 6. Security, Testing & Verification

* **Unit Testing**: 100% test pass rate (17 Hardhat unit tests covering edge cases, math constraints, and access control).
* **Source Code Verification**: Fully verified source code and ABI available on [BotchainScan](https://scan.botchain.ai/address/0x05a9C5f650e497790116855838616f30b4E3E8bF#code).
* **Zero Secret Exposure**: Client-side architecture with zero private key retention; all transactions are signed via user-approved Web3 wallets.

---

## 7. Official Project Links

* **Live dApp Repository**: [https://github.com/liljhnxn/meterlog](https://github.com/liljhnxn/meterlog)
* **Contract on Mainnet Explorer**: [https://scan.botchain.ai/address/0x05a9C5f650e497790116855838616f30b4E3E8bF#code](https://scan.botchain.ai/address/0x05a9C5f650e497790116855838616f30b4E3E8bF#code)
* **Mainnet RPC Endpoint**: `https://rpc.botchain.ai`

