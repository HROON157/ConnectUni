import React, { useState, useEffect } from "react";
import UMTLogo from "../../assets/UMT-Logo.png";
import educationLogo from "../../assets/education.png";
import calenderLogo from "../../assets/calendar.png";
import { PiStudentLight } from "react-icons/pi";
import SearchLogo from "../../assets/search-interface-symbol.png";
import MissionLogo from "../../assets/mission.png";
import Location from "../../assets/location.png";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase/db";

const UMT_Profile = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [umtStudents, setUmtStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);


  const fetchUMTStudents = async () => {
    setLoading(true);
    try {

      const studentsQuery = query(
        collection(db, "students"),
        where("university", "==", "UMT")
      );
      const studentsSnapshot = await getDocs(studentsQuery);
      
      const studentIds = [];
      studentsSnapshot.forEach((doc) => {
        studentIds.push(doc.id);
      });


      const profiles = [];
      if (studentIds.length > 0) {
        const profilesCollection = collection(db, "studentProfiles");
        const profilesSnapshot = await getDocs(profilesCollection);
        
        profilesSnapshot.forEach((doc) => {
          const profileData = doc.data();
  
          if (studentIds.includes(doc.id) || profileData.university?.toLowerCase().includes("umt")) {
            profiles.push({
              id: doc.id,
              ...profileData
            });
          }
        });
      }

      setUmtStudents(profiles);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (activeTab === "students") {
      fetchUMTStudents();
    }
  }, [activeTab]);

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const schools = [
    { code: "SST", name: "School of Science & Technology" },
    { code: "HSM", name: "Hailey School of Management" },
    { code: "SSS&H", name: "School of Social Sciences & Humanities" },
    { code: "SPA", name: "School of Public Administration" },
    { code: "SLP", name: "School of Law & Policy" },
    { code: "STD", name: "School of Textile & Design" },
    { code: "SCA", name: "School of Creative Arts" },
    { code: "SEN", name: "School of Engineering" },
    { code: "SHS", name: "School of Health Sciences" },
    { code: "SAP", name: "School of Applied Psychology" },
    { code: "SSC", name: "School of Sports & Communication" },
    { code: "SFAS", name: "School of Food & Agricultural Sciences" },
    { code: "IAS", name: "Institute of Actuarial Sciences" },
    { code: "ICCS", name: "Institute of Computer & Communication Sciences" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-2 xs:py-4 sm:py-8 px-1 xs:px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg p-3 xs:p-4 sm:p-8 mb-3 xs:mb-4 sm:mb-8">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-3 xs:gap-4 sm:gap-6">
            <div className="relative flex-shrink-0">
              <img
                src={UMTLogo}
                alt="UMT Logo"
                className="w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 rounded-lg xs:rounded-xl sm:rounded-2xl shadow-lg border-2 xs:border-4 border-white"
              />
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-green-500 text-white text-xs px-1 xs:px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-semibold">
                W4 Rank
              </div>
            </div>

            <div className="flex-1 w-full">
              <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-4xl font-bold text-gray-900 mb-2 xs:mb-3 font-['Public_Sans'] leading-tight">
                University of Management and Technology
              </h1>
              <div className="space-y-2 mb-3 xs:mb-4">
                <p className="text-blue-600 font-medium font-['Public_Sans'] flex items-center justify-center sm:justify-start gap-1 text-xs xs:text-sm sm:text-base">
                  <img src={Location} alt="Location" className="w-3 h-3 xs:w-4 xs:h-4" />
                  <span className="text-center sm:text-left">C-II Block C 2 Phase 1 Johar Town, Lahore</span>
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-1 xs:gap-2 sm:gap-4 text-xs">
                  <div className="bg-blue-100 text-blue-800 px-1.5 xs:px-2 py-1 sm:px-3 sm:py-1 rounded-full font-semibold flex items-center gap-1">
                    <img
                      src={educationLogo}
                      alt="Education"
                      className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4"
                    />
                    University
                  </div>

                  <span className="bg-green-100 text-green-800 px-1.5 xs:px-2 py-1 sm:px-3 sm:py-1 rounded-full font-semibold flex items-center gap-1">
                    <PiStudentLight className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">10k+</span>
                    <span className="xs:hidden">10k</span>
                    <span>Students</span>
                  </span>

                  <span className="bg-purple-100 text-purple-800 px-1.5 xs:px-2 py-1 sm:px-3 sm:py-1 rounded-full font-semibold flex items-center gap-1">
                    <img
                      src={calenderLogo}
                      alt="Founded"
                      className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4 inline-block"
                    />
                    <span className="hidden xs:inline">Founded</span>
                    2004
                  </span>
                </div>
              </div>

                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 xs:gap-2 sm:gap-4 mt-3 xs:mt-4 sm:mt-6">
                <div className="text-center p-1.5 xs:p-2 sm:p-3 bg-gray-50 rounded-md xs:rounded-lg">
                  <div className="text-base xs:text-lg sm:text-2xl font-bold text-blue-600">700+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Faculty</div>
                </div>
                <div className="text-center p-1.5 xs:p-2 sm:p-3 bg-gray-50 rounded-md xs:rounded-lg">
                  <div className="text-base xs:text-lg sm:text-2xl font-bold text-green-600">150+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Programs</div>
                </div>
                <div className="text-center p-1.5 xs:p-2 sm:p-3 bg-gray-50 rounded-md xs:rounded-lg">
                  <div className="text-base xs:text-lg sm:text-2xl font-bold text-purple-600">165+</div>
                  <div className="text-xs sm:text-sm text-gray-600">PhDs</div>
                </div>
                <div className="text-center p-1.5 xs:p-2 sm:p-3 bg-gray-50 rounded-md xs:rounded-lg">
                  <div className="text-base xs:text-lg sm:text-2xl font-bold text-orange-600">13</div>
                  <div className="text-xs sm:text-sm text-gray-600">Schools</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-lg xs:rounded-xl shadow-lg mb-3 xs:mb-4 sm:mb-8">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab("about")}
              className={`flex-1 px-3 xs:px-4 py-2.5 xs:py-3 sm:px-6 sm:py-4 font-semibold font-['Public_Sans'] transition-colors text-sm sm:text-base ${
                activeTab === "about" 
                  ? "border-b-2 sm:border-b-3 border-blue-500 text-blue-600" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              About
            </button>
            <button 
              onClick={() => setActiveTab("students")}
              className={`flex-1 px-3 xs:px-4 py-2.5 xs:py-3 sm:px-6 sm:py-4 font-semibold font-['Public_Sans'] transition-colors text-sm sm:text-base ${
                activeTab === "students" 
                  ? "border-b-2 sm:border-b-3 border-blue-500 text-blue-600" 
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Students
            </button>
          </div>
        </div>

        
        <div className="space-y-3 xs:space-y-4 sm:space-y-8">
          {activeTab === "about" && (
            <>
              
              <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-8">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-3 xs:mb-4 sm:mb-6 font-['Public_Sans'] flex items-center gap-1 xs:gap-2">
                  <img src={SearchLogo} alt="Overview" className="w-4 h-4 xs:w-4 xs:h-4" />
                  Overview
                </h2>
                <div className="prose prose-sm sm:prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed font-['Public_Sans'] text-xs xs:text-sm sm:text-base">
                    UMT began as the Institute of Leadership and Management (ILM)
                    Trust in 1990 and evolved into the Institute of Management and
                    Technology (IMT) in 2002. It was granted full university status
                    in June 2004, becoming UMT. It is recognized by the Higher
                    Education Commission of Pakistan as a{" "}
                    <span className="bg-yellow-100 text-yellow-800 px-1 xs:px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-semibold text-xs sm:text-sm">
                      W4‑category university (the highest rank)
                    </span>{" "}
                    UMT serves over 10,000 students from across Pakistan and
                    globally, supported by 700+ faculty (165+ PhDs), and boasts 13
                    schools and 4 institutes offering 150+ programs across various
                    disciplines.
                  </p>
                </div>
              </div>

                    <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-8">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-3 xs:mb-4 sm:mb-6 font-['Public_Sans'] flex items-center gap-1 xs:gap-2">
                  <img src={MissionLogo} alt="Mission" className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                  Mission
                </h2>
                <div className="space-y-3 xs:space-y-4">
                  <div className="border-l-4 border-blue-500 pl-2 xs:pl-3 sm:pl-6 bg-blue-50 p-2 xs:p-3 sm:p-4 rounded-r-lg">
                    <h3 className="font-bold text-sm xs:text-base sm:text-lg text-gray-900 mb-1 xs:mb-2">
                      Learning
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-['Public_Sans'] text-xs xs:text-sm sm:text-base">
                      Designed to inspire stakeholders and foster discovery of human
                      potential at the highest levels of efficiency, excellence,
                      equity, trusteeship, and sustainability.
                    </p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-2 xs:pl-3 sm:pl-6 bg-green-50 p-2 xs:p-3 sm:p-4 rounded-r-lg">
                    <h3 className="font-bold text-sm xs:text-base sm:text-lg text-gray-900 mb-1 xs:mb-2">
                      Leading
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-['Public_Sans'] text-xs xs:text-sm sm:text-base">
                      To become a leading learning institution that supports
                      integrated societal development via strategic partnerships,
                      leadership generation, knowledge creation, enduring values,
                      and sustainable practices and technologies.
                    </p>
                  </div>
                </div>
              </div>

                    <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-8">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-3 xs:mb-4 sm:mb-6 font-['Public_Sans'] flex items-center gap-1 xs:gap-2">
                  <img
                    src={educationLogo}
                    alt="Schools & Institutes"
                    className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6"
                  />
                  Schools & Institutes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4">
                  {schools.map((school, index) => (
                    <div
                      key={index}
                      className="group border border-gray-200 rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 hover:shadow-lg hover:border-blue-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white"
                    >
                      <div className="flex items-start justify-between gap-1 xs:gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-sm xs:text-base sm:text-lg text-blue-600 font-['Public_Sans'] group-hover:text-blue-700 block">
                            {school.code}
                          </span>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-['Public_Sans'] leading-tight">
                            {school.name}
                          </p>
                        </div>
                        <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <img src={educationLogo} alt="education logo" className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "students" && (
            <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-8">
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-3 xs:mb-4 sm:mb-6 font-['Public_Sans'] flex items-center gap-1 xs:gap-2">
                <PiStudentLight className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                UMT Students
              </h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-6 xs:py-8 sm:py-12">
                  <div className="animate-spin rounded-full h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 xs:ml-3 text-gray-600 text-xs xs:text-sm sm:text-base">Loading student profiles...</span>
                </div>
              ) : umtStudents.length > 0 ? (
                <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                  {umtStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-2 xs:p-3 sm:p-4 border border-gray-200 rounded-lg xs:rounded-xl hover:shadow-md hover:border-blue-300 transition-all duration-200 bg-white"
                    >
                      
                      <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 flex-1 min-w-0">
                        
                        <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-gray-200 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                          {student.profilePic ? (
                            <img
                              src={student.profilePic}
                              alt={student.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-white font-bold text-xs sm:text-sm">
                              {student.name
                                ?.split(" ")
                                .map(n => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2) || "ST"}
                            </div>
                          )}
                        </div>
                        
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm xs:text-base sm:text-lg font-['Public_Sans'] truncate">
                            {student.name || "Anonymous Student"}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm truncate">
                            {student.degreeProgram || "Degree Program"}
                          </p>
                        </div>
                      </div>
                      
                     
                      <button
                        onClick={() => handleViewProfile(student)}
                        className="px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md xs:rounded-lg  transition-colors duration-200 font-medium text-xs sm:text-sm font-['Public_Sans'] flex-shrink-0 ml-2 xs:ml-3"
                      >
                        <span className="">View Profile</span>
                        
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 xs:py-8 sm:py-12">
                  <PiStudentLight className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 mx-auto text-gray-300 mb-3 xs:mb-4" />
                  <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-500 mb-2">No Student Profiles Found</h3>
                  <p className="text-gray-400 text-xs xs:text-sm sm:text-base">
                    No UMT students have completed their profiles yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

   
        {showModal && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1 xs:p-2 sm:p-4">
            <div className="bg-white rounded-lg xs:rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[98vh] xs:max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
          
              <div className="sticky top-0 bg-white mt-5 border-b border-gray-200 p-3 xs:p-4 sm:p-6 rounded-t-lg xs:rounded-t-xl sm:rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-['Public_Sans']">
                    Student Profile
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1.5 xs:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    type="button"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
 
              <div className="p-3 xs:p-4 sm:p-6">
                <div className="text-center mb-3 xs:mb-4 sm:mb-6">
                 
                  <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-2 xs:mb-3 sm:mb-4 border-4 border-gray-100 shadow-lg overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    {selectedStudent.profilePic ? (
                      <img
                        src={selectedStudent.profilePic}
                        alt={selectedStudent.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white font-bold text-sm xs:text-lg sm:text-2xl">
                        {selectedStudent.name
                          ?.split(" ")
                          .map(n => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "ST"}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-1 xs:mb-2 font-['Public_Sans']">
                    {selectedStudent.name || "Anonymous Student"}
                  </h3>
                  <p className="text-black-600 font-medium mb-1 text-xs xs:text-sm sm:text-base">
                    {selectedStudent.title || "Student"}
                  </p>
                  <p className="text-gray-600 text-xs xs:text-sm sm:text-base">
                    {selectedStudent.degreeProgram || "Degree Program"}
                  </p>
                </div>

          
                {selectedStudent.bio && (
                  <div className="mb-3 xs:mb-4 sm:mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 font-['Public_Sans'] text-xs xs:text-sm sm:text-base">About</h4>
                    <p className="text-gray-700 leading-relaxed text-xs xs:text-sm sm:text-base">{selectedStudent.bio}</p>
                  </div>
                )}

          
                <div className="border-t border-gray-200 pt-3 xs:pt-4 sm:pt-6">
                  <h4 className="font-semibold text-gray-900 mb-2 xs:mb-3 font-['Public_Sans'] text-xs xs:text-sm sm:text-base">Contact & Links</h4>
                  <div className="space-y-2 xs:space-y-3">
                    {selectedStudent.email && (
                      <div className="flex items-center space-x-2 xs:space-x-3">
                        <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700 text-xs xs:text-sm sm:text-base break-all">{selectedStudent.email}</span>
                      </div>
                    )}
                    {selectedStudent.linkedin && (
                      <div className="flex items-center space-x-2 xs:space-x-3">
                        <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <a
                          href={selectedStudent.linkedin.startsWith("http") ? selectedStudent.linkedin : `https://${selectedStudent.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors text-xs xs:text-sm sm:text-base break-all"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {selectedStudent.github && (
                      <div className="flex items-center space-x-2 xs:space-x-3">
                        <svg className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-800 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <a
                          href={selectedStudent.github.startsWith("http") ? selectedStudent.github : `https://${selectedStudent.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-800 hover:text-gray-600 transition-colors text-xs xs:text-sm sm:text-base break-all"
                        >
                          GitHub Profile
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UMT_Profile;