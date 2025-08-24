import { useState, useEffect } from "react";
import { getPastJobOpenings } from "../../Firebase/auth";
import { Link } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../../Firebase/db";
import { onAuthStateChanged } from 'firebase/auth';
import { HiOutlineClock, HiOutlineBriefcase, HiOutlineCalendarDays, HiOutlineMapPin, HiOutlineCurrencyDollar, HiOutlineArchiveBoxXMark, HiOutlineArrowRight } from 'react-icons/hi2';
import { getPastJobOpeningsByUser } from "../../Firebase/auth";
import analysisLogo from "../../assets/analytics.png"
const PastOpening = () => {
  const [pastJobOpenings, setPastJobOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hrProfile, setHrProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');

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

useEffect(() => {
  const fetchPastOpenings = async () => {
    try {
      setLoading(true);
      
      const currentUserUID = user?.uid || auth.currentUser?.uid || localStorage.getItem('uid');
      
      if (!currentUserUID || currentUserUID === 'null' || currentUserUID === 'undefined') {
       
        setPastJobOpenings([]);
        return;
      }

      
    
      const userPastJobs = await getPastJobOpeningsByUser(currentUserUID);
      
   
      setPastJobOpenings(userPastJobs);
    } catch (error) {
     
      setPastJobOpenings([]);
    } finally {
      setLoading(false);
    }
  };

  if (user?.uid) {
    fetchPastOpenings();
  }
}, [user?.uid]);



  const getCompensationColor = (compensation) => {
    switch (compensation?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-gray-100 text-gray-800';
      case 'stipend':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs = pastJobOpenings.filter(job => {
    if (filter === 'all') return true;
    return job.type?.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-blue-50/20 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <HiOutlineClock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
         
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <HiOutlineArchiveBoxXMark className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2" style={{ fontFamily: "Public Sans" }}>
                  My Past Job Openings
                </h1>
                <p className="text-sm sm:text-base text-gray-600" style={{ fontFamily: "Public Sans" }}>
                  Review your completed job postings and hiring history
                </p>
              </div>
            </div>
            <Link
              to="/hr-dashboard"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base self-start lg:self-auto"
              style={{ fontFamily: "Public Sans" }}
            >
              <HiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2 rotate-180" />
              Back to Dashboard
            </Link>
          </div>

          
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 mb-4 sm:mb-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-600 mb-1">{pastJobOpenings.length}</div>
                <div className="text-xs sm:text-sm text-gray-500">Total Closed</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1">
                  {pastJobOpenings.filter(job => job.type === 'internship').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Internships</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-600 mb-1">
                  {pastJobOpenings.filter(job => job.type === 'job').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Full-time Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1">
                  {pastJobOpenings.reduce((total, job) => total + (job.applicationsCount || 0), 0)}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Total Applications</div>
              </div>
            </div>
          </div>

          
          {pastJobOpenings.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900" style={{ fontFamily: "Public Sans" }}>
                  Filter by Type
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {['all', 'internship', 'job', 'part-time'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        filter === type
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      style={{ fontFamily: "Public Sans" }}
                    >
                      {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-6">
          {filteredJobs.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {filteredJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    
                    <div className="relative flex-shrink-0 self-center sm:self-start">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                        {hrProfile?.companyLogo ? (
                          <img 
                            src={hrProfile.companyLogo} 
                            alt={hrProfile.company || "Company Logo"} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm sm:text-lg font-bold">
                              {hrProfile?.company?.charAt(0) || job.jobTitle?.charAt(0) || 'C'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                                        <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors" style={{ fontFamily: "Public Sans" }}>
                            {job.jobTitle || 'Job Title'}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2" style={{ fontFamily: "Public Sans" }}>
                            {hrProfile?.company || 'Company Name'}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getCompensationColor(job.compensation)}`}>
                            {job.compensation || 'Unknown'}
                          </span>
                          <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                            Closed
                          </span>
                        </div>
                      </div>

                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                          <HiOutlineMapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{job.location || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                          <HiOutlineCalendarDays className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">Closed on {job.closedAt 
                            ? new Date(job.closedAt.seconds * 1000).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: window.innerWidth < 640 ? '2-digit' : 'numeric'
                              })
                            : 'Unknown date'
                          }</span>
                        </div>
                        {job.payRange && (
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                            <HiOutlineCurrencyDollar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{job.payRange}</span>
                          </div>
                        )}
                      </div>

                    
                      {job.jobDescription && (
                        <p className="text-gray-700 text-xs sm:text-sm line-clamp-2 mb-3" style={{ fontFamily: "Public Sans" }}>
                          {job.jobDescription.length > (window.innerWidth < 640 ? 100 : 150) 
                            ? `${job.jobDescription.substring(0, window.innerWidth < 640 ? 100 : 150)}...` 
                            : job.jobDescription
                          }
                        </p>
                      )}

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                          <div className="flex items-center space-x-1 text-blue-600">
                            <HiOutlineBriefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-medium">{job.applicationsCount || 0} Applications</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <HiOutlineClock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Posted {job.createdAt 
                              ? new Date(job.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'Unknown'
                            }</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="max-w-md mx-auto px-4">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <HiOutlineArchiveBoxXMark className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3" style={{ fontFamily: "Public Sans" }}>
                  {filter === 'all' ? 'No Past Job Openings' : `No ${filter} positions found`}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed" style={{ fontFamily: "Public Sans" }}>
                  {filter === 'all' 
                    ? "You haven't closed any job openings yet. Once you close current openings, they will appear here for your reference."
                    : `You haven't closed any ${filter} positions yet. Try a different filter or check back later.`
                  }
                </p>
                <div className="flex flex-col gap-3 sm:gap-4 justify-center">
                  <Link
                    to="/add-new-opening"
                    className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                    style={{ fontFamily: "Public Sans" }}
                  >
                    <HiOutlineBriefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Create New Opening
                  </Link>
                  <Link
                    to="/hr-dashboard"
                    className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm text-sm sm:text-base"
                    style={{ fontFamily: "Public Sans" }}
                  >
                    View Current Openings
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default PastOpening;