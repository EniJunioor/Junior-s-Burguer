import express from "express";
import { healthCheck } from "../../controllers/misc/healthCheckController.js";

const router = express.Router();

router.get("/health", healthCheck);
router.get("/status", statusCheck);

export default router;
