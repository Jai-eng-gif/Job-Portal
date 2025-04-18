import { Router } from "express";
const router = Router();
import roleCheck from "../middleware/roleCheck.js";
import express from "express";
import { jwtAuthMiddleware } from "../middleware/auth.js";


import { getEmployerJobs,
    getApplicantsForJob,
    getJobseekerApplications,} from "../controllers/dashboardController.js";

router.get('/employer/jobs', jwtAuthMiddleware, roleCheck(['employer']), getEmployerJobs);
router.get('/employer/jobs/:jobId/applications', jwtAuthMiddleware, roleCheck(['employer']), getApplicantsForJob);
router.get('/jobseeker/applications', jwtAuthMiddleware, roleCheck(['jobseeker']), getJobseekerApplications);

export default router;