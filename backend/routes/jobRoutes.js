import { Router } from "express";
const router = Router();
import { jwtAuthMiddleware,generateToken } from "../middleware/auth.js";

import { getAllJobs,getJobById,createJob } from "../controllers/jobController.js";

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/",jwtAuthMiddleware, createJob);

export default router;