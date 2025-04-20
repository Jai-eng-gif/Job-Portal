import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { MapPin, Building2, Clock, Send } from 'lucide-react';
import { Job } from '../types';
import { useStore } from '../store';

function JobDetails() {
  const { id } = useParams();
    const navigate = useNavigate();
  
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false); // New state for showing the apply form
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    fetch(`https://job-portal-backend-two-ashen.vercel.app/api/jobs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch job');
        return res.json();
      })
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load job details');
        setLoading(false);
      });
  }, [id]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!coverLetter || !resume) {
      alert('Please provide a cover letter and upload your resume.');
      return;
    }
  
    const formData = new FormData();
    formData.append('coverLetter', coverLetter);
    formData.append('resume', resume);
    formData.append('jobId', id!); 
  
    fetch(`https://job-portal-backend-two-ashen.vercel.app/api/applications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  
      },
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        alert('Application submitted successfully!');
        setIsApplying(false);
        navigate('/jobs');

      })
      .catch(err => {
        console.error(err);
        alert('Failed to submit application');
      });
  };
  

  if (loading) return <div>Loading...</div>;
  if (error || !job) return <div>{error || 'Job not found'}</div>;

  return (
    <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 mb-8`}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex items-center text-gray-500 mb-4">
              <Building2 className="w-5 h-5 mr-2" />
              <span className="mr-4">{job.company}</span>
              <MapPin className="w-5 h-5 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-4 py-2 rounded-full text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>{job.type}</span>
              <span className={`px-4 py-2 rounded-full text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>{job.category}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-2">{job.salary}</div>
            <div className="flex items-center text-gray-500">
              <Clock className="w-5 h-5 mr-2" />
              <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {currentUser?.role === 'jobseeker' && (
          <button
            onClick={() => setIsApplying(true)}
            className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            <Send className="w-5 h-5 mr-2" />
            Apply Now
          </button>
        )}

{isApplying && (
  <div className="mt-8">
    <h2
      className={`text-2xl font-bold mb-4 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      Apply for {job.title}
    </h2>
    <form onSubmit={handleApply}>
      <div className="mb-4">
        <label
          htmlFor="coverLetter"
          className={`block text-sm font-medium mb-1 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Cover Letter
        </label>
        <textarea
          id="coverLetter"
          className="w-full p-3 border rounded bg-white text-black"
          rows={4}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label
          htmlFor="resume"
          className={`block text-sm font-medium mb-1 ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Resume
        </label>
        <input
          type="file"
          id="resume"
          accept=".pdf,.doc,.docx"
          className="w-full p-3 border rounded bg-white text-black"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
      >
        Submit Application
      </button>
    </form>
  </div>
)}

      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8 mb-8`}>
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className="mb-6 whitespace-pre-line">{job.description}</p>

            <h3 className="text-xl font-bold mb-4">Requirements</h3>
            <ul className="list-disc pl-6 space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8`}>
            <h2 className="text-xl font-bold mb-4">Company Overview</h2>
            <div className="flex items-center mb-4">
              <Building2 className="w-12 h-12 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold">{job.company}</h3>
                <p className="text-gray-500">{job.location}</p>
              </div>
            </div>
            <p className="text-gray-500">
              Leading technology company specializing in innovative solutions...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
