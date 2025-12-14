import { Router } from "express";
import { getDownloadLink } from "../controllers/download.controller";

const router = Router();

// TODO: Add Auth Middleware (Clerk/JWT)
router.get("/:productId", getDownloadLink);

export default router;
