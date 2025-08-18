import React from "react";
import { useNavigate } from "react-router-dom";

const companies = [
  {
    id: "netsol",
    name: "Netsol",
    type: "Software House",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxCM1HPn76y7Wcb-ellowpA0Iako5C7Npo8w&s"
  },
  {
    id: "systems",
    name: "Systems Ltd",
    type: "Software House",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCxe9z13mFK8gddPVIvpGeUNOFijVUSPLvkQ&s"
  }
];

const Companies = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7fafc] px-2 xs:px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-800 text-left font-['Public_Sans']">
          Companies
        </h2>
        <div className="border-b border-blue-100 mb-6">
          <span className="text-blue-700 font-semibold text-base pb-2 border-b-2 border-blue-600 inline-block">
            All
          </span>
        </div>
        <div className="space-y-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-4 hover:shadow-md transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
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
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow transition-all duration-150 flex items-center gap-2"
              >
                Explore
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
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