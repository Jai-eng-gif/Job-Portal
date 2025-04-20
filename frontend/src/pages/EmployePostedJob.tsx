import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Building2, Clock, Pencil, Trash } from "lucide-react";
import { useStore } from "../store";



function EmployePostedJob() {
  const isDarkMode = useStore((state) => state.isDarkMode);

const [jobs, setJobs] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const currentUser = useStore((state) => state.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      if (!currentUser || !token || !currentUser.company) return;

      try {
        const response = await fetch(
          `https://job-portal-backend-two-ashen.vercel.app/api/jobs/bycompany?company=${currentUser.company}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, [currentUser]);

  const handleDelete = async (jobId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://job-portal-backend-two-ashen.vercel.app/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredJobs = jobs.filter((job: any) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(jobs.map((job: any) => job.category))];

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Your Posted Jobs</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div
              className={`flex items-center ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-2 shadow-md`}
            >
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-transparent focus:outline-none ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`p-2 rounded-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } shadow-md`}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredJobs.map((job: any) => (
          <div
            key={job._id}
            className={`${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-white hover:bg-gray-50"
            } p-6 rounded-lg shadow-md transition`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <div className="flex items-center text-gray-500 mb-2">
                  <Building2 className="w-4 h-4 mr-1" />
                  <span className="mr-4">{job.company}</span>
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {job.type}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {job.category}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-semibold text-blue-600">
                  {job.salary}
                </div>
                <div className="flex items-center text-gray-500 mt-2">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4 justify-end">
                  <button
                    onClick={() => navigate(`/employer/updatejob/${job._id}`)}
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployePostedJob;
