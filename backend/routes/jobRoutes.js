import { Router } from "express";
const router = Router();
import { jwtAuthMiddleware,generateToken } from "../middleware/auth.js";

import { getAllJobs,getJobById,createJob,getJobsByCompany, updateJob,
    deleteJob, } from "../controllers/jobController.js";

router.get("/", getAllJobs);
router.get("/bycompany",jwtAuthMiddleware, getJobsByCompany);
router.get("/:id", getJobById);
router.put('/:id', jwtAuthMiddleware, updateJob);
router.delete('/:id', jwtAuthMiddleware, deleteJob);
router.post("/",jwtAuthMiddleware, createJob);


export default router;