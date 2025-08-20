export const pownsRegistryABI = [
  {
    inputs: [{ name: "name", type: "string" }],
    name: "computeTarget",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "name", type: "string" }],
    name: "isAvailable",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minDepositPerYear",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "owner", type: "address" },
      { name: "miner", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "years_", type: "uint8" },
    ],
    name: "register",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "name", type: "string" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "name", type: "string" }],
    name: "expiresAt",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Extended ABI parts needed for Dashboard
  {
    inputs: [{name: "owner", type: "address"}],
    name: "balanceOf",
    outputs: [{name: "", type: "uint256"}],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{name: "owner", type: "address"}, {name: "index", type: "uint256"}],
    name: "tokenOfOwnerByIndex",
    outputs: [{name: "", type: "uint256"}],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{name: "", type: "uint256"}],
    name: "nameHashes",
    outputs: [{name: "", type: "bytes32"}],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{name: "", type: "bytes32"}],
    name: "names",
    outputs: [{name: "", type: "string"}],
    stateMutability: "view",
    type: "function"
  }
] as const;
