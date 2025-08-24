import React, { useState, useEffect, useCallback, useRef } from 'react';
import { auth, db } from '../../Firebase/db';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';

const PastApplications = () => {
  const [applications, setApplications] = useState([]);
  const [hrProfiles, setHrProfiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [user, setUser] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  

  const hrProfilesRef = useRef({});
  const jobCacheRef = useRef({});
  
  
  useEffect(() => {
    hrProfilesRef.current = hrProfiles;
  }, [hrProfiles]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitialLoad(false);
      
      if (!currentUser) {
        setError("Please log in to view your applications");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

    const batchFetchHRProfiles = useCallback(async (userIds) => {
    const uniqueUserIds = [...new Set(userIds)].filter(id => !hrProfilesRef.current[id]);
    
    if (uniqueUserIds.length === 0) return;

    try {
 
      const profilePromises = uniqueUserIds.map(async (userId) => {
        try {
          let hrDoc = await getDoc(doc(db, "hrProfiles", userId));
          if (hrDoc.exists()) {
            return { userId, data: hrDoc.data() };
          }

      
          hrDoc = await getDoc(doc(db, "hr_users", userId));
          if (hrDoc.exists()) {
            return { userId, data: hrDoc.data() };
          }

          return { userId, data: null };
        } catch (error) {

          return { userId, data: null };
        }
      });

      const results = await Promise.all(profilePromises);
      

      const newProfiles = { ...hrProfilesRef.current };
      results.forEach(({ userId, data }) => {
        if (data) {
          newProfiles[userId] = data;
        }
      });

      hrProfilesRef.current = newProfiles;
      setHrProfiles(newProfiles);
    } catch (error) {
     
    }
  }, []);


  const batchFetchJobDetails = useCallback(async (jobIds) => {
    const uniqueJobIds = [...new Set(jobIds)].filter(id => id && !jobCacheRef.current[id]);
    
    if (uniqueJobIds.length === 0) return;

    try {
      const jobPromises = uniqueJobIds.map(async (jobId) => {
        try {
          const jobDoc = await getDoc(doc(db, "jobOpenings", jobId));
          return { 
            jobId, 
            data: jobDoc.exists() ? jobDoc.data() : null 
          };
        } catch (error) {

          return { jobId, data: null };
        }
      });

      const results = await Promise.all(jobPromises);
      

      results.forEach(({ jobId, data }) => {
        jobCacheRef.current[jobId] = data;
      });
    } catch (error) {

    }
  }, []);

  const fetchPastApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.uid) {
        throw new Error("User not authenticated");
      }


      const q = query(
        collection(db, "applications"),
        where("studentId", "==", user.uid),
        orderBy("appliedAt", "desc")
      );

      const snapshot = await getDocs(q);
      
  
      const rawApplications = [];
      const userIds = [];
      const jobIds = [];

      snapshot.docs.forEach((docSnap) => {
        const appData = docSnap.data();
        
      
        const pastStatuses = ['accepted', 'rejected', 'completed'];
        if (pastStatuses.includes(appData.status)) {
          rawApplications.push({
            id: docSnap.id,
            ...appData
          });
          
  
          if (appData.postedBy) userIds.push(appData.postedBy);
          if (appData.jobId) jobIds.push(appData.jobId);
        }
      });

      if (rawApplications.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }


      await Promise.all([
        batchFetchHRProfiles(userIds),
        batchFetchJobDetails(jobIds)
      ]);


      const processedApplications = rawApplications.map((appData) => {

        let jobTitle = appData.jobTitle || "Unknown Position";
        if (appData.jobId && jobCacheRef.current[appData.jobId]) {
          jobTitle = jobCacheRef.current[appData.jobId].jobTitle || jobTitle;
        }

        return {
          ...appData,
          jobTitle,
          completedAt: appData.completedAt || appData.statusUpdatedAt,
        };
      });

      setApplications(processedApplications);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user, batchFetchHRProfiles, batchFetchJobDetails]);


  useEffect(() => {
    if (!initialLoad && user) {
      fetchPastApplications();
    } else if (!initialLoad && !user) {
      setLoading(false);
    }
  }, [initialLoad, user, fetchPastApplications]);


  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
   
      return 'N/A';
    }
  };

  const CompanyLogo = React.memo(({ application, size = "w-12 h-12 sm:w-16 sm:h-16" }) => {
    const hrProfile = hrProfiles[application.postedBy];
    const companyLogo = hrProfile?.companyLogo;
    const companyName = hrProfile?.company || hrProfile?.companyName || application.companyName || "Unknown Company";

    const getInitials = (name) => {
      if (!name) return "UC";
      return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const logoColors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600", 
      "from-blue-500 to-indigo-600",
      "from-red-500 to-red-600",
      "from-yellow-400 to-yellow-500",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-teal-500 to-teal-600",
    ];

    const colorIndex = Math.abs(application.postedBy?.charCodeAt(0) || 0) % logoColors.length;

    if (companyLogo) {
      return (
        <div className={`${size} rounded-lg sm:rounded-xl overflow-hidden shadow-lg flex-shrink-0`}>
          <img
            src={companyLogo}
            alt={companyName}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div
            className={`w-full h-full bg-gradient-to-br ${logoColors[colorIndex]} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg hidden`}
          >
            <span className="text-white font-bold text-sm sm:text-lg">
              {getInitials(companyName)}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${size} bg-gradient-to-br ${logoColors[colorIndex]} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}
      >
        <span className="text-white font-bold text-sm sm:text-lg">
          {getInitials(companyName)}
        </span>
      </div>
    );
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      accepted: {
        color: 'bg-green-100 text-green-800 border-green-200',
        text: 'Accepted',
      },
      rejected: {
        color: 'bg-red-100 text-red-800 border-red-200',
        text: 'Rejected',
      },
    };

    const config = statusConfig[status] || statusConfig.rejected;
    
    return (
      <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${config.color} flex items-center gap-1`}>
        <span className="text-xs">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Accepted') return app.status === 'accepted';
    if (activeTab === 'Rejected') return app.status === 'rejected';
    return true;
  });

  if (initialLoad || (loading && !error)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-red-900 mb-2">Error Loading Past Applications</h3>
            <p className="text-red-700 mb-4 text-sm sm:text-base">{error}</p>
            <button
              onClick={fetchPastApplications}
              className="bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors font-semibold text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">




        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-900 bg-clip-text text-transparent mb-2 sm:mb-4">
                Past Applications
              </h1>
              <p className="text-gray-600 text-sm sm:text-lg">
                View your completed, accepted, and rejected applications
              </p>
            </div>
            
            <Link
              to="/student-dashboard"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base self-start sm:self-auto"
              style={{ fontFamily: "Public Sans" }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>



        <div className="mb-4 sm:mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
            {['All', 'Accepted', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 sm:px-6 sm:py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

  
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No Past Applications Found</h3>
            <p className="text-gray-500 text-sm sm:text-lg">
              {activeTab === 'All' 
                ? "You don't have any completed applications yet."
                : `No applications with status "${activeTab.toLowerCase()}".`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredApplications.map((application) => {
              const hrProfile = hrProfiles[application.postedBy];
              const companyName = hrProfile?.company || hrProfile?.companyName || application.companyName || "Unknown Company";
              const statusDate = application.completedAt || application.appliedAt;
              
              return (
                <div key={application.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <CompanyLogo application={application} />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-1 truncate">
                          {application.jobTitle}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2 truncate">
                          {companyName}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500"> 
                           {application.status === 'accepted' ? 'Accepted' : 
                           'Rejected'} on {formatDate(statusDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center flex-shrink-0">
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastApplications;