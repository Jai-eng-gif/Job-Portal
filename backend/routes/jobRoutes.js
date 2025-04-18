import { Router } from "express";
const router = Router();

import { getAllJobs,getJobById,createJob } from "../controllers/jobController.js";

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", createJob);