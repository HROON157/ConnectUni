import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import PastOpeningLogo from "../../assets/time-past.png";
import ActiveLogo from "../../assets/activities.png";
import BrowseCompanyLogo from "../../assets/computer-business.png";
import { db, auth } from "../../Firebase/db";
import {
  submitJobApplication,
  checkExistingApplication,
} from "../../Firebase/applicationService";

import {
  collection,
  getDocs,
  addDoc,
  limit,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

const Student_Home = () => {
  const userName = localStorage.getItem("userName");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hrProfiles, setHrProfiles] = useState({});
  const [expandedJobs, setExpandedJobs] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState({});
  const [applying, setApplying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
  window.scrollTo({ top: 0, behavior: "smooth" }); 
};
  const toggleJobDetails = (jobId) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };


  const fetchJobData = useCallback(async () => {
    try {
      const q = query(
        collection(db, "jobOpenings"),
        where("status", "==", "active"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
  
      throw error;
    }
  }, []);
  const handleApplyForJob = async (job) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("Please log in to apply for jobs");
      return;
    }

    try {
      setApplying(true);

     
      const hasApplied = await checkExistingApplication(job.id, userId);
      if (hasApplied) {
        alert("You have already applied for this position");
        return;
      }
      const result = await submitJobApplication(job.id);

      if (result.success) {
        alert("Application submitted successfully!");
        setApplicationStatus((prev) => ({
          ...prev,
          [job.id]: "applied",
        }));
      }
    } catch (error) {
      alert("Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const checkApplicationStatuses = useCallback(async () => {
    const userId = auth.currentUser?.uid;
    if (!userId || jobs.length === 0) return;

    const statuses = {};
    for (const job of jobs) {
      try {
        const hasApplied = await checkExistingApplication(job.id, userId);
        if (hasApplied) {
          statuses[job.id] = "applied";
        }
      } catch (error) {
      }
    }
    setApplicationStatus(statuses);
  }, [jobs]);

  const fetchHRProfile = useCallback(
    async (userId) => {
      try {
        if (hrProfiles[userId]) {
          return hrProfiles[userId];
        }

        let hrDoc = await getDoc(doc(db, "hrProfiles", userId));
        if (hrDoc.exists()) {
          const profileData = hrDoc.data();
   
          setHrProfiles((prev) => ({
            ...prev,
            [userId]: profileData,
          }));
          return profileData;
        }
        
        return null;
      } catch (error) {
             return null;
      }
    },
    [hrProfiles]
  );

  useEffect(() => {
    let isMounted = true;
    const loadJobsAndProfiles = async () => {
      try {

        setError(null);
        const jobData = await fetchJobData();
     

        if (isMounted) {
          setJobs(jobData);

          const uniqueHRIds = [
            ...new Set(jobData.map((job) => job.postedBy).filter(Boolean)),
          ];

          const profilePromises = uniqueHRIds.map((userId) =>
            fetchHRProfile(userId)
          );
          await Promise.allSettled(profilePromises);
        }
      } catch (error) {
        if (isMounted) {
          setError("Failed to load job opportunities");
    
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setDataLoaded(true);
        }
      }
    };

    loadJobsAndProfiles();

    return () => {
      isMounted = false;
    };
  }, [fetchJobData, fetchHRProfile]);


  useEffect(() => {
    if (dataLoaded && jobs.length > 0) {
      checkApplicationStatuses();
    }
  }, [dataLoaded, jobs, checkApplicationStatuses]);

  const CompanyLogo = React.memo(
    ({ job, size = "w-16 h-16 sm:w-20 sm:h-20" }) => {
      const hrProfile = hrProfiles[job.postedBy];
      const companyLogo = hrProfile?.companyLogo;
      const companyName = hrProfile?.company;

      const getInitials = (name) => {
        if (!name) return "CO";
        return name
          .split(" ")
          .filter((word) => word.length > 0)
          .map((word) => word[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      };

      const logoColors = [
        "from-blue-500 to-blue-600",
        "from-green-500 to-green-600",
        "from-purple-500 to-purple-600",
        "from-red-500 to-red-600",
        "from-yellow-400 to-yellow-500",
        "from-pink-500 to-pink-600",
        "from-indigo-500 to-indigo-600",
        "from-teal-500 to-teal-600",
      ];

      const colorIndex = useMemo(() => {
        if (!job.postedByEmail) return 0;
        return job.postedByEmail.charCodeAt(0) % logoColors.length;
      }, [job.postedByEmail]);

      if (companyLogo) {
        return (
          <div
            className={`${size} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 bg-white border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300`}
          >
            <img
              src={companyLogo}
              alt={`${companyName} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {

                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              className={`w-full h-full bg-gradient-to-br ${logoColors[colorIndex]} rounded-xl flex items-center justify-center`}
              style={{ display: "none" }}
            >
              <span className="text-white font-bold text-lg">
                {getInitials(companyName)}
              </span>
            </div>
          </div>
        );
      }

      return (
        <div
          className={`${size} bg-gradient-to-br ${logoColors[colorIndex]} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 hover:shadow-xl transition-all duration-300`}
        >
          <span className="text-white font-bold text-lg">
            {getInitials(companyName)}
          </span>
        </div>
      );
    }
  );

  const JobDetailsAccordion = React.memo(({ job, isExpanded }) => {
    const hrProfile = hrProfiles[job.postedBy];
    const companyName = hrProfile?.company;
    const hasApplied = applicationStatus[job.id] === "applied";

    if (!isExpanded) return null;

    return (
      <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
           
            <div className="lg:col-span-2 space-y-6">
          
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <CompanyLogo job={job} size="w-16 h-16" />
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900">
                      {companyName}
                    </h4>
                    <p className="text-gray-600">{job.postedByEmail}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">
                        Active Posting
                      </span>
                    </div>
                  </div>
                </div>
              </div>

        
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="white"
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
                  Job Description
                </h4>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.jobDescription || "No detailed description available."}
                  </p>
                </div>
              </div>

    
              {job.requirements && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="white"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                    Requirements & Qualifications
                  </h4>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {job.requirements}
                    </p>
                  </div>
                </div>
              )}
            </div>

            
            <div className="space-y-4">
                   {job.location && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-xl flex items-center justify-center text-black">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="white"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h5 className="font-bold text-gray-900">Location</h5>
                  </div>
                  <p className="text-gray-700 font-medium">{job.location}</p>
                </div>
              )}

      
              {job.type && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="white"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h5 className="font-bold text-gray-900">Job Type</h5>
                  </div>
                  <p className="text-gray-700 font-medium capitalize">
                    {job.type}
                  </p>
                </div>
              )}

        
              {job.compensation && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="white"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h5 className="font-bold text-gray-900">Compensation</h5>
                  </div>
                  <p className="text-gray-700 font-medium capitalize">
                    {job.compensation}
                  </p>
                  {job.payRange && (
                    <p className="text-sm text-gray-600 mt-2 font-medium">
                      {job.payRange}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => handleApplyForJob(job)}
                disabled={applying || hasApplied}
                className={`w-full font-bold cursor-pointer py-4 px-8 rounded-xl transition-all duration-300 shadow-lg text-center ${
                  hasApplied
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : applying
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105"
                }`}
              >
                {hasApplied
                  ? "Already Applied"
                  : applying
                  ? "Applying..."
                  : "Apply for this Position"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });


const JobCard = React.memo(({ job }) => {
  const hrProfile = hrProfiles[job.postedBy];
  const companyName = hrProfile?.company;
  const isExpanded = expandedJobs[job.id];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 hover:border-gray-200">

      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
         
          <div className="flex-1 min-w-0 order-2 sm:order-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <p className="text-xs sm:text-sm text-blue-600 font-semibold">
                {companyName}
              </p>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-snug">
              {job.jobTitle || job.title || "Position Available"}
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
              {job.jobDescription ||
                job.description ||
                "Exciting opportunity to join our team and contribute to innovative projects."}
            </p>

       
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.type && (
                <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  {job.type}
                </span>
              )}
              {job.location && (
                <span className="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  {job.location}
                </span>
              )}
              {job.compensation && (
                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {job.compensation}
                </span>
              )}
            </div>

 
            <button
              onClick={() => toggleJobDetails(job.id)}
              className="inline-flex cursor-pointer items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow"
            >
              {isExpanded ? (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  Hide
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  View Details
                </>
              )}
            </button>
          </div>

  
<div className="flex flex-col items-center  order-1 sm:order-2">
  <CompanyLogo
    job={job}
    size="w-28 h-28 sm:w-28 sm:h-28 lg:w-32 lg:h-32"
  />
  {hrProfile?.company && (
    <p className="text-xs text-gray-600 text-center sm:text-right mt-3  font-medium">
      {hrProfile.company}
    </p>
  )}
</div>

        </div>
      </div>


      <JobDetailsAccordion job={job} isExpanded={isExpanded} />
    </div>
  );
});


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <div className="h-6 bg-gray-200 rounded w-48 mb-3 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>

          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-pulse"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded w-40"></div>
                  </div>
                  <div className="w-32 h-32 bg-gray-200 rounded-2xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-gray-600 text-lg mb-2">Hello, {userName}</p>
            <h1 className="text-4xl font-bold text-gray-900">
              Explore Opportunities
            </h1>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }


return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
    <div className="max-w-7xl mx-auto">

      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
              Welcome back, {userName}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Manage your career journey and discover new opportunities tailored for you.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-gray-500">Latest opportunities updated</span>
          </div>
        </div>
        

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Link to="/past-applications" className="group">
            <div className="bg-white/95 backdrop-blur-xl hover:bg-white transition-all duration-300 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 p-6 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden h-full">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-100/30 rounded-full filter blur-xl"></div>
              <div className="flex flex-col h-full ">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <img
                    src={PastOpeningLogo}
                    alt="Past Applications"
                    className="w-6 h-6 filter brightness-0 invert"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                  Past Applications
                </h3>
                <p className="text-gray-500 text-sm mt-auto">
                  Review your application history and outcomes
                </p>
              </div>
            </div>
          </Link>

          <Link to="/active-applications" className="group">
            <div className="bg-white/95 backdrop-blur-xl hover:bg-white transition-all duration-300 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 p-6 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden h-full">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-100/30 rounded-full filter blur-xl"></div>
              <div className="flex flex-col h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <img
                    src={ActiveLogo}
                    alt="Active Applications"
                    className="w-7 h-7 filter brightness-0 invert"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors mb-2">
                  Active Applications
                </h3>
                <p className="text-gray-500 text-sm mt-auto">
                  Track your ongoing applications and their status
                </p>
              </div>
            </div>
          </Link>

          <Link to="/browse-companies" className="group">
            <div className="bg-white/95 backdrop-blur-xl hover:bg-white transition-all duration-300 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 p-6 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden h-full">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-100/30 rounded-full filter blur-xl"></div>
              <div className="flex flex-col h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <img
                    src={BrowseCompanyLogo}
                    alt="Browse Companies"
                    className="w-7 h-7 filter brightness-0 invert"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-600 transition-colors mb-2">
                  Browse Companies
                </h3>
                <p className="text-gray-500 text-sm mt-auto">
                  Explore potential employers and their opportunities
                </p>
              </div>
            </div>
          </Link>
        </div>
        

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Explore Opportunities
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{jobs.length} opportunities available</span>
            </div>
          </div>
          <p className="text-gray-600">
            Discover amazing career opportunities that match your skills and interests.
          </p>
        </div>
      </div>

      {loading && (
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-xs border border-gray-100 p-6 animate-pulse"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded w-32 mb-3"></div>
                  <div className="h-7 bg-gray-100 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                  <div className="h-9 bg-gray-100 rounded w-40"></div>
                </div>
                <div className="w-28 h-28 bg-gray-100 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      )}


      {!loading && error && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-xs">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
          >
            Try Again
          </button>
        </div>
      )}
      {!loading && !error && dataLoaded && jobs.length > 0 && (
  <>
    <div className="grid gap-6">
      {currentJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>

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
  </>
)}

      {!loading && !error && dataLoaded && jobs.length === 0 && (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-10 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No opportunities available
          </h3>
          <p className="text-gray-500">
            Check back later for new job openings and internships.
          </p>
        </div>
      )}
    </div>
  </div>
);
};
export default Student_Home;
