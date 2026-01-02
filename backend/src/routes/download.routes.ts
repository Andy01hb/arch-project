import { Router } from "express";
import { getDownloadLink, generateDownloadLink } from "../controllers/download.controller";

const router = Router();

// Generate download link for a specific product in an order
router.post("/generate", generateDownloadLink);

// Legacy route - TODO: Add Auth Middleware (Clerk/JWT)
router.get("/:productId", getDownloadLink);

export default router;

