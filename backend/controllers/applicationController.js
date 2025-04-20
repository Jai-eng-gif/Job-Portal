import {Application} from '../models/Application.js';
 
export const createApplication = async (req, res) => {
  const { coverLetter, jobId } = req.body;
  const userId = req.user.user.id;

  const file = req.file;

  if (!userId || !jobId || !coverLetter || !file) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const base64Resume = file.buffer.toString('base64');
    console.log('base64Resume:', base64Resume);    
    

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
