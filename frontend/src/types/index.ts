export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  category: string;
  postedBy: string;

}

export interface Application1 {
  _id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedDate: string;
  coverLetter: string;
  resume: string;
}

export interface Application {
  _id: string;
  jobId: {
    title: string;
    company: string;
    
  };
  userId: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedDate: string;
  coverLetter: string;
  resume: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'employer' | 'jobseeker';
  company?: string;
}

export interface ApplicationDisplay {
  _id: string;
  userId: string;
  applicationId: string;
  jobTitle: string;
  email: string;
  coverLetter: string;
  applicantName: string;
  resume: string;
  applicantEmail: string;
  appliedDate: string;
  status: string;
  jobId: string;
}
