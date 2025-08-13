import { useState } from "react";
import { addJobOpening } from "../../Firebase/auth";
import { auth } from "../../Firebase/db";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { HiOutlineBriefcase, HiOutlineDocumentText, HiOutlineMapPin, HiOutlineCurrencyDollar, HiOutlineClipboardDocumentList, HiOutlineSparkles, HiOutlineInformationCircle } from 'react-icons/hi2';
import JobLogo from "../../assets/briefcase.png"
import CalenderLogo from "../../assets/calendar.png";
import TargetLogo from "../../assets/mission.png"
import Location from "../../assets/location.png";
import idea from "../../assets/idea.png";
import updatedLogo from "../../assets/recycle.png";
import justiceLog from "../../assets/justice.png"
import clearDescriptionLogo from "../../assets/pen.png"
import TransportCompensationLogo from "../../assets/profit.png"
import educationLogo from "../../assets/education.png";
import briefLogo from "../../assets/briefcase.png";
import timePastLogo from "../../assets/time-past.png"
const New_Openings = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    type: "",
    compensation: "",
    payRange: "",
    location: "",
    requirements: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }
    
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = "Job description is required";
    }
    
    if (!formData.type) {
      newErrors.type = "Job type is required";
    }
    
    if (!formData.compensation) {
      newErrors.compensation = "Compensation type is required";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (!formData.requirements.trim()) {
      newErrors.requirements = "Requirements are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = auth.currentUser;
    console.log("🔍 Authentication Debug:");
    console.log("Current user:", currentUser);
    console.log("Is authenticated:", !!currentUser);
    console.log("User UID:", currentUser?.uid);
    console.log("User email:", currentUser?.email);
    
    if (!currentUser) {
      toast.error("❌ Please log in to create job openings.");
      return;
    }
    
    if (!validateForm()) {
      toast.error("❌ Please fill in all required fields.");
      return;
    }

    setLoading(true);
    
    try {
      const jobData = {
        ...formData,
        status: 'active',
        postedBy: currentUser.uid,
        postedByEmail: currentUser.email,
        applicationsCount: 0
      };
      
      console.log("📝 Sending job data:", jobData);
      
      const jobId = await addJobOpening(jobData);
      console.log("✅ Job Opening created with ID:", jobId);

      toast.success("🎉 Job opening created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setFormData({
        jobTitle: "",
        jobDescription: "",
        type: "",
        compensation: "",
        payRange: "",
        location: "",
        requirements: "",
      });
      
      setTimeout(() => {
        navigate('/hr-dashboard');
      }, 2000);
      
    } catch (error) {
      console.error("❌ Error creating job opening:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      if (error.code === 'permission-denied') {
        toast.error("❌ Permission denied. Please check your account permissions.", {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        toast.error("❌ Failed to create job opening. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <img src={JobLogo} alt="Job Logo" className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Public Sans" }}>
                Create New Job Opening
              </h1>
              <p className="text-gray-600" style={{ fontFamily: "Public Sans" }}>
                Ready to find amazing talent? Let's create your next job opportunity!
              </p>
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Step 1 of 1</span>
              <span className="text-blue-600 font-semibold">Job Details</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full w-full"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center" style={{ fontFamily: "Public Sans" }}>
                <HiOutlineDocumentText className="w-6 h-6 mr-2 text-black-500" />
                Job Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "Public Sans" }}>
                    <HiOutlineBriefcase className="w-4 h-4 inline mr-1" />
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Software Engineer, Marketing Intern"
                    className={`w-full p-4 border rounded-xl transition-all duration-200  focus:ring-purple-500 focus:border-transparent ${
                      errors.jobTitle ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ fontFamily: "Public Sans" }}
                  />
                  {errors.jobTitle && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <HiOutlineInformationCircle className="w-4 h-4 mr-1" />
                      {errors.jobTitle}
                    </p>
                  )}
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "Public Sans" }}>
                    <HiOutlineDocumentText className="w-4 h-4 inline mr-1" />
                    Job Description *
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    rows="4"
                    className={`w-full p-4 border rounded-xl transition-all duration-200  focus:ring-purple-500 focus:border-transparent resize-none ${
                      errors.jobDescription ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ fontFamily: "Public Sans" }}
                  />
                  {errors.jobDescription && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <HiOutlineInformationCircle className="w-4 h-4 mr-1" />
                      {errors.jobDescription}
                    </p>
                  )}
                </div>

                {/* Type and Compensation Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "Public Sans" }}>
                      Job Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className={`w-full p-4 border rounded-xl transition-all duration-200  focus:ring-purple-500 focus:border-transparent ${
                        errors.type ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ fontFamily: "Public Sans" }}
                    >
                      <option value="">Select job type</option>
                      <option value="internship">🎓 Internship</option>
                      <option value="job">💼 Full-time Job</option>
                      <option value="part-time">⏰ Part-time</option>
                      <option value="other">🔧 Other</option>
                    </select>
                    {errors.type && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <HiOutlineInformationCircle className="w-4 h-4 mr-1" />
                        {errors.type}
                      </p>
                    )}
                  </div>

                  {/* Compensation */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "Public Sans" }}>
                      <HiOutlineCurrencyDollar className="w-4 h-4 inline mr-1" />
                      Compensation *
                    </label>
                    <select
                      name="compensation"
                      value={formData.compensation}
                      onChange={handleInputChange}
                      className={`w-full p-4 border rounded-xl transition-all duration-200  focus:ring-purple-500 focus:border-transparent ${
                        errors.compensation ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ fontFamily: "Public Sans" }}
                    >
                      <option value="">Select compensation</option>
                      <option value="paid">💰 Paid</option>
                      <option value="unpaid">🤝 Unpaid</option>
                      <option value="stipend">💵 Stipend</option>
                    </select>
                    {errors.compensation && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <HiOutlineInformationCircle className="w-4 h-4 mr-1" />
                        {errors.compensation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Pay Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "Public Sans" }}>
                    <HiOutlineCurrencyDollar className="w-4 h-4 inline mr-1" />
                    Pay Range <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="payRange"
                    value={formData.payRange}
                    onChange={handleInputChange}
                    placeholder="e.g. $3000-5000/month, Rs. 50,000-80,000"
                    className="w-full p-4 border border-gray-300 rounded-xl transition-all duration-200  focus:ring-purple-500 focus:border-transparent hover:border-gray-400"
                    style={{ fontFamily: "Public Sans" }}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "Public Sans" }}>
                    <HiOutlineMapPin className="w-4 h-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Lahore, Pakistan or Remote"
                    className={`w-full p-4 border rounded-xl transition-all duration-200  focus:ring-purple-500 focus:border-transparent ${
                      errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ fontFamily: "Public Sans" }}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <HiOutlineInformationCircle className="w-4 h-4 mr-1" />
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "Public Sans" }}>
                    <HiOutlineClipboardDocumentList className="w-4 h-4 inline mr-1" />
                    Requirements *
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="List the essential qualifications, skills, and experience needed for this role..."
                    rows="4"
                    className={`w-full p-4 border rounded-xl transition-all duration-200  focus:ring-purple-500 focus:border-transparent resize-none ${
                      errors.requirements ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ fontFamily: "Public Sans" }}
                  />
                  {errors.requirements && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <HiOutlineInformationCircle className="w-4 h-4 mr-1" />
                      {errors.requirements}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 transform hover:scale-105 active:scale-95 cursor-pointer'
                    } text-white`}
                    style={{ fontFamily: "Public Sans" }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Creating Opening...</span>
                      </>
                    ) : (
                      <>
                        
                        <span>Create Job Opening</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center" style={{ fontFamily: "Public Sans" }}>
                <HiOutlineInformationCircle className="w-5 h-5 mr-2 text-black-500" />
                Posting Guidelines
              </h3>
              
              <div className="space-y-4 text-sm text-gray-700">
                {[
                  {
                                    icon: <img src={clearDescriptionLogo} alt="Clear Description" className="w-5 h-5 mt-1" />,
                    title: "Clear & Descriptive",
                    desc: "Write clear job titles and detailed descriptions"
                  },
                  {
                    icon: <img src={TargetLogo} alt="Target" className="w-5 h-5 mt-1" />,
                    title: "Specify Job Type",
                    desc: "Choose the correct category for your position"
                  },
                  {
                    icon: <img src={TransportCompensationLogo} alt="Transportation Logo" className="w-5 h-5 mt-1" />,
                    title: "Transparent Compensation",
                    desc: "Be clear about payment and benefits"
                  },
                  {
                    icon: <img src={Location} alt="Location" className="w-5 h-5 mt-1" />,
                    title: "Location Details",
                    desc: "Include specific location or remote options"
                  },
                  {
                    icon: <HiOutlineDocumentText className="w-5 h-5 mt-1" />,
                    title: "Essential Requirements",
                    desc: "List only necessary qualifications"
                  },
                  {
                    icon: <img src={CalenderLogo} alt="Calendar" className="w-5 h-5 mt-1" />,
                    title: "Application Process",
                    desc: "Provide clear application instructions"
                  },
                  {
                    icon: <img src={justiceLog} alt="Justice" className="w-5 h-5 mt-1" />,
                    title: "Equal Opportunity",
                    desc: "Follow non-discrimination guidelines"
                  },
                  {
                    icon: <img src={updatedLogo} className="w-5 h-5 mt-1.5"/>,
                    title: "Keep Updated",
                    desc: "Remove postings when position is filled"
                  }
                ].map((guideline, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-lg flex-shrink-0">{guideline.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900" style={{ fontFamily: "Public Sans" }}>
                        {guideline.title}
                      </p>
                      <p className="text-gray-600 text-xs" style={{ fontFamily: "Public Sans" }}>
                        {guideline.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Tips */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
  <h4 className="font-semibold text-blue-900 mb-2 flex items-center" style={{ fontFamily: "Public Sans" }}>
    <img src={idea} alt="Pro Tips" className="w-4 h-4 mr-1 filter brightness-0" />
    Pro Tips
  </h4>
  <ul className="text-xs text-blue-800 space-y-1" style={{ fontFamily: "Public Sans" }}>
    <li>• Use keywords students search for</li>
    <li>• Highlight growth opportunities</li>
    <li>• Mention company culture</li>
    <li>• Include application deadline</li>
  </ul>
</div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />
    </div>
  );
};

export default New_Openings;