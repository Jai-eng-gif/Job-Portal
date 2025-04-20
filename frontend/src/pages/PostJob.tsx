import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { useStore } from '../store';

function PostJob() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);

  const [formData, setFormData] = useState({
    title: '',
    company: currentUser?.company || '',
    location: '',
    type: '',
    salary: '',
    description: '',
    requirements: '',
    category: '',
  });


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const payload = {
      ...formData,
      requirements: formData.requirements.split(',').map(req => req.trim()),
      postedBy: currentUser?._id,
    };
  
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch('https://job-portal-backend-two-ashen.vercel.app/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Job posted:', data);
        navigate('/employer/viewjobs');
      } else {
        alert(data?.msg || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while posting the job.');
    }
  };
  return (
    <div className="max-w-xl mx-auto">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-8`}>
        <div className="flex items-center justify-center mb-8">
          <Briefcase className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Post a Job</h1>
        <form onSubmit={handleSubmit}>
          {['title', 'location', 'type', 'salary', 'description', 'category'].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-sm font-medium mb-2 capitalize">{field}</label>
              <input
                type="text"
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>
          ))}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Requirements (comma separated)</label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border focus:ring-2 focus:ring-blue-500`}
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
