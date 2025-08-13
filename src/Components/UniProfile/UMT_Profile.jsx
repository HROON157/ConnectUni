import UMTLogo from "../../assets/UMT-Logo.png";
import educationLogo from "../../assets/education.png"
import calenderLogo from "../../assets/calendar.png";
import { PiStudentLight } from "react-icons/pi";
import SearchLogo from "../../assets/search-interface-symbol.png";
import MissionLogo from "../../assets/mission.png";
import Location from "../../assets/location.png";
const UMT_Profile = () => {
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <img
                src={UMTLogo}
                alt="UMT Logo"
                className="w-32 h-32 rounded-2xl shadow-lg border-4 border-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                W4 Rank
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 font-['Public_Sans']">
                University of Management and Technology
              </h1>
              <div className="space-y-2 mb-4">
                <p className="text-blue-600 font-medium font-['Public_Sans'] flex items-center gap-1">
                  <img src={Location} alt="Location" className="w-4 h-4" />
                  C-II Block C 2 Phase 1 Johar Town, Lahore, 54770
                </p>
                 <div className="flex flex-wrap gap-4 text-sm">
                                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold flex items-center gap-2 ">
                                    <img
                                      src={educationLogo}
                                      alt="Education"
                                      className="w-4 h-4"
                                    />
                                    University
                                  </div>
                
                                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                    <PiStudentLight className="w-5 h-5" />
                                    2,500-3,500 Students
                                  </span>
                
                                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                    <img
                                      src={calenderLogo}
                                      alt="Founded"
                                      className="w-4 h-4 inline-block mr-1"
                                    />
                                    Founded 2003
                                  </span>
                                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">700+</div>
                  <div className="text-sm text-gray-600">Faculty</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">150+</div>
                  <div className="text-sm text-gray-600">Programs</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">165+</div>
                  <div className="text-sm text-gray-600">PhDs</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">13</div>
                  <div className="text-sm text-gray-600">Schools</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            <button className="px-6 py-4 border-b-3 border-blue-500 font-semibold text-blue-600 font-['Public_Sans']">
              About
            </button>
            <button className="px-6 py-4 text-gray-600 hover:text-blue-600 font-['Public_Sans'] transition-colors">
              Students
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid gap-8">
          {/* Overview Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Public_Sans'] flex items-center gap-1">
              <img src={SearchLogo} alt="Overview" className="w-4 h-4" />
              Overview
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed font-['Public_Sans']">
                UMT began as the Institute of Leadership and Management (ILM)
                Trust in 1990 and evolved into the Institute of Management and
                Technology (IMT) in 2002. It was granted full university status
                in June 2004, becoming UMT. It is recognized by the Higher
                Education Commission of Pakistan as a{" "}
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold">
                  W4‑category university (the highest rank)
                </span>{" "}
                UMT serves over 10,000 students from across Pakistan and
                globally, supported by 700+ faculty (165+ PhDs), and boasts 13
                schools and 4 institutes offering 150+ programs across various
                disciplines.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Public_Sans'] flex items-center gap-1">
              <img src={MissionLogo} alt="Mission" className="w-6 h-6" />
              Mission
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Learning
                </h3>
                <p className="text-gray-700 leading-relaxed font-['Public_Sans']">
                  Designed to inspire stakeholders and foster discovery of human
                  potential at the highest levels of efficiency, excellence,
                  equity, trusteeship, and sustainability.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Leading
                </h3>
                <p className="text-gray-700 leading-relaxed font-['Public_Sans']">
                  To become a leading learning institution that supports
                  integrated societal development via strategic partnerships,
                  leadership generation, knowledge creation, enduring values,
                  and sustainable practices and technologies.
                </p>
              </div>
            </div>
          </div>

          {/* Schools Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Public_Sans'] flex items-center gap-2">
               <img
                 src={educationLogo}
                 alt="Schools & Institutes"
                 className="w-6 h-6"
               />
               Schools & Institutes
             </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schools.map((school, index) => (
                <div
                  key={index}
                  className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-500 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-lg text-blue-600 font-['Public_Sans'] group-hover:text-blue-700">
                        {school.code}
                      </span>
                      <p className="text-sm text-gray-600 mt-1 font-['Public_Sans']">
                        {school.name}
                      </p>
                    </div>
                    <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                      <img src={educationLogo} alt="education logo" className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UMT_Profile;