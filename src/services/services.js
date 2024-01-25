import NFT from "../models/NftModel.js";
import {
  fetchMetadata,
  fetchTokenOwner,
  fetchTotalSupply,
  fetchTokenURI,
  triggerRevalidation
} from "../utils/utils.js";

export const createNewNFT = async (tokenId, tokenOwner) => {
  const tokenURI = await fetchTokenURI(tokenId);
  const metadata = await fetchMetadata(tokenURI);
  const newNft = new NFT({ tokenId, tokenOwner, metadata });
  await newNft.save();
  return newNft;
};

export const updateNFTOwner = async (nft, newOwner) => {
  nft.tokenOwner = newOwner;
  await nft.save();
  return nft;
};

export const triggerIndividualNFTRevalidation = async (tokenId) => {
  try {
    await triggerRevalidation(tokenId, true, false);
  } catch (error) {
    console.error(
      `Error triggering revalidation for tokenId ${tokenId}:`,
      error
    );
  }
};

export const triggerCollectionRevalidation = async () => {
  try {
    await triggerRevalidation(null, false, true);
  } catch (error) {
    console.error("Error triggering collection revalidation:", error);
  }
};

const synchronizeNFT = async (tokenId) => {
  const tokenOwner = await fetchTokenOwner(tokenId);
  if (!tokenOwner)
    throw new Error(`Error fetching tokenOwner for tokenId ${tokenId}`);

  const nft = await NFT.findOne({ tokenId });
  if (!nft) {
    await createNewNFT(tokenId, tokenOwner);
  } else if (nft.tokenOwner !== tokenOwner) {
    await updateNFTOwner(nft, tokenOwner);
  }
  await triggerIndividualNFTRevalidation(tokenId);
};

export const synchronizeDatabaseWithBlockchain = async () => {
  const totalSupply = parseInt(await fetchTotalSupply());
  for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
    try {
      await synchronizeNFT(tokenId);
    } catch (error) {
      console.error(`Error synchronizing tokenId ${tokenId}:`, error);
    }
  }
};
