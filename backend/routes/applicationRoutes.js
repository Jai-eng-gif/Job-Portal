import { Router } from "express";
const router = Router();

import { jwtAuthMiddleware } from "../middleware/auth.js";
import { createApplication,getUserApplications } from "../controllers/applicationController.js";

router.post("/", jwtAuthMiddleware, createApplication);
router.get("/", jwtAuthMiddleware, getUserApplications);

export default router;

