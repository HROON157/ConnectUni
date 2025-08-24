import { useState, useEffect } from "react";
import { getDashboardData } from "../Charts/ChartData";
import {
  PieChartCard,
  BarChartCard,
  LineChartCard,
} from "../Charts/PieChartCard";
import { Link } from "react-router-dom";
import { getJobOpenings, closeJobOpening } from "../../Firebase/auth";
import { updateApplicationStatus } from "../../Firebase/applicationService";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../../Firebase/db";
import { onAuthStateChanged } from "firebase/auth";
import QuickLogo from "../../assets/car.png";
import AnalyticsLogo from "../../assets/analytics.png";
import PastOpeningLogo from "../../assets/time-past.png";
import AddOpeningLogo from "../../assets/plus.png";
import BrowseUniLogo from "../../assets/education.png";
import CurrentopningLogo from "../../assets/briefcase.png";

const HR_Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [closingJob, setClosingJob] = useState(null);
  const [hrProfile, setHrProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedJobApplications, setSelectedJobApplications] = useState(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [studentProfiles, setStudentProfiles] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobOpenings.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(jobOpenings.length / jobsPerPage);
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  const fetchHRProfile = async () => {
    try {
      const uid = user?.uid || localStorage.getItem("uid");
      if (!uid || uid === "null" || uid === "undefined") return;

      const docRef = doc(db, "hrProfiles", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHrProfile(docSnap.data());
      }
    } catch (error) {
     
    }
  };
  const fetchStudentProfile = async (studentId) => {
    try {
      if (studentProfiles[studentId]) {
        return studentProfiles[studentId];
      }

      const studentDoc = await getDoc(doc(db, "studentProfiles", studentId));
      if (studentDoc.exists()) {
        const profileData = studentDoc.data();
        setStudentProfiles((prev) => ({
          ...prev,
          [studentId]: profileData,
        }));
        return profileData;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const getDisplayName = () => {
    return hrProfile?.name || localStorage.getItem("userName") || "HR User";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchHRProfile();
      } else {
        const storedUID = localStorage.getItem("uid");
        if (storedUID && storedUID !== "null" && storedUID !== "undefined") {
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

        const currentUserId = user?.uid || localStorage.getItem("uid");
        if (
          currentUserId &&
          currentUserId !== "null" &&
          currentUserId !== "undefined"
        ) {
          const updatedOpenings = await getJobOpenings(currentUserId);
          setJobOpenings(updatedOpenings);
        }
      } catch (error) {
       
        alert("Failed to close job opening. Please try again.");
      } finally {
        setClosingJob(null);
      }
    }
  };


  const handleViewApplications = async (job) => {
    try {
      setLoadingApplications(true);
      setShowApplicationsModal(true);

      const q = query(
        collection(db, "applications"),
        where("jobId", "==", job.id)
      );

      const snapshot = await getDocs(q);
      const applications = [];

      for (const docSnap of snapshot.docs) {
        const appData = docSnap.data();
        const studentProfile = await fetchStudentProfile(appData.studentId);

        applications.push({
          id: docSnap.id,
          ...appData,
          studentProfile: studentProfile || {
            name: "Unknown Student",
            email: "N/A",
            university: "N/A",
            phone: "N/A",
            skills: [],
            experience: "N/A",
          },
        });
      }

      applications.sort((a, b) => {
        const dateA = a.appliedAt?.toDate
          ? a.appliedAt.toDate()
          : new Date(a.appliedAt);
        const dateB = b.appliedAt?.toDate
          ? b.appliedAt.toDate()
          : new Date(b.appliedAt);
        return dateB - dateA;
      });

      setSelectedJobApplications({
        job,
        applications,
      });
    } catch (error) {

      alert("Failed to load applications");
      setShowApplicationsModal(false);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status);

      if (selectedJobApplications?.job?.id) {
        await handleViewApplications(selectedJobApplications.job);
      }
    } catch (error) {
     
      alert("Failed to update application status");
    }
  };


  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
   
      return "N/A";
    }
  };


  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Pending",
      },
      applied: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        text: "Applied",
      },
      interviewing: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        text: "Interviewing",
      },
      accepted: {
        color: "bg-green-100 text-green-800 border-green-200",
        text: "Accepted",
      },
      rejected: {
        color: "bg-red-100 text-red-800 border-red-200",
        text: "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {

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
       


        const currentUserId = user?.uid || localStorage.getItem("uid");

        if (
          currentUserId &&
          currentUserId !== "null" &&
          currentUserId !== "undefined"
        ) {

          const data = await getJobOpenings(currentUserId);
         
          setJobOpenings(data);
        } else {
         
          setJobOpenings([]);
        }
      } catch (error) {
        
        setJobOpenings([]);
      }
    };

    if (user?.uid || localStorage.getItem("uid")) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 p-8 flex flex-col items-center space-y-4">
          <div className="w-14 h-14 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 font-medium text-lg">
            Loading your dashboard...
          </p>
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
 
        <div className="relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full filter blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full filter blur-2xl"></div>
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

        <div className="mb-10">
          <div className="flex items-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 mt-5 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md text-white">
                <img
                  src={AnalyticsLogo}
                  alt="Analytics Overview"
                  className="w-6 h-6 filter brightness-0 invert"
                />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mt-5">
                Analytics Overview
              </h2>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
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

        <div className="mb-10">
  
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <img
                src={QuickLogo}
                alt="Quick Actions"
                className="w-6 h-6 filter brightness-0 invert"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-4">
           
            <Link to="/past-openings" className="group">
              <div className="bg-white/90 backdrop-blur-xl hover:bg-white transition-all duration-300 rounded-2xl shadow-md hover:shadow-lg border border-blue-200/30 p-5 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500/5 rounded-full filter blur-md"></div>
                <div className="text-center relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <img
                      src={PastOpeningLogo}
                      alt="Past Openings"
                      className="w-6 h-6 filter brightness-0 invert"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                    Past Openings
                  </h3>
                  <p className="text-gray-600 text-xs mt-1">
                    View historical job postings
                  </p>
                </div>
              </div>
            </Link>

    
            <Link to="/add-new-opening" className="group">
              <div className="bg-white/90 backdrop-blur-xl hover:bg-white transition-all duration-300 rounded-2xl shadow-md hover:shadow-lg border border-green-200/30 p-5 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-12 h-12 bg-green-500/5 rounded-full filter blur-md"></div>
                <div className="text-center relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <img
                      src={AddOpeningLogo}
                      alt="Add Opening"
                      className="w-6 h-6 filter brightness-0 invert"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                    Add New Opening
                  </h3>
                  <p className="text-gray-600 text-xs mt-1">
                    Create new job posting
                  </p>
                </div>
              </div>
            </Link>

 
            <Link to="/browse-universities" className="group">
              <div className="bg-white/90 backdrop-blur-xl hover:bg-white transition-all duration-300 rounded-2xl shadow-md hover:shadow-lg border border-purple-200/30 p-5 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-12 h-12 bg-purple-500/5 rounded-full filter blur-md"></div>
                <div className="text-center relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <img
                      src={BrowseUniLogo}
                      alt="Browse Universities"
                      className="w-7 h-7 filter brightness-0 invert"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                    Browse Universities
                  </h3>
                  <p className="text-gray-600 text-xs mt-1">
                    Explore partner institutions
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

 
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <img
                  src={CurrentopningLogo}
                  alt="Current Openings"
                  className="w-5 h-5 filter brightness-0 invert"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Current Openings
              </h2>
            </div>
            {jobOpenings.length > 0 && (
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium shadow-md">
                {jobOpenings.length} Active{" "}
                {jobOpenings.length === 1 ? "Opening" : "Openings"}
              </span>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
   
            {currentJobs.length > 0 ? (

              currentJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white/90 backdrop-blur-2xl rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg border border-gray-200/30 p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute -right-8 -top-8 w-20 h-20 sm:w-32 sm:h-32 bg-indigo-500/5 rounded-full filter blur-xl"></div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
               
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                            {job.jobTitle}
                          </h3>
                          <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-lg font-medium">
                              Active
                            </span>
                            <span className="text-gray-500 flex items-center">
                              <svg
                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Posted:{" "}
                              {job.createdAt
                                ? new Date(
                                    job.createdAt.seconds * 1000
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {job.jobDescription}
                      </p>

                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <button
                          onClick={() => handleViewApplications(job)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-blue-700 text-white cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center"
                        >
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          View Applications
                        </button>

                        <button
                          onClick={() => handleCloseJob(job.id)}
                          disabled={closingJob === job.id}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 cursor-pointer text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center"
                        >
                          {closingJob === job.id
                            ? "Closing..."
                            : "Close Opening"}
                        </button>
                      </div>
                    </div>

                  
                    <div className="flex-shrink-0 self-center sm:self-start">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md border border-gray-200/50 overflow-hidden">
                        {hrProfile?.companyLogo ? (
                          <img
                            src={hrProfile.companyLogo}
                            alt={hrProfile.company || "Company Logo"}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md sm:rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white text-lg sm:text-xl font-bold">
                              {hrProfile?.company?.charAt(0) || "C"}
                            </span>
                          </div>
                        )}
                      </div>
                      {hrProfile?.company && (
                        <p className="text-[11px] sm:text-xs text-gray-600 text-center mt-1 sm:mt-2 font-medium">
                          {hrProfile.company}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">No Job Openings Yet</div>
            )}
             <div className="flex justify-center items-center space-x-2 mt-8">
   
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg text-white font-semibold shadow 
        ${currentPage === 1
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-500 to-indigo-600 cursor-pointer text-white hover:opacity-90"
        }`}
      >
        Previous
      </button>

    
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-lg font-semibold shadow 
            ${currentPage === index + 1
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
              : "bg-white text-gray-800 border cursor-pointer border-gray-300 hover:bg-gray-100"
            }`}
        >
          {index + 1}
        </button>
      ))}

      
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg text-white font-semibold shadow 
        ${currentPage === totalPages
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-500 to-indigo-600 cursor-pointer text-white hover:opacity-90"
        }`}
      >
        Next
      </button>
    </div>
          </div>
        </div>
      </div>


      {showApplicationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 mt-20">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-2xl font-bold truncate">
                    Applications
                  </h3>
                  <p className="text-blue-100 text-sm sm:text-base truncate">
                    {selectedJobApplications?.job?.jobTitle} -{" "}
                    {hrProfile?.company}
                  </p>
                </div>
                <button
                  onClick={() => setShowApplicationsModal(false)}
                  className="text-white hover:text-red-200 transition-colors ml-4 flex-shrink-0"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)]">
              {loadingApplications ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600 text-sm sm:text-base">
                    Loading applications...
                  </span>
                </div>
              ) : selectedJobApplications?.applications?.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {selectedJobApplications.applications.map((application) => (
                    <div
                      key={application.id}
                      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                     
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                   
                          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
                            {application.studentProfile?.profilePic ? (
                              <img
                                src={application.studentProfile.profilePic}
                                alt={`${
                                  application.studentProfile?.name || "Student"
                                } Avatar`}
                                className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <span
                              className={`text-white font-bold text-sm sm:text-base md:text-xl ${
                                application.studentProfile?.profilePic
                                  ? "hidden"
                                  : "flex"
                              } items-center justify-center w-full h-full`}
                            >
                              {application.studentProfile?.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                application.studentProfile?.studentEmail
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                "?"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate">
                              {application.studentProfile?.name ||
                                "Unknown Student"}
                            </h4>
                            <p className="text-gray-600 text-sm truncate">
                              {application.studentProfile?.university || "N/A"}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              Applied {formatDate(application.appliedAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-start sm:justify-end">
                          {getStatusBadge(application.status)}
                        </div>
                      </div>

                    
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-6">
                   
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <h5 className="font-semibold text-gray-800 mb-3 flex items-center text-sm sm:text-base">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Personal Information
                          </h5>
                          <div className="space-y-2 sm:space-y-3">
                            {(application.studentProfile?.studentEmail ||
                              application.studentEmail) && (
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                                  Email:
                                </span>
                                {application.studentEmail ||
                                  application.studentProfile?.studentEmail}
                              </div>
                            )}
                            {application.studentProfile?.degreeProgram && (
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                                  Degree:
                                </span>
                                <span className="text-xs sm:text-sm font-medium text-gray-800 break-words">
                                  {application.studentProfile.degreeProgram}
                                </span>
                              </div>
                            )}
                            {application.studentProfile?.timePeriod && (
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                                  Duration:
                                </span>
                                <span className="text-xs sm:text-sm font-medium text-gray-800">
                                  {application.studentProfile.timePeriod}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                     
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                          <h5 className="font-semibold text-gray-800 mb-3 flex items-center text-sm sm:text-base">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                            Professional Links
                          </h5>
                          <div className="space-y-2 sm:space-y-3">
                            {application.studentProfile?.github && (
                              <a
                                href={
                                  application.studentProfile.github.startsWith(
                                    "http"
                                  )
                                    ? application.studentProfile.github
                                    : `https://${application.studentProfile.github}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 sm:p-3 bg-gray-800 hover:bg-gray-900 rounded-lg transition-colors group"
                              >
                                <div className="flex items-center min-w-0">
                                  <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2 sm:mr-3 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                  </svg>
                                  <span className="text-white font-medium text-sm sm:text-base truncate">
                                    GitHub
                                  </span>
                                </div>
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            )}
                            {application.studentProfile?.linkedin && (
                              <a
                                href={
                                  application.studentProfile.linkedin.startsWith(
                                    "http"
                                  )
                                    ? application.studentProfile.linkedin
                                    : `https://${application.studentProfile.linkedin}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2 sm:p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group"
                              >
                                <div className="flex items-center min-w-0">
                                  <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2 sm:mr-3 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                  </svg>
                                  <span className="text-white font-medium text-sm sm:text-base truncate">
                                    LinkedIn
                                  </span>
                                </div>
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-blue-200 group-hover:text-white transition-colors flex-shrink-0"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            )}

                          
                            {application.studentProfile?.resume && (
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                                <div className="flex items-center justify-between gap-2">
                                  <h5 className="font-semibold text-gray-800 flex items-center text-sm">
                                    <svg
                                      className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                    <span className="truncate">Resume</span>
                                  </h5>
                                  <a
                                    href={application.studentProfile.resume}
                                    download={`Resume_${
                                      application.studentProfile?.name?.replace(
                                        /\s+/g,
                                        "_"
                                      ) || "Student"
                                    }.pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors flex items-center group flex-shrink-0"
                                    title={`Download Resume - ${
                                      application.studentProfile?.name ||
                                      "Student"
                                    }`}
                                  >
                                    <svg
                                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:scale-110 transition-transform"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                    <span className="text-xs sm:text-sm">
                                      Download
                                    </span>
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                    
                        {(application.studentProfile?.about ||
                          application.studentProfile?.bio) && (
                          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <h5 className="font-semibold text-gray-800 mb-3 flex items-center text-sm sm:text-base">
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              About
                            </h5>
                            <div className="space-y-2">
                              {application.studentProfile?.about && (
                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                                    About
                                  </span>
                                  <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                                    {application.studentProfile.about}
                                  </p>
                                </div>
                              )}
                              {application.studentProfile?.bio && (
                                <div>
                                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                                    Bio
                                  </span>
                                  <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                                    {application.studentProfile.bio}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                
                      <div className="border-t border-gray-200 pt-3 sm:pt-4">
                        {(application.status === "pending" ||
                          application.status === "applied") && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                            <button
                              onClick={() =>
                                handleUpdateApplicationStatus(
                                  application.id,
                                  "interviewing"
                                )
                              }
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center text-sm sm:text-base"
                            >
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              Interview
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateApplicationStatus(
                                  application.id,
                                  "accepted"
                                )
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center text-sm sm:text-base"
                            >
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateApplicationStatus(
                                  application.id,
                                  "rejected"
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center text-sm sm:text-base"
                            >
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Reject
                            </button>
                          </div>
                        )}

                        {application.status === "interviewing" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <button
                              onClick={() =>
                                handleUpdateApplicationStatus(
                                  application.id,
                                  "accepted"
                                )
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center text-sm sm:text-base"
                            >
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Accept Candidate
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateApplicationStatus(
                                  application.id,
                                  "rejected"
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center text-sm sm:text-base"
                            >
                              <svg
                                className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Reject Candidate
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    No Applications Yet
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    This job hasn't received any applications yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HR_Home;
