import { Router } from "express";
const router = Router();
import multer from 'multer';
import { jwtAuthMiddleware } from "../middleware/auth.js";
import { createApplication,getUserApplications } from "../controllers/applicationController.js";

const storage = multer.memoryStorage()                                                       

  const upload = multer({ storage });

  
router.post('/',jwtAuthMiddleware, upload.single('resume'),createApplication)
router.get("/", jwtAuthMiddleware, getUserApplications);

export default router;

