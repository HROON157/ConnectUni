import BnuImage from "../../assets/bnu-Logo.png";

const BNU_Profile = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-start gap-6 mb-8">
        <img src={BnuImage} alt="BNU Logo" className="w-24 h-24 rounded-lg" />
        <div className="flex-1">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: "Public Sans" }}
          >
            Beaconhouse National University
          </h1>
          <p
            className="text-[#4F7096] mb-1"
            style={{ fontFamily: "Public Sans" }}
          >
            Tarogil, off Raiwind Road, Lahore
          </p>
          <p
            className="text-[#4F7096] text-sm"
            style={{ fontFamily: "Public Sans" }}
          >
            University | 2500-3500 Students | Founded 2010
          </p>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          <button
            className="pb-3 border-b-2 border-black font-semibold text-black cursor-pointer"
            style={{ fontFamily: "Public Sans" }}
          >
            About
          </button>
          <button
            className="pb-3 text-[#4F7096] hover:text-blue-800 cursor-pointer"
            style={{ fontFamily: "Public Sans" }}
          >
            Students
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2
          className="text-xl font-bold mb-4"
          style={{ fontFamily: "Public Sans" }}
        >
          Overview
        </h2>
        <p
          className="text-gray-700 leading-relaxed"
          style={{ fontFamily: "Public Sans" }}
        >
          BNU was established in 2003 and received its charter from the
          Government of Punjab in 2005. It is Pakistan’s first not‑for‑profit
          liberal arts university, committed to inclusivity, academic freedom,
          and interdisciplinary education. The university offers programs in
          Visual Arts & Design, Architecture, Media & Communication, Liberal
          Arts & Social Sciences, Economics, Business, Computer Science,
          Education, Psychology, and Hospitality Management. BNU has disbursed
          over 1 billion rupees in merit‑based scholarships—serving nearly 40%
          of its student body—ensuring that financial constraints don’t block
          access to higher education.
        </p>
      </div>

      <div className="mb-8">
        <h2
          className="text-xl font-bold mb-4"
          style={{ fontFamily: "Public Sans" }}
        >
          Mission
        </h2>
        <p
          className="text-gray-700 leading-relaxed"
          style={{ fontFamily: "Public Sans" }}
        >
          To be globally recognized for academic excellence, offering a
          progressive, interdisciplinary liberal arts education, and fostering
          research that promotes responsible citizenry, cultural and
          socioeconomic change.
        </p>
      </div>

      <div>
        <h2
          className="text-xl font-bold mb-6"
          style={{ fontFamily: "Public Sans" }}
        >
          Schools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <span
                className="font-semibold"
                style={{ fontFamily: "Public Sans" }}
              >
                SCIT
              </span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <span
                className="font-semibold"
                style={{ fontFamily: "Public Sans" }}
              >
                SE
              </span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <span
                className="font-semibold"
                style={{ fontFamily: "Public Sans" }}
              >
                MDSVAD
              </span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <span
                className="font-semibold"
                style={{ fontFamily: "Public Sans" }}
              >
                RHSA
              </span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <span
                className="font-semibold"
                style={{ fontFamily: "Public Sans" }}
              >
                IP
              </span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <span
                className="font-semibold"
                style={{ fontFamily: "Public Sans" }}
              >
                SM-SLASS
              </span>
            </div>
          </div>
               <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <span
                className="font-semibold"
                style={{ fontFamily: "Public Sans" }}
              >
                SMS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BNU_Profile;
