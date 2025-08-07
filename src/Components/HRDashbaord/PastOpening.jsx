import { useState, useEffect } from "react";
import { getPastJobOpenings } from "../../Firebase/auth";
import { Link } from "react-router-dom";

const PastOpening = () => {
  const [pastJobOpenings, setPastJobOpenings] = useState([]);
  const [loading, setLoading] = useState(true);

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
            Past Job Openings
          </h1>
          <p 
            className="text-gray-600 text-lg mt-2"
            style={{ fontFamily: "Public Sans" }}
          >
            View all closed job openings and their details
          </p>
        </div>
        
        <Link
          to="/hr-dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Total Closed</h3>
          <p className="text-3xl font-bold text-red-900">{pastJobOpenings.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">This Month</h3>
          <p className="text-3xl font-bold text-gray-900">
            {pastJobOpenings.filter(job => {
              if (job.closedAt) {
                const closedDate = new Date(job.closedAt.seconds * 1000);
                const now = new Date();
                return closedDate.getMonth() === now.getMonth() && 
                       closedDate.getFullYear() === now.getFullYear();
              }
              return false;
            }).length}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Average Days Open</h3>
          <p className="text-3xl font-bold text-blue-900">
            {pastJobOpenings.length > 0 ? Math.round(
              pastJobOpenings.reduce((acc, job) => {
                if (job.createdAt && job.closedAt) {
                  const created = new Date(job.createdAt.seconds * 1000);
                  const closed = new Date(job.closedAt.seconds * 1000);
                  const daysOpen = Math.ceil((closed - created) / (1000 * 60 * 60 * 24));
                  return acc + daysOpen;
                }
                return acc;
              }, 0) / pastJobOpenings.length
            ) : 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Closed Job Openings</h2>
        </div>

        {pastJobOpenings.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {pastJobOpenings.map((job) => (
              <div
                key={job.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {job.jobTitle}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {job.jobDescription}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Posted:</span>
                        <p className="text-gray-600">
                          {job.createdAt
                            ? new Date(job.createdAt.seconds * 1000).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Closed:</span>
                        <p className="text-gray-600">
                          {job.closedAt
                            ? new Date(job.closedAt.seconds * 1000).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Days Open:</span>
                        <p className="text-gray-600">
                          {job.createdAt && job.closedAt
                            ? Math.ceil(
                                (new Date(job.closedAt.seconds * 1000) - 
                                 new Date(job.createdAt.seconds * 1000)) / 
                                (1000 * 60 * 60 * 24)
                              )
                            : "Unknown"} days
                        </p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
                          Closed
                        </span>
                      </div>
                    </div>

                    {(job.location || job.department || job.salary) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {job.location && (
                            <div>
                              <span className="font-medium text-gray-700">Location:</span>
                              <p className="text-gray-600">{job.location}</p>
                            </div>
                          )}
                          
                          {job.department && (
                            <div>
                              <span className="font-medium text-gray-700">Department:</span>
                              <p className="text-gray-600">{job.department}</p>
                            </div>
                          )}
                          
                          {job.salary && (
                            <div>
                              <span className="font-medium text-gray-700">Salary:</span>
                              <p className="text-gray-600">{job.salary}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-6">
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      View Details
                    </button>
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      View Applications
                    </button>
                  </div>
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