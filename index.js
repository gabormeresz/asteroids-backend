import "dotenv/config";
import express from "express";
import collectionRoutes from "./src/routes/collectionRoutes.js";
import nftRoutes from "./src/routes/nftRoutes.js";
import { connectToMongoDB } from "./src/config/mongooseConfig.js";
import { performAppInitialization } from "./src/init/initialization.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use("/nft", nftRoutes);
app.use("/collection", collectionRoutes);

app.get("/", (req, res) => {
  res.send("NFT Collection Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectToMongoDB().then(() => {
  // performAppInitialization();
});
