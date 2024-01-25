import { ethers } from "ethers";
import { contractAddress, contractABI } from "../../constants.js";

// Initialize a provider
const provider = new ethers.JsonRpcProvider(
  process.env.POLYGON_MUMBAI_RPC_PROVIDER
);

// Initialize and export the contract
export const contract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider
);
