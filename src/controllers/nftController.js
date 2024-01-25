import NFT from "../models/NftModel.js";
import {
  createNewNFT,
  updateNFTOwner,
  triggerIndividualNFTRevalidation,
  triggerCollectionRevalidation
} from "../services/services.js";

export const handleNftPost = async (req, res) => {
  const { tokenId, tokenOwner } = req.body;
  console.log(`Token ${tokenId} minted`);

  try {
    const newNft = await createNewNFT(tokenId, tokenOwner);
    await triggerIndividualNFTRevalidation(tokenId);
    await triggerCollectionRevalidation();

    res.status(200).json(newNft);
  } catch (error) {
    console.error("Error creating NFT or triggering revalidation:", error);
    res.status(500).json({
      message: "Error creating NFT data or triggering revalidation"
    });
  }
};

export const handleNftPatch = async (req, res) => {
  const { tokenId, tokenOwner } = req.body;
  console.log(`Token ${tokenId} transferred`);

  try {
    const nft = await NFT.findOne({ tokenId }, "tokenId tokenOwner");
    const updatedNft = await updateNFTOwner(nft, tokenOwner);
    await triggerIndividualNFTRevalidation(tokenId);
    await triggerCollectionRevalidation();

    res.status(200).json(updatedNft);
  } catch (error) {
    console.error("Error updating NFT or triggering revalidation:", error);
    res.status(500).send("Error updating NFT or triggering revalidation");
  }
};

export const getNft = async (req, res) => {
  const { tokenId } = req.query;
  const nft = await NFT.findOne({ tokenId });
  res.status(200).json(nft);
};
