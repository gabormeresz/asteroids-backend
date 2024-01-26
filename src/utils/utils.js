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

const buildRevalidationUrl = (revalType, tokenId) => {
  const REVALIDATION_ENDPOINT = process.env.WEB_APP_URL + "/api/revalidate-";
  if (revalType === "collection") {
    return REVALIDATION_ENDPOINT + "collection";
  } else if (revalType === "nft" && tokenId) {
    return `${REVALIDATION_ENDPOINT}nft?tokenId=${tokenId.toString()}`;
  }
  throw new Error("Invalid revalidation type or missing tokenId");
};

export const triggerRevalidation = async (revalType, tokenId = 0) => {
  const url = buildRevalidationUrl(revalType, tokenId);
  console.log(url);

  const revalidateResponse = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.API_BEARER_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  if (!revalidateResponse.ok) {
    throw new Error(
      `Revalidation failed for ${revalType}, tokenId: ${tokenId}`
    );
  }
};
