import { useState, useEffect } from "react";
import { getPastJobOpenings } from "../../Firebase/auth";
import { Link } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../../Firebase/db";
import { onAuthStateChanged } from 'firebase/auth';
import { HiOutlineClock, HiOutlineBriefcase, HiOutlineCalendarDays, HiOutlineMapPin, HiOutlineCurrencyDollar, HiOutlineArchiveBoxXMark, HiOutlineArrowRight } from 'react-icons/hi2';
import { getPastJobOpeningsByUser } from "../../Firebase/auth";
const PastOpening = () => {
  const [pastJobOpenings, setPastJobOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hrProfile, setHrProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch HR Profile data
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

  // Monitor auth state
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

  // Fetch HR profile when user changes
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
        console.log('No user ID found, skipping fetch');
        setPastJobOpenings([]);
        return;
      }

      console.log('Fetching past openings for user:', currentUserUID);
      
      // Use the optimized function that filters at database level
      const userPastJobs = await getPastJobOpeningsByUser(currentUserUID);
      
      console.log('User past jobs:', userPastJobs.length);
      setPastJobOpenings(userPastJobs);
    } catch (error) {
      console.error("Error fetching past job openings:", error);
      setPastJobOpenings([]);
    } finally {
      setLoading(false);
    }
  };

  if (user?.uid) {
    fetchPastOpenings();
  }
}, [user?.uid]);

  const getJobTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'internship':
        return '🎓';
      case 'job':
      case 'full-time':
        return '💼';
      case 'part-time':
        return '⏰';
      default:
        return '🔧';
    }
  };

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <HiOutlineClock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add debug info in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Current user:', user);
    console.log('Past job openings:', pastJobOpenings);
    console.log('Filtered jobs:', filteredJobs);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
              <HiOutlineArchiveBoxXMark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Public Sans" }}>
                My Past Job Openings
              </h1>
              <p className="text-gray-600" style={{ fontFamily: "Public Sans" }}>
                📊 Review your completed job postings and hiring history
              </p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 mb-1">{pastJobOpenings.length}</div>
                <div className="text-sm text-gray-500">Total Closed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {pastJobOpenings.filter(job => job.type === 'internship').length}
                </div>
                <div className="text-sm text-gray-500">Internships</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {pastJobOpenings.filter(job => job.type === 'job').length}
                </div>
                <div className="text-sm text-gray-500">Full-time Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {pastJobOpenings.reduce((total, job) => total + (job.applicationsCount || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Applications</div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          {pastJobOpenings.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "Public Sans" }}>
                  Filter by Type
                </h3>
                <div className="flex items-center space-x-2">
                  {['all', 'internship', 'job', 'part-time'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === type
                          ? 'bg-purple-500 text-white shadow-md'
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

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          {filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job, index) => (
                <div
                  key={job.id}
                  className="group bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    {/* Company Logo */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden shadow-md">
                        {hrProfile?.companyLogo ? (
                          <img 
                            src={hrProfile.companyLogo} 
                            alt={hrProfile.company || "Company Logo"} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg font-bold">
                              {hrProfile?.company?.charAt(0) || job.jobTitle?.charAt(0) || 'C'}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Job Type Badge */}
                      <div className="absolute -top-2 -right-2 text-lg">
                        {getJobTypeIcon(job.type)}
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors" style={{ fontFamily: "Public Sans" }}>
                            {job.jobTitle || 'Job Title'}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2" style={{ fontFamily: "Public Sans" }}>
                            {hrProfile?.company || 'Company Name'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCompensationColor(job.compensation)}`}>
                            {job.compensation || 'Unknown'}
                          </span>
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                            Closed
                          </span>
                        </div>
                      </div>

                      {/* Job Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <HiOutlineMapPin className="w-4 h-4" />
                          <span>{job.location || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <HiOutlineCalendarDays className="w-4 h-4" />
                          <span>Closed on {job.closedAt 
                            ? new Date(job.closedAt.seconds * 1000).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'Unknown date'
                          }</span>
                        </div>
                        {job.payRange && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <HiOutlineCurrencyDollar className="w-4 h-4" />
                            <span>{job.payRange}</span>
                          </div>
                        )}
                      </div>

                      {/* Job Description Preview */}
                      {job.jobDescription && (
                        <p className="text-gray-700 text-sm line-clamp-2 mb-3" style={{ fontFamily: "Public Sans" }}>
                          {job.jobDescription.length > 150 
                            ? `${job.jobDescription.substring(0, 150)}...` 
                            : job.jobDescription
                          }
                        </p>
                      )}

                      {/* Stats Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1 text-blue-600">
                            <HiOutlineBriefcase className="w-4 h-4" />
                            <span className="font-medium">{job.applicationsCount || 0} Applications</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <HiOutlineClock className="w-4 h-4" />
                            <span>Posted {job.createdAt 
                              ? new Date(job.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : 'Unknown'
                            }</span>
                          </div>
                        </div>
                        
                        {/* View Details Button */}
                        <button className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium group-hover:translate-x-1 transition-all duration-200">
                          <span>View Details</span>
                          <HiOutlineArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HiOutlineArchiveBoxXMark className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "Public Sans" }}>
                  {filter === 'all' ? 'No Past Job Openings' : `No ${filter} positions found`}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed" style={{ fontFamily: "Public Sans" }}>
                  {filter === 'all' 
                    ? "You haven't closed any job openings yet. Once you close current openings, they will appear here for your reference."
                    : `You haven't closed any ${filter} positions yet. Try a different filter or check back later.`
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/new-openings"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    style={{ fontFamily: "Public Sans" }}
                  >
                    <HiOutlineBriefcase className="w-5 h-5 mr-2" />
                    Create New Opening
                  </Link>
                  <Link
                    to="/hr-dashboard"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm"
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