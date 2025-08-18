import React, { useState } from "react";

const company = {
  name: "Systems Ltd",
  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxCM1HPn76y7Wcb-ellowpA0Iako5C7Npo8w&s",
  location: "Lahore, Punjab, Pakistan",
  headQuarter : "IT Village (Software Technology Park), Lahore Ring Road, Ghazi Road",
  industry: "Technology",
  size: "1,001–5,000 employees globally",
  founded: "1996",
  overview:
    "NETSOL Technologies is a global provider of enterprise software and IT services, specializing in the asset finance and leasing sectors. The company empowers automotive OEMs, financial institutions, and leasing organizations worldwide with its flagship NETSOL Financial Suite (NFS), along with AI-powered digital platforms and cloud services.",
  mission:
    "To be the premium solutions vendor to global finance and leasing businesses. We will leverage our leading market position in APAC, and our European and US presence, to continue to drive strong revenues from our current generation of finance and leasing solutions, and successfully grow our next generation platform. We will leverage our world class software development capabilities to develop new intellectual property in business segments where we can add value…",
  vision:
    "To become the leading and world class provider of IT solutions and services in each market of operations, by leveraging our global positioning and creating strong growth potential, resulting in increasing shareholders’ value and providing a conducive environment for our employees.",
  values: [
    { label: "Empathy & Respect" },
    { label: "Honesty & Integrity" },
    { label: "Excellence" },
    { label: "Innovation" },
    { label: "Customer First" }
  ]
};

const tabs = [
  { label: "About", value: "about" },
  { label: "Openings", value: "openings" }
];

const Netsol = () => {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Company Profile</h1>
          <div className="flex space-x-4">
            <button className="text-gray-700 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button className="text-gray-700 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
          </div>
        </div>

        {/* Company Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              <img
                src={company.logo}
                alt={company.name}
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-2xl text-gray-900">{company.name}</div>
            <div className="text-blue-600 text-sm mt-1 font-medium">
              {company.location}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              {company.industry} &nbsp;|&nbsp; {company.size} &nbsp;|&nbsp; Founded {company.founded}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-3 -mb-px font-medium text-sm transition border-b-2 ${
                activeTab === tab.value
                  ? "border-black text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "about" && (
          <div className="space-y-8">
            {/* Overview */}
            <section className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Overview</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {company.overview}
              </p>
            </section>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-6">
              <section className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-3">Mission</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {company.mission}
                </p>
              </section>
              <section className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-3">Vision</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {company.vision}
                </p>
              </section>
            </div>

            {/* Company Details */}
            <section className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Company Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-500">Headquarters</div>
                  <div className="text-gray-900 mt-1">{company.headQuarter}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-500">Founded</div>
                  <div className="text-gray-900 mt-1">{company.founded}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-500">Company Size</div>
                  <div className="text-gray-900 mt-1">{company.size}</div>
                </div>
              </div>
            </section>

            {/* Values */}
            <section className="bg-white p-6 rounded-lg border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Core Values</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {company.values.map((val) => (
                  <div
                    key={val.label}
                    className="border rounded-lg px-4 py-3 bg-white border-gray-100 hover:border-gray-200 transition"
                  >
                    <span className="font-medium text-gray-800 text-sm">{val.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "openings" && (
          <div className="bg-white p-8 rounded-lg border border-gray-100 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-sm mt-4">No job openings available at the moment</p>
            <p className="text-gray-400 text-xs mt-1">Check back later for new opportunities</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Netsol;