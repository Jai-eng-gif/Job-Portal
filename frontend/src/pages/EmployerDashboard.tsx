import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useStore } from "../store";
import { dummyJobs, dummyApplications } from "../data";
import { ApplicationDisplay } from "../types";

const monthlyData = [
  { month: "Jan", jobs: 4 },
  { month: "Feb", jobs: 6 },
  { month: "Mar", jobs: 8 },
  { month: "Apr", jobs: 5 },
  { month: "May", jobs: 7 },
  { month: "Jun", jobs: 9 },
];

const categoryData = [
  { name: "Development", value: 35 },
  { name: "Design", value: 25 },
  { name: "Marketing", value: 20 },
  { name: "Sales", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function EmployerDashboard() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const [applications, setApplications] = useState<ApplicationDisplay[]>([]);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationDisplay | null>(null);
  const [totalJobs, setTotalJobs] = useState<any[]>([]);

  const employerJobs = dummyJobs.filter(
    (job) => job.company === currentUser?.company
  );

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "https://job-portal-backend-two-ashen.vercel.app/api/dashboard/employer/applicants",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, [selectedApplication]);
  console.log("application data", applications);

  // get total job postings by employer
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
        setTotalJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, [currentUser]);

  const handleStatusUpdate = async (application: {
    userId: string;
    status: string;
    jobId: string;
    applicationId: string;
  }) => {
    console.log("Updating status for application:", application);

    try {
      const response = await fetch(
        `https://job-portal-backend-two-ashen.vercel.app/api/dashboard/${application.applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: application.status }),
        }
      );

      const result = await response.json();
      console.log("Status updated:", result);
      setSelectedApplication(null);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
  };
  console.log(selectedApplication);

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Employer Dashboard</h1>
        <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Active Jobs",
            color: "text-blue-600",
            value: totalJobs.length,
          },
          {
            title: "Total Applications",
            color: "text-green-600",
            value: applications.length,
          },
          {
            title: "Pending Review",
            color: "text-yellow-600",
            value: applications.filter((app) => app.status === "pending")
              .length,
          },
          {
            title: "Hired",
            color: "text-purple-600",
            value: applications.filter((app) => app.status === "accepted")
              .length,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } p-6 rounded-lg shadow-md`}
          >
            <h3 className="text-lg font-semibold mb-2">{stat.title}</h3>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h2 className="text-xl font-bold mb-4">Monthly Job Postings</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobs" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h2 className="text-xl font-bold mb-4">Jobs by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md`}
      >
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">
          Recent Applications
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-left">Applicant</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedApplication(app)}
                  className={`cursor-pointer ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">{app.jobTitle}</td>
                  <td className="px-6 py-4">{app.applicantName}</td>
                  <td className="px-6 py-4">{app.appliedDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div
            className={`${
              isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            } p-6 rounded-xl shadow-lg max-w-md w-full`}
          >
            <h3 className="text-xl font-bold mb-4">Application Details</h3>

            <p>
              <strong>Job Title:</strong> {selectedApplication.jobTitle}
            </p>
            <p>
              <strong>Applicant Name:</strong>{" "}
              {selectedApplication.applicantName}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {selectedApplication.applicantEmail || "N/A"}
            </p>
            <p>
              <strong>Date Applied:</strong> {selectedApplication.appliedDate}
            </p>

            <div className="mb-3">
              <label className="block font-semibold mb-1">Status:</label>
              <select
                className={`w-full border rounded px-3 py-2 outline-none ${
                  isDarkMode
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
                value={selectedApplication.status}
                onChange={(e) =>
                  setSelectedApplication({
                    ...selectedApplication,
                    status: e.target.value,
                  })
                }
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <p>
              <strong>Cover Letter:</strong> {selectedApplication.coverLetter}
            </p>

            <p>
              <strong>Resume:</strong>{" "}
              <a
                href={`data:application/pdf;base64,${selectedApplication.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Download Resume
              </a>
            </p>

            {/* Submit Button */}
            <div className="mt-4 text-right">
              <button
                onClick={() => handleStatusUpdate(selectedApplication)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
              >
                Submit
              </button>
              <button
                onClick={() => setSelectedApplication(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerDashboard;
