import { useState, useEffect } from "react";
import { getPastJobOpenings } from "../../Firebase/auth";
import { Link } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../../Firebase/db";
import { onAuthStateChanged } from 'firebase/auth';

const PastOpening = () => {
  const [pastJobOpenings, setPastJobOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hrProfile, setHrProfile] = useState(null);
  const [user, setUser] = useState(null);

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
        const pastJobs = await getPastJobOpenings();
        setPastJobOpenings(pastJobs);
      } catch (error) {
        console.error("Error fetching past job openings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPastOpenings();
  }, []);

  if (loading) {
    return (
      <div className="ml-2 sm:ml-4 md:ml-6 lg:ml-8 p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-2 sm:ml-4 md:ml-6 lg:ml-8 p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 
            className="text-[#0D141C] text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
            style={{ fontFamily: "Public Sans" }}
          >
            Past Openings
          </h1>
        </div>
        
        <Link
          to="/hr-dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <span className="text-sm text-gray-600 font-medium">All</span>
        </div>

        {pastJobOpenings.length > 0 ? (
          <div className="space-y-4">
            {pastJobOpenings.map((job) => (
              <div
                key={job.id}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {/* Company Logo */}
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {hrProfile?.companyLogo ? (
                    <img 
                      src={hrProfile.companyLogo} 
                      alt={hrProfile.company || "Company Logo"} 
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {hrProfile?.company?.charAt(0) || job.jobTitle?.charAt(0) || 'C'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Job Details */}
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {job.jobTitle || 'Job Title'}-{job.type || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Closed on {job.closedAt 
                      ? new Date(job.closedAt.seconds * 1000).toLocaleDateString('en-US', {
                          month: 'numeric',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Unknown date'
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No past job openings
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't closed any job openings yet. Once you close current openings, they will appear here.
              </p>
              <Link
                to="/hr-dashboard"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Current Openings
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastOpening;