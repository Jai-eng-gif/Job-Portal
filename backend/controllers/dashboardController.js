
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { log } from "console";

export const getEmployerJobs = async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user.id });
  res.json(jobs);
};


// get all applications for a specific job
export const getApplicantsForJob = async (req, res) => {
  const apps = await Application.find({ jobId: req.params.jobId })
  .populate('userId', 'name email')
  .populate('jobId', '_id title postedBy');;
  console.log(apps);
  console.log('job id',req.params.jobId);
  res.json(apps);
};

// job seeker applications for jobs they applied to
export const getJobseekerApplications = async (req, res) => {
  const apps = await Application.find({ userId: req.user.user.id }).populate('jobId').populate('userId');
  console.log('user id',req.user.user.id);  
  res.json(apps);
};

// get all applicants for all jobs posted by the employer
export const getAllApplicantsForEmployerJobs = async (req, res) => {
  try {
    const employerId = req.user.user.company;
    console.log('employer id:', employerId);
        
    const employerJobs = await Job.find({ company: employerId }, 'company');
    console.log('employer jobs:', employerJobs);
    

    const jobIds = employerJobs.map(job => job._id);
    console.log('job ids:', jobIds);
    
    if (jobIds.length === 0) {
      return res.status(200).json([]); 
    }
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId', '_id title category postedBy')
      .populate('userId', '_id name email')
      
      console.log('applications:', applications);
          
    const result = applications.map(app => ({
      applicationId: app._id,
      userId: app.userId._id,
      jobId: app.jobId._id,
      jobTitle: app.jobId.title,
      jobCategory: app.jobId.category,
      applicantName: app.userId.name,
      applicantEmail: app.userId.email,
      status: app.status,
      resume:app.resume,
      coverLetter: app.coverLetter,
      appliedDate: app.appliedDate,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// change application status
export const changeApplicationStatus = async (req, res) => {
  const {status } = req.body;
  const applicationId= req.params.applicationId;
  console.log('job id:', applicationId);
  console.log('status:', status);
  
  
  try {
    
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );
    console.log('Updated application:', updatedApplication);
    
    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};