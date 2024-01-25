import express from "express";
import {
  handleNftPost,
  handleNftPatch,
  getNft
} from "../controllers/nftController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, handleNftPost);
router.patch("/", authMiddleware, handleNftPatch);
router.get("/", getNft);

export default router;
