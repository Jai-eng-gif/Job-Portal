import {Application} from '../models/Application.js';

import { Job } from '../models/Job.js';
import { User } from '../models/User.js';

export const createApplication = async (req, res) => {
  const { coverLetter } = req.body;
  const resume = req.file?.path;
  const userId = req.user.user.id; 
  const { jobId } = req.body;
  console.log('req.user:', req.user.user.id); 
  console.log('📥 Incoming Application Request:');
  console.log('jobId:', jobId);
  console.log('userId:', userId);
  console.log('coverLetter:', coverLetter);
  console.log('resume:', resume);
  if (!userId || !jobId || !coverLetter || !resume) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const application = new Application({
      jobId,
      userId,
      coverLetter,
      resume,
      status: 'pending',
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
}

export const getUserApplications = async (req, res) => {
  const apps = await Application.find({ userId: req.user.user.id });  
  
  res.json(apps);
};
