import { useEffect, useState } from "react";
import { db } from "../../Firebase/db";
import { where, getDocs, query, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
const company = {
  name: "Netsol",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxCM1HPn76y7Wcb-ellowpA0Iako5C7Npo8w&s",
  location: "Lahore, Punjab, Pakistan",
  headQuarter: "IT Village (Software Technology Park), Lahore Ring Road, Ghazi Road",
  industry: "Technology",
  size: "1,001–5,000 employees globally",
  founded: "1996",
  overview:
    "NETSOL Technologies is a global provider of enterprise software and IT services, specializing in the asset finance and leasing sectors. The company empowers automotive OEMs, financial institutions, and leasing organizations worldwide with its flagship NETSOL Financial Suite (NFS), along with AI-powered digital platforms and cloud services.",
  mission:
    "To be the premium solutions vendor to global finance and leasing businesses. We will leverage our leading market position in APAC, and our European and US presence, to continue to drive strong revenues from our current generation of finance and leasing solutions, and successfully grow our next generation platform.",
  vision:
    "To become the leading and world class provider of IT solutions and services in each market of operations, by leveraging our global positioning and creating strong growth potential, resulting in increasing shareholders' value and providing a conducive environment for our employees.",
  values: [
    { label: "Empathy & Respect" },
    { label: "Honesty & Integrity" },
    { label: "Excellence" },
    { label: "Innovation" },
    { label: "Customer First" }
  ]
};

const tabs = [
  { label: "About", value: "about" },
  { label: "Openings", value: "openings" }
];

const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch (error) {
    return "N/A";
  }
};

const Spinner = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading Jobs...</p>
        </div>
      </div>
);

const Netsol = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const hrQuery = query(
          collection(db, "hrProfiles"),
          where("company", "==", "NETSOL")
        );
        const querySnapshot = await getDocs(hrQuery);
        const hrIDs = querySnapshot.docs.map((doc) => doc.id);

        const jobsCollection = collection(db, "jobOpenings");
        const jobsSnapshot = await getDocs(jobsCollection);
        const netSolJobs = [];
        jobsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === "active" && hrIDs.includes(data.postedBy)) {
            netSolJobs.push({ id: doc.id, ...data });
          }
        });
        setJobs(netSolJobs);
      } catch (error) {
        setJobs([]);
      }
      setLoading(false);
    };
    if (activeTab === "openings") {
      fetchJobs();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#f7fafc] px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Company Profile
            </h1>
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Verified
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Discover more about the company and available opportunities
          </p>
        </div>

        {/* Company Card */}
        <div className="flex flex-col sm:flex-row gap-6 bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200 hover:shadow-md transition duration-200">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm overflow-hidden">
              <img
                src={company.logo}
                alt={company.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="font-bold text-xl sm:text-2xl text-gray-900">{company.name}</h2>
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-blue-700 text-sm ml-1 font-medium">
                    {company.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {company.industry}
                </span>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {company.size}
                </span>
              </div>
            </div>
            
            <div className="mt-3 space-y-1">
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">Founded:</span> {company.founded}
              </p>
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-600">Headquarters:</span> {company.headQuarter}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-3 -mb-px font-medium text-sm sm:text-base transition-all ${
                activeTab === tab.value
                  ? "border-b-2 border-blue-600 text-blue-700 font-semibold"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "about" && (
          <div className="space-y-6">
            {/* Overview */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                <h3 className="font-bold text-lg text-gray-900">Overview</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {company.overview}
              </p>
            </section>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  <h3 className="font-bold text-lg text-gray-900">Mission</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {company.mission}
                </p>
              </section>
              <section className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                  <h3 className="font-bold text-lg text-gray-900">Vision</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {company.vision}
                </p>
              </section>
            </div>

            {/* Values */}
            <section className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
                <h3 className="font-bold text-lg text-gray-900">Core Values</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {company.values.map((val) => (
                  <div
                    key={val.label}
                    className="border rounded-lg px-4 py-3 bg-blue-50 border-blue-100 hover:bg-blue-100 transition flex items-center"
                  >
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-blue-800 text-sm">
                      {val.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "openings" && (
          <div>
            {loading ? (
              <Spinner />
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No openings available</h3>
                <p className="mt-1 text-sm text-gray-500">There are currently no job openings at this company.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">
                    {jobs.length} {jobs.length === 1 ? 'Opening' : 'Openings'} Available
                  </h3>
                  <div className="text-xs text-gray-500">
                    Sorted by: <span className="font-medium">Most Recent</span>
                  </div>
                </div>
                
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 px-5 py-4 hover:shadow-md transition group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-blue-700 text-base group-hover:text-blue-800">
                          {job.jobTitle}
                        </h4>
                        <div className="flex items-center mt-1">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <p className="text-gray-600 text-sm ml-1">{job.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                          {job.type || "Full Time"}
                        </span>
                      </div>
                    </div>
                    {job.jobDescription && (
                      <p className="text-gray-700 text-sm mt-3 line-clamp-2">
                        {job.jobDescription}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      {job.createdAt && (
                        <p className="text-gray-500 text-xs">
                          Posted: {formatDate(job.createdAt)}
                        </p>
                      )}
                      <Link to="/student-dashboard" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                        View details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Netsol;