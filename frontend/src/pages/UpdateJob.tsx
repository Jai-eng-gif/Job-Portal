import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";

const UpdateJob = () => {
  const { jobId } = useParams();

    const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    description: "",
    category: "",
    location: "",
    type: "",
    requirements: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`https://job-portal-backend-two-ashen.vercel.app/api/jobs/${jobId}`);
        const job = await res.json();
        console.log("Fetched Job:", job);

        setFormData({
          title: job.title || "",
          salary: job.salary || "",
          description: job.description || "",
          category: job.category || "",
          location: job.location || "",
          type: job.type || "",
          requirements: Array.isArray(job.requirements)
            ? job.requirements.join(", ")
            : job.requirements || "",
        });
      } catch (err) {
        console.error("Failed to fetch job:", err);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No token found. Please login again.");
      return;
    }
  
    const updatedData = {
      ...formData,
      requirements: formData.requirements
        .split(",")
        .map((req) => req.trim()),
    };
  
    try {
      const res = await fetch(`https://job-portal-backend-two-ashen.vercel.app/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
  
      const result = await res.json();
      console.log("Updated Job:", result);
      navigate("/employer/viewjobs");
      alert("Job updated successfully!");
    } catch (err) {
      console.error("Failed to update job:", err);
      alert("Error updating job");
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded shadow">
        <div className="flex justify-center mb-4">
          <Briefcase className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-6">Update Job</h2>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Title", name: "title" },
            { label: "Salary", name: "salary" },
            { label: "Location", name: "location" },
            { label: "Category", name: "category" },
            { label: "Type", name: "type" },
          ].map((field) => (
            <div className="mb-4" key={field.name}>
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                className="w-full p-3 border rounded"
                required
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              rows={4}
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Requirements (comma separated)
            </label>
            <input
              type="text"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            Update Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateJob;
