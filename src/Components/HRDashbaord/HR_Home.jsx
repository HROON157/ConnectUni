import { useState, useEffect } from "react";
import { getDashboardData } from "../Charts/ChartData";
import {
  PieChartCard,
  BarChartCard,
  LineChartCard,
} from "../Charts/PieChartCard";
import { Link } from "react-router-dom";
import { getJobOpenings, closeJobOpening } from "../../Firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../../Firebase/db";
import { onAuthStateChanged } from 'firebase/auth';

const HR_Home = () => {
  const userName = localStorage.getItem("userName");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [closingJob, setClosingJob] = useState(null);
  const [hrProfile, setHrProfile] = useState(null);
  const [user, setUser] = useState(null);

  const fetchHRProfile = async () => {
    try {
      const uid = user?.uid || localStorage.getItem('uid');
      if (!uid || uid === 'null' || uid === 'undefined') return;

      const docRef = doc(db, 'hrProfiles', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setHrProfile(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching HR profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchHRProfile();
      } else {
        const storedUID = localStorage.getItem('uid');
        if (storedUID && storedUID !== 'null' && storedUID !== 'undefined') {
          setUser({ uid: storedUID });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchHRProfile();
    }
  }, [user]);

  const handleCloseJob = async (jobId) => {
    if (window.confirm("Are you sure you want to close this job opening?")) {
      try {
        setClosingJob(jobId);
        await closeJobOpening(jobId);
        const updatedOpenings = await getJobOpenings();
        setJobOpenings(updatedOpenings);
      } catch (error) {
        console.error("Error closing job opening:", error);
        alert("Failed to close job opening. Please try again.");
      } finally {
        setClosingJob(null);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching job openings from component...");
        const data = await getJobOpenings();
        console.log("Job openings received:", data);
        setJobOpenings(data);
      } catch (error) {
        console.error("Error loading job openings:", error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="ml-2 sm:ml-4 md:ml-6 lg:ml-8 p-4">
      <p
        className="text-[#0D141C] text-xl sm:text-base md:text-lg lg:text-xl text-center font-semibold mt-2 "
        style={{ fontFamily: "Public Sans" }}
      >
        Welcome to the HR Dashboard
      </p>
      <p
        className="text-[#0D141C] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mt-2"
        style={{ fontFamily: "Public Sans" }}
      >
        Hello, {userName}
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PieChartCard
            title="Total Jobs"
            count={dashboardData?.totalJobs.count}
            data={dashboardData?.totalJobs.breakdown}
          />
          <BarChartCard
            title="Universities"
            count={dashboardData?.universities.count}
            data={dashboardData?.universities.breakdown}
          />
          <LineChartCard
            title="Total Hirings"
            count={dashboardData?.totalHirings.count}
            percentage={dashboardData?.totalHirings.percentage}
            trend={dashboardData?.totalHirings.trend}
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <button className="group bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 transition-all duration-300 rounded-xl shadow-md p-6 cursor-pointer border border-blue-300 hover:shadow-xl">
            <Link to="/past-openings">
              <h3 className="text-lg font-semibold text-center text-blue-800 group-hover:text-blue-900 transition">
                📂 Past Openings
              </h3>
            </Link>
          </button>

          <button className="group bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 transition-all duration-300 rounded-xl shadow-md p-6 cursor-pointer border border-green-300 hover:shadow-xl">
            <Link to="/add-new-opening">
              <h3 className="text-lg font-semibold text-center text-green-800 group-hover:text-green-900 transition">
                ➕ Add New
              </h3>
            </Link>
          </button>

          <button className="group bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 transition-all duration-300 rounded-xl shadow-md p-6 cursor-pointer border border-purple-300 hover:shadow-xl">
            <Link to="/browse-universities">
              <h3 className="text-lg font-semibold text-center text-purple-800 group-hover:text-purple-900 transition">
                🎓 Browse Universities
              </h3>
            </Link>
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Current Openings</h2>

        <div className="space-y-4">
          {jobOpenings.length > 0 ? (
            jobOpenings.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {job.jobTitle}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {job.jobDescription}
                    </p>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {job.createdAt
                        ? `Posted on: ${new Date(
                            job.createdAt.seconds * 1000
                          ).toLocaleDateString()}`
                        : "Posted on: Unknown"}
                    </p>
                    <div className="flex justify-start space-x-3">
                      <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        View Applications
                      </button>
                      <button 
                        onClick={() => handleCloseJob(job.id)}
                        disabled={closingJob === job.id}
                        className="bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {closingJob === job.id ? "Closing..." : "Close Opening"}
                      </button>
                    </div>
                  </div>
                  
               
                  <div className="ml-6 flex-shrink-0">
                    <div className="w-[170px] h-[170px] bg-gray-100 rounded-lg flex items-center justify-center shadow-sm border">
                      {hrProfile?.companyLogo ? (
                        <img 
                          src={hrProfile.companyLogo} 
                          alt={hrProfile.company || "Company Logo"} 
                          className="w-full h-full object-cover rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-200 rounded flex items-center justify-center">
                          <span className="text-blue-600 text-xs font-bold">
                            {hrProfile?.company?.charAt(0) || 'C'}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* {hrProfile?.company && (
                      <p className="text text-gray-500 text-center mt-1 max-w-16 ">
                        {hrProfile.company}
                      </p>
                    )} */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No job openings yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by creating your first job opening
                </p>
                <Link
                  to="/add-new-opening"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Job Opening
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HR_Home;