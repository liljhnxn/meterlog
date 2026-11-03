export const METER_LOG_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "meterId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "location", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "MeterRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "meterId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "readingKwh", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "consumption", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
      { indexed: true, internalType: "address", name: "recordedBy", type: "address" },
    ],
    name: "ReadingRecorded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "meterId", type: "uint256" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "location", type: "string" },
      { indexed: false, internalType: "string", name: "description", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "MeterUpdated",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "meterId", type: "uint256" }],
    name: "getMeter",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "location", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "uint256", name: "registrationDate", type: "uint256" },
          { internalType: "uint256", name: "lastUpdated", type: "uint256" },
          { internalType: "uint256", name: "latestReading", type: "uint256" },
          { internalType: "uint256", name: "totalConsumption", type: "uint256" },
          { internalType: "uint256", name: "readingCount", type: "uint256" },
          { internalType: "bool", name: "exists", type: "bool" },
        ],
        internalType: "struct MeterLog.Meter",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "meterId", type: "uint256" }],
    name: "getMeterReadings",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "readingKwh", type: "uint256" },
          { internalType: "uint256", name: "consumption", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "address", name: "recordedBy", type: "address" },
          { internalType: "bool", name: "isInitial", type: "bool" },
        ],
        internalType: "struct MeterLog.Reading[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllMeters",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "location", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "uint256", name: "registrationDate", type: "uint256" },
          { internalType: "uint256", name: "lastUpdated", type: "uint256" },
          { internalType: "uint256", name: "latestReading", type: "uint256" },
          { internalType: "uint256", name: "totalConsumption", type: "uint256" },
          { internalType: "uint256", name: "readingCount", type: "uint256" },
          { internalType: "bool", name: "exists", type: "bool" },
        ],
        internalType: "struct MeterLog.Meter[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "getMetersByOwner",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalMeters",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalReadingsRecorded",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "previousReading", type: "uint256" },
      { internalType: "uint256", name: "currentReading", type: "uint256" },
    ],
    name: "calculateConsumption",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getGlobalStats",
    outputs: [
      { internalType: "uint256", name: "totalMeters", type: "uint256" },
      { internalType: "uint256", name: "totalReadings", type: "uint256" },
      { internalType: "uint256", name: "totalSystemConsumption", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "location", type: "string" },
      { internalType: "string", name: "description", type: "string" },
    ],
    name: "registerMeter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "meterId", type: "uint256" },
      { internalType: "uint256", name: "readingKwh", type: "uint256" },
    ],
    name: "recordReading",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "meterId", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "location", type: "string" },
      { internalType: "string", name: "description", type: "string" },
    ],
    name: "updateMeter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export interface MeterData {
  id: bigint;
  owner: string;
  name: string;
  location: string;
  description: string;
  registrationDate: bigint;
  lastUpdated: bigint;
  latestReading: bigint;
  totalConsumption: bigint;
  readingCount: bigint;
  exists: boolean;
}

export interface ReadingData {
  readingKwh: bigint;
  consumption: bigint;
  timestamp: bigint;
  recordedBy: string;
  isInitial: boolean;
}

