import {Application} from '../models/Application.js';


export const createApplication = async (req, res) => {
  const { jobId, coverLetter, resume } = req.body;
  const newApp = new Application({ jobId, userId: req.user.id, coverLetter, resume });
  await newApp.save();
  res.status(201).json(newApp);
};

export const getUserApplications = async (req, res) => {
  const apps = await Application.find({ userId: req.user.id });
  res.json(apps);
};
