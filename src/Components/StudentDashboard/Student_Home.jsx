import React, { useState, useEffect, useCallback, useMemo } from "react";
import { db } from "../../Firebase/db";
import {
  collection,
  getDocs,
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
  const [dataLoaded,setDataLoaded] = useState(false);
  // Toggle accordion
  const toggleJobDetails = (jobId) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  // Memoized fetch function
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
      console.error("Error fetching jobs:", error);
      throw error;
    }
  }, []);

  // Fixed HR profile fetching - try both collections
  const fetchHRProfile = useCallback(
    async (userId) => {
      try {
        if (hrProfiles[userId]) {
          return hrProfiles[userId];
        }

        let hrDoc = await getDoc(doc(db, "hrProfiles", userId));
        if (hrDoc.exists()) {
          const profileData = hrDoc.data();
          console.log("HR Profile found:", profileData);
          setHrProfiles((prev) => ({
            ...prev,
            [userId]: profileData,
          }));
          return profileData;
        }
        console.log("No HR profile found for userId:", userId);
        return null;
      } catch (error) {
        console.error("Error fetching HR profile:", error);
        return null;
      }
    },
    [hrProfiles]
  );

  useEffect(() => {
    let isMounted = true;
    const loadJobsAndProfiles = async () => {
      try {
        // setLoading(true);
        setError(null);
        const jobData = await fetchJobData();
        console.log("Jobs fetched:", jobData);

        if (isMounted) {
          setJobs(jobData);

          const uniqueHRIds = [
            ...new Set(jobData.map((job) => job.postedBy).filter(Boolean)),
          ];
          console.log("Unique HR IDs:", uniqueHRIds); // Debug log

          const profilePromises = uniqueHRIds.map((userId) =>
            fetchHRProfile(userId)
          );
          await Promise.allSettled(profilePromises);
        }
      } catch (error) {
        if (isMounted) {
          setError("Failed to load job opportunities");
          console.error(error);
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

  // Enhanced responsive company logo component
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
                console.log("Image failed to load:", companyLogo); // Debug log
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

  // Beautiful responsive job details accordion
  const JobDetailsAccordion = React.memo(({ job, isExpanded }) => {
    const hrProfile = hrProfiles[job.postedBy];
    const companyName = hrProfile?.company;

    if (!isExpanded) return null;

    return (
      <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left side - Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Info Card */}
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

              {/* Job Description */}
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

              {/* Requirements */}
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

            {/* Right side - Job info cards */}
            <div className="space-y-4">
              {/* Location */}
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

              {/* Job Type */}
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

              {/* Compensation */}
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

              <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg text-center">
                Apply for this Position
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

  // Beautiful responsive job card
  const JobCard = React.memo(({ job }) => {
    const hrProfile = hrProfiles[job.postedBy];
    const companyName = hrProfile?.company;
    const isExpanded = expandedJobs[job.id];

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-gray-200">
        {/* Main job card */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            {/* Left side - Job info */}
            <div className="flex-1 min-w-0 order-2 sm:order-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <p className="text-sm text-blue-600 font-semibold">
                  {companyName}
                </p>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {job.jobTitle || job.title || "Position Available"}
              </h3>

              <p className="text-gray-600 text-base leading-relaxed line-clamp-2 mb-6">
                {job.jobDescription ||
                  job.description ||
                  "Exciting opportunity to join our team and contribute to innovative projects."}
              </p>

              {/* Metadata tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {job.type && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {job.type}
                  </span>
                )}
                {job.location && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    {job.location}
                  </span>
                )}
                {job.compensation && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {job.compensation}
                  </span>
                )}
              </div>

              {/* Action button */}
              <button
                onClick={() => toggleJobDetails(job.id)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                {isExpanded ? (
                  <>
                    <svg
                      className="w-4 h-4"
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
                    Hide Details
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
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
                    View Job Details
                  </>
                )}
              </button>
            </div>

            {/* Right side - Company logo */}
            <div className="flex justify-center sm:justify-end order-1 sm:order-2">
              <CompanyLogo
                job={job}
                size="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32"
              />
            </div>
          </div>
        </div>

        {/* Accordion content */}
        <JobDetailsAccordion job={job} isExpanded={isExpanded} />
      </div>
    );
  });

  // Beautiful loading state
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

  // Error state
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

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Beautiful header */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-indigo-800 bg-clip-text  mb-4">
            Hello, {userName}{" "}
          </h1>
          <h2 className="text-2xl sm:text-2xl lg:text-2xl  text-gray-900 mb-4">
            Explore Opportunities
          </h2>
          <p className="text-gray-600 text-lg">
            Discover amazing career opportunities that match your skills and
            interests.
          </p>
        </div>

        {loading && (
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
        )}

        {/* Show error state */}
        {!loading && error && (
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
        )}

        {/* Show job listings */}
        {!loading && !error && dataLoaded && jobs.length > 0 && (
          <div className="space-y-8">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {/* Show no data message */}
        {!loading && !error && dataLoaded && jobs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No opportunities available
            </h3>
            <p className="text-gray-500 text-lg">
              Check back later for new job openings and internships.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Student_Home;
