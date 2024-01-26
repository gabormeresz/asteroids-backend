import { contract } from "../config/ethersConfig.js";

export const fetchTokenURI = async (tokenId) => {
  return await contract.tokenURI(tokenId);
};

export const fetchTokenOwner = async (tokenId) => {
  return await contract.ownerOf(tokenId);
};

export const fetchTotalSupply = async () => {
  return await contract.totalSupply();
};

export const fetchMetadata = async (tokenURI) => {
  const response = await fetch(tokenURI);
  const responseText = await response.text();
  const cleanedResponse = responseText
    .replace(/[\u{0080}-\u{FFFF}]/gu, "")
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "");
  return JSON.parse(cleanedResponse);
};

export const triggerRevalidation = async (revalType, tokenId = 0) => {
  if (!(revalType === "collection" || revalType === "nft")) {
    throw new Error("Wrong revalidation type");
  }
  const revalidateResponse = await fetch(
    `${process.env.WEB_APP_URL}/api/revalidate-${
      revalType === "collection"
        ? "collection"
        : `nft?tokenId=${tokenId.toString()}`
    }`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_BEARER_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  if (!revalidateResponse.ok) {
    throw new Error("Revalidation failed");
  }
};
