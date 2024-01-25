import express from "express";
import { getCollection } from "../controllers/collectionController.js";

const router = express.Router();

// Route for getting the entire collection
router.get("/", getCollection);

export default router;
