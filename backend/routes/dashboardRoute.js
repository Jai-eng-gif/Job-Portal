import { Router } from "express";
const router = Router();
import roleCheck from "../middleware/roleCheck";

import { getEmployerJobs,
    getApplicantsForJob,
    getJobseekerApplications,} from "../controllers/dashboardController.js";

router.get('/employer/jobs', auth, roleCheck(['employer']), getEmployerJobs);
router.get('/employer/jobs/:jobId/applications', auth, roleCheck(['employer']), getApplicantsForJob);
router.get('/jobseeker/applications', auth, roleCheck(['jobseeker']), getJobseekerApplications);