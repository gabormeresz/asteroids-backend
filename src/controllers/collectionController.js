import NFT from "../models/NftModel.js";

export const getCollection = async (req, res) => {
  try {
    const nfts = await NFT.find({}).sort("tokenId");
    const mappedNfts = nfts.map((item) => ({
      tokenId: item.tokenId,
      tokenOwner: item.tokenOwner,
      name: item.metadata.name,
      image: item.metadata.image
    }));
    res.status(200).json(mappedNfts);
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ message: "Error fetching collection" });
  }
};
