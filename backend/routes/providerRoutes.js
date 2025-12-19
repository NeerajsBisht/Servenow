import express from "express";
import {
  listProviders,
  getProviderById, 
} from "../controllers/providerController.js";

const router = express.Router();

// Get all providers
router.get("/list", listProviders);

// Get provider by ID
router.get("/:id", getProviderById);

export default router;
