
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";

export const getEmployerJobs = async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user.id });
  res.json(jobs);
};

export const getApplicantsForJob = async (req, res) => {
  const apps = await Application.find({ jobId: req.params.jobId }).populate('userId', 'name email');
  res.json(apps);
};

export const getJobseekerApplications = async (req, res) => {
  const apps = await Application.find({ userId: req.user.id }).populate('jobId');
  res.json(apps);
};

