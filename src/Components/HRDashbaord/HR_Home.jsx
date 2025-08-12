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

  const getDisplayName = () => {
    return hrProfile?.name || localStorage.getItem('userName') || 'HR User';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 p-8 flex flex-col items-center space-y-4">
          <div className="w-14 h-14 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 font-medium text-lg">Loading your dashboard...</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl border border-gray-200/30 p-8 mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full filter blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full filter blur-2xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-lg font-medium mb-2">
              Welcome to the HR Dashboard
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
              Hello, {getDisplayName()}
            </h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-10">
          <div className="flex items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-lg">📊</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="transform hover:scale-[1.02] transition-transform duration-300 hover:shadow-lg">
              <PieChartCard
                title="Total Jobs"
                count={dashboardData?.totalJobs.count}
                data={dashboardData?.totalJobs.breakdown}
              />
            </div>
            <div className="transform hover:scale-[1.02] transition-transform duration-300 hover:shadow-lg">
              <BarChartCard
                title="Universities"
                count={dashboardData?.universities.count}
                data={dashboardData?.universities.breakdown}
              />
            </div>
            <div className="transform hover:scale-[1.02] transition-transform duration-300 hover:shadow-lg">
              <LineChartCard
                title="Total Hirings"
                count={dashboardData?.totalHirings.count}
                percentage={dashboardData?.totalHirings.percentage}
                trend={dashboardData?.totalHirings.trend}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-10">
          <div className="flex items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-lg">⚡</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Link to="/past-openings" className="group">
              <div className="bg-white/90 backdrop-blur-2xl hover:bg-white transition-all duration-300 rounded-3xl shadow-lg hover:shadow-xl border border-blue-200/30 p-8 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-500/5 rounded-full filter blur-lg"></div>
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <span className="text-white text-3xl">📂</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                    Past Openings
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">View historical job postings</p>
                </div>
              </div>
            </Link>

            <Link to="/add-new-opening" className="group">
              <div className="bg-white/90 backdrop-blur-2xl hover:bg-white transition-all duration-300 rounded-3xl shadow-lg hover:shadow-xl border border-green-200/30 p-8 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-green-500/5 rounded-full filter blur-lg"></div>
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <span className="text-white text-3xl">➕</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                    Add New Opening
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">Create new job posting</p>
                </div>
              </div>
            </Link>

            <Link to="/browse-universities" className="group">
              <div className="bg-white/90 backdrop-blur-2xl hover:bg-white transition-all duration-300 rounded-3xl shadow-lg hover:shadow-xl border border-purple-200/30 p-8 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-purple-500/5 rounded-full filter blur-lg"></div>
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <span className="text-white text-3xl">🎓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                    Browse Universities
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">Explore partner institutions</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Current Openings Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-lg">💼</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Current Openings</h2>
            </div>
            {jobOpenings.length > 0 && (
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md">
                {jobOpenings.length} Active {jobOpenings.length === 1 ? 'Opening' : 'Openings'}
              </span>
            )}
          </div>

          <div className="space-y-6">
            {jobOpenings.length > 0 ? (
              jobOpenings.map((job) => (
                <div
                  key={job.id}
                  className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-lg hover:shadow-xl border border-gray-200/30 p-8 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/5 rounded-full filter blur-xl"></div>
                  <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                    {/* Job Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {job.jobTitle}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-xl text-xs font-medium shadow-inner">
                              Active
                            </div>
                            <div className="text-gray-500 text-sm flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              Posted: {job.createdAt
                                ? new Date(job.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : "Unknown"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {job.jobDescription}
                      </p>

                      <div className="flex flex-wrap gap-4">
                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          View Applications
                        </button>
                        <button 
                          onClick={() => handleCloseJob(job.id)}
                          disabled={closingJob === job.id}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                        >
                          {closingJob === job.id ? (
                            <>
                              <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Closing...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Close Opening
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {/* Company Logo */}
                    <div className="flex-shrink-0 self-center lg:self-start">
                      <div className="w-44 h-44 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg border border-gray-200/50 overflow-hidden">
                        {hrProfile?.companyLogo ? (
                          <img 
                            src={hrProfile.companyLogo} 
                            alt={hrProfile.company || "Company Logo"} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white text-3xl font-bold">
                              {hrProfile?.company?.charAt(0) || 'C'}
                            </span>
                          </div>
                        )}
                      </div>
                      {hrProfile?.company && (
                        <p className="text-sm text-gray-600 text-center mt-3 font-medium">
                          {hrProfile.company}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl border border-gray-200/30 p-12 max-w-md mx-auto relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/5 rounded-full filter blur-xl"></div>
                  <div className="relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-md">
                      <span className="text-white text-4xl">💼</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      No Job Openings Yet
                    </h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Start building your talent pipeline by creating your first job opening
                    </p>
                    <Link
                      to="/add-new-opening"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Create Your First Job Opening
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HR_Home;