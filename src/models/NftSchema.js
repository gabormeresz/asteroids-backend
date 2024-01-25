import mongoose from "mongoose";

const AttributesSchema = new mongoose.Schema({
  value: { type: String, required: true },
  trait_type: { type: String }
});

const MetadataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  attributes: { type: [AttributesSchema], required: true }
});

const NftSchema = new mongoose.Schema({
  tokenId: { type: Number, required: true, unique: true },
  tokenOwner: { type: String, required: true },
  metadata: { type: MetadataSchema, required: true }
});

export default NftSchema;
