import {Application} from '../models/Application.js';

import { Job } from '../models/Job.js';
import { User } from '../models/User.js';



// export const createApplication = async (req, res) => {
//   const { coverLetter } = req.body;
//   const resume = req.file?.path;
//   const userId = req.user.user.id; 
//   const { jobId } = req.body;
//   console.log('req.user:', req.user.user.id); 
//   console.log('📥 Incoming Application Request:');
//   console.log('jobId:', jobId);
//   console.log('userId:', userId);
//   console.log('coverLetter:', coverLetter);
//   console.log('resume:', resume);
//   if (!userId || !jobId || !coverLetter || !resume) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     const application = new Application({
//       jobId,
//       userId,
//       coverLetter,
//       resume,
//       status: 'pending',
//     });

//     await application.save();
//     res.status(201).json({ message: 'Application submitted successfully', application });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to submit application' });
//   }
// }

export const createApplication = async (req, res) => {
  const { coverLetter, jobId } = req.body;
  const userId = req.user.user.id;

  const file = req.file;

  console.log('📥 Incoming Application Request:');
  console.log('jobId:', jobId);
  console.log('userId:', userId);
  console.log('coverLetter:', coverLetter);

  if (!userId || !jobId || !coverLetter || !file) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Convert resume file buffer to base64 string
    const base64Resume = file.buffer.toString('base64');
    console.log('base64Resume:', base64Resume);
    

    // Optional: Save MIME type for future download (e.g., PDF)
    const mimeType = file.mimetype;

    const application = new Application({
      jobId,
      userId,
      coverLetter,
      resume: base64Resume,
      status: 'pending',
    });
    
    
    await application.save();
    console.log('application:', application);
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error('Error saving application:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};


export const getUserApplications = async (req, res) => {
  const apps = await Application.find({ userId: req.user.user.id });  
  
  res.json(apps);
};
