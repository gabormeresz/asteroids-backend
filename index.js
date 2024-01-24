import express from "express";
import mongoose from "mongoose";
import { ethers } from "ethers";
import "dotenv/config";
import { NftSchema } from "./schema.js";
import { contractAddress, contractABI } from "./constants.js";

const app = express();
const PORT = process.env.PORT || 8080;

const provider = new ethers.JsonRpcProvider(
  process.env.POLYGON_MUMBAI_RPC_PROVIDER
);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

app.use(express.json());

app.get("/", (req, res) => {
  console.log("GET request on /");
  res.send("NFT Collection Backend is running");
});

app.post("/nft", async (req, res) => {
  const { tokenId, tokenOwner } = req.body;

  try {
    // Fetch tokenURI from the contract
    const tokenURI = await contract.tokenURI(tokenId);
    // Fetch metadata from the tokenURI
    const response = await fetch(tokenURI);
    const responseText = await response.text();
    const cleanedResponse = responseText
      .replace(/[\u{0080}-\u{FFFF}]/gu, "")
      .replace(/[\x00-\x1F\x7F-\x9F]/g, "");
    const metadata = JSON.parse(cleanedResponse);

    // Store the NFT data in the database
    const nft = new NFT({ tokenId, tokenOwner, metadata });
    await nft.save();

    res.status(200).json(nft);
  } catch (error) {
    console.error("Error updating NFT:", error);
    res.status(500).send("Error updating NFT data");
  }
});

app.patch("/nft", async (req, res) => {
  const { tokenId, tokenOwner } = req.body;
  const nft = await NFT.findOne({ tokenId }, "tokenId tokenOwner");
  nft.tokenOwner = tokenOwner;
  await nft.save();
  res.status(200).json(nft);
});

app.get("/nft", async (req, res) => {
  const { tokenId } = req.query;
  const nft = await NFT.findOne({ tokenId });
  res.status(200).json(nft);
});

app.get("/collection", async (req, res) => {
  const nfts = await NFT.find({});
  const mappedNfts = nfts.map((item) => ({
    tokenId: item.tokenId,
    tokenOwner: item.tokenOwner,
    name: item.metadata.name,
    image: item.metadata.image
  }));
  res.status(200).json(mappedNfts);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    yourInitializationFunction();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const NFT = mongoose.model("NFT", NftSchema);

async function yourInitializationFunction() {
  // Your code here
  console.log("This runs after MongoDB connection is established");
}
