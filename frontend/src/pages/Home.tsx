import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, Search, Building2, LogOut } from "lucide-react";
import { useStore } from "../store";

function Home() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  console.log(currentUser);

  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Find Your Dream Job Today</h1>
        <p className="text-xl mb-8">
          Connect with top employers and opportunities
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          
          {(!currentUser || currentUser.role === "jobseeker") && (
            <Link
              to="/jobs"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Jobs
            </Link>
          )}

          
          {currentUser?.role === "employer" && (
            <>
              <Link
                to="/employer/postjob"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
              >
                Post a Job
              </Link>
              <Link
                to="/employer/viewjobs"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                View All Jobs
              </Link>
            </>
          )}

          
          {currentUser && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut size={20} /> Logout
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <Search className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Search Jobs</h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Browse through thousands of job listings from top companies.
          </p>
        </div>

        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Apply</h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Apply to multiple jobs with just a few clicks using your profile.
          </p>
        </div>

        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <Building2 className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Company Profiles</h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Learn about company culture and benefits before applying.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
