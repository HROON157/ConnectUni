import React from "react";
import BnuImage from "../../assets/BNU-Logo.png";
import UmtLogo from "../../assets/UMT-Logo.png";
import { Link } from "react-router-dom";
import { HiOutlineAcademicCap, HiOutlineUsers, HiOutlineMapPin, HiOutlineGlobeAlt, HiOutlineArrowRight } from "react-icons/hi2";

const Uni_Home = () => {
  const universities = [
    {
      id: 1,
      name: "Beaconhouse National University",
      shortName: "BNU",
      logo: BnuImage,
      location: "Lahore, Pakistan",
      type: "Private University",
      students: "8,000+",
      programs: "50+",
      established: "2003",
      description: "A leading private university known for its innovative programs and modern campus facilities.",
      link: "/bnu-profile",
      color: "from-blue-600 to-purple-900",
     
    },
    {
      id: 2,
      name: "University of Management and Technology",
      shortName: "UMT",
      logo: UmtLogo,
      location: "Lahore, Pakistan",
      type: "Private University",
      students: "12,000+",
      programs: "60+",
      established: "1990",
      description: "Premier institution focused on management, technology, and engineering excellence.",
      link: "/umt-profile",
      color: "from-blue-600 to-purple-800",
      
    }
  ];

  const UniversityCard = ({ university }) => (
    <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200">
 
      <div className={`absolute inset-0 bg-gradient-to-br ${university.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
          <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            
            <div className="relative">
              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg ring-4 ring-white group-hover:ring-opacity-50 transition-all duration-300">
                <img 
                  src={university.logo} 
                  alt={`${university.shortName} Logo`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
                          <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${university.color} rounded-full flex items-center justify-center shadow-lg`}>
                <HiOutlineAcademicCap className="w-3 h-3 text-white" />
              </div>
            </div>

                       <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300" style={{fontFamily:'Public Sans'}}>
                {university.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <HiOutlineMapPin className="w-4 h-4" />
                <span>{university.location}</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {university.type}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Est. {university.established}
                </span>
              </div>
            </div>
          </div>
        </div>

         <p className="text-gray-600 text-sm mb-4 leading-relaxed" style={{fontFamily:'Public Sans'}}>
          {university.description}
        </p>

           <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <HiOutlineUsers className="w-5 h-5 mx-auto mb-1 text-blue-500" />
            <div className="text-lg font-bold text-gray-900">{university.students}</div>
            <div className="text-xs text-gray-500">Students</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <HiOutlineAcademicCap className="w-5 h-5 mx-auto mb-1 text-purple-500" />
            <div className="text-lg font-bold text-gray-900">{university.programs}</div>
            <div className="text-xs text-gray-500">Programs</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <HiOutlineGlobeAlt className="w-5 h-5 mx-auto mb-1 text-green-500" />
            <div className="text-lg font-bold text-gray-900">A+</div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
        </div>

           <Link to={university.link}>
          <button className={`w-full bg-gradient-to-r ${university.color} ${university.hoverColor} text-white cursor-pointer py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl group-hover:scale-105`} style={{fontFamily:'Public Sans'}}>
            <span>View Profile</span>
            <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </Link>
      </div>

      
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/10 to-yellow-600/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
     
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <HiOutlineAcademicCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2" style={{fontFamily:'Public Sans'}}>
                  Partner Universities
                </h1>
                <p className="text-sm sm:text-base text-gray-600" style={{fontFamily:'Public Sans'}}>
                  Discover leading institutions shaping the future of education
                </p>
              </div>
            </div>
            <Link
              to="/hr-dashboard"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base self-start lg:self-auto"
              style={{fontFamily:'Public Sans'}}
            >
              <HiOutlineArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2 rotate-180" />
              Back to Dashboard
            </Link>
          </div>

             <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 mb-6 sm:mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">2</div>
                <div className="text-xs sm:text-sm text-gray-600">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">20K+</div>
                <div className="text-xs sm:text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">110+</div>
                <div className="text-xs sm:text-sm text-gray-600">Programs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">95%</div>
                <div className="text-xs sm:text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900" style={{fontFamily:'Public Sans'}}>All Universities</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium rounded-full">
                {universities.length} institutions
              </span>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {universities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      </div>
    </div>
  );

};

export default Uni_Home;