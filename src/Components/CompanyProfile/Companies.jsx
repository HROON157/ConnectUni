import React from "react";
import { Link, useNavigate } from "react-router-dom";

const companies = [
  {
    id: "netsol",
    name: "Netsol",
    type: "Software House",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxCM1HPn76y7Wcb-ellowpA0Iako5C7Npo8w&s",
  },
  {
    id: "systems",
    name: "Systems Ltd",
    type: "Software House",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCxe9z13mFK8gddPVIvpGeUNOFijVUSPLvkQ&s",
  },
];

const Companies = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7fafc] px-3 sm:px-6 py-6">
      <div className="max-w-3xl mx-auto">
        
        
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-800 bg-clip-text text-transparent">
            Companies
          </h1>

          <Link
            to="/student-dashboard"
            className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md text-sm sm:text-base"
            style={{ fontFamily: "Public Sans" }}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 mr-2 rotate-180"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        
        <div className="border-b border-blue-100 mb-6">
          <span className="text-blue-700 font-semibold text-base pb-2 border-b-2 border-blue-600 inline-block">
            All
          </span>
        </div>

        
        <div className="space-y-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-4 hover:shadow-md transition"
            >
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg hidden">
                    {company.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-base sm:text-lg font-['Public_Sans'] group-hover:text-blue-700 transition">
                    {company.name}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-600 font-medium mt-0.5">
                    {company.type}
                  </div>
                </div>
              </div>

              
              <button
                onClick={() => navigate(`/company/${company.id}`)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 cursor-pointer text-white px-6 py-2 rounded-lg font-semibold text-sm shadow transition-all duration-150 flex items-center gap-2 self-start sm:self-auto"
              >
                Explore
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm font-['Public_Sans']">
            Select a company to view detailed information
          </p>
        </div>
      </div>
    </div>
  );
};

export default Companies;
