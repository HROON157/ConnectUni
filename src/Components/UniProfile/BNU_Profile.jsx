import BnuImage from "../../assets/BNU-Logo.png";
import educationLogo from "../../assets/education.png";
import { PiStudentLight } from "react-icons/pi";
import calderLogo from "../../assets/calendar.png";
import SearchLogo from "../../assets/search-interface-symbol.png";
import MissionLogo from "../../assets/mission.png";
import EducationLogo from "../../assets/mortarboard.png";
import Location from "../../assets/location.png";
const BNU_Profile = () => {
  const schools = [
    { code: "SCIT", name: "School of Computer Information Technology" },
    { code: "SE", name: "School of Education" },
    { code: "MDSVAD", name: "Mariam Dawood School of Visual Arts & Design" },
    { code: "RHSA", name: "Razia Hassan School of Architecture" },
    { code: "IP", name: "Institute of Psychology" },
    {
      code: "SM-SLASS",
      name: "Seeta Majeed School of Liberal Arts & Social Sciences",
    },
    { code: "SMS", name: "School of Management Sciences" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <img
                src={BnuImage}
                alt="BNU Logo"
                className="w-32 h-32 rounded-2xl shadow-lg border-4 border-white"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                Liberal Arts
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3 font-['Public_Sans']">
                Beaconhouse National University
              </h1>
              <div className="space-y-2 mb-4">
                <p className="text-blue-600 font-medium font-['Public_Sans'] flex items-center gap-1">
                  <img src={Location} alt="Location" className="w-4 h-4" />
                  Tarogil, off Raiwind Road, Lahore
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
                      src={calderLogo}
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
                  <div className="text-2xl font-bold text-blue-600">40%</div>
                  <div className="text-sm text-gray-600">Scholarships</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1B+</div>
                  <div className="text-sm text-gray-600">Rupees Aid</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">7</div>
                  <div className="text-sm text-gray-600">Schools</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">2005</div>
                  <div className="text-sm text-gray-600">Chartered</div>
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
                BNU was established in 2003 and received its charter from the
                Government of Punjab in 2005. It is{" "}
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                  Pakistan's first not‑for‑profit liberal arts university
                </span>
                , committed to inclusivity, academic freedom, and
                interdisciplinary education. The university offers programs in
                Visual Arts & Design, Architecture, Media & Communication,
                Liberal Arts & Social Sciences, Economics, Business, Computer
                Science, Education, Psychology, and Hospitality Management. BNU
                has disbursed over{" "}
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                  1 billion rupees in merit‑based scholarships
                </span>
                —serving nearly 40% of its student body—ensuring that financial
                constraints don't block access to higher education.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Public_Sans'] flex items-center gap-1">
              <img src={MissionLogo} alt="Mission" className="w-6 h-6" />
              Mission
            </h2>
            <div className="border-l-4 border-blue-500 pl-6 bg-blue-50 p-6 rounded-r-lg">
              <p className="text-gray-700 leading-relaxed font-['Public_Sans'] text-lg">
                To be globally recognized for academic excellence, offering a
                progressive, interdisciplinary liberal arts education, and
                fostering research that promotes responsible citizenry, cultural
                and socioeconomic change.
              </p>
            </div>
          </div>

          {/* Schools Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-['Public_Sans'] flex items-center gap-2">
              <img
                src={EducationLogo}
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
                      <img src={EducationLogo} alt="education logo" className="w-8 h-8" />
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

export default BNU_Profile;
