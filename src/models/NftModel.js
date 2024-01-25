import mongoose from "mongoose";
import NftSchema from "./NftSchema.js";

const NFT = mongoose.model("NFT", NftSchema);

export default NFT;
