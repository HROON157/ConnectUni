import { useState } from "react";
import { addJobOpening } from "../../Firebase/auth";
import { auth } from "../../Firebase/db";
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
    <>
      <div className="mr-6 sm:mr-8 md:mr-10 lg:ml-12 p-4">
        <h2
          className="text-3xl font-bold mb-6 text-[#0D141C]"
          style={{ fontFamily: "Public Sans" }}
        >
          Add New Opening
        </h2>
        <div
          style={{ width: "100%", marginTop: "40px" }}
          className="border-t border-[#66666640]"
        ></div>
        <p
          className="mt-5 text-xl font-bold text-[#0D141C]"
          style={{ lineHeight: "40px" }}
        >
          Yay, A new job!
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="Job Title"
              className={`border p-3 rounded-lg w-full ${
                errors.jobTitle ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-sm">{errors.jobTitle}</p>
            )}

            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              placeholder="Job Description"
              rows="3"
              className={`border p-3 rounded-lg w-full resize-none ${
                errors.jobDescription ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.jobDescription && (
              <p className="text-red-500 text-sm">{errors.jobDescription}</p>
            )}

            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={`border p-3 rounded-lg w-full ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Type (Internship, Job, Other)</option>
              <option value="internship">Internship</option>
              <option value="job">Full-time Job</option>
              <option value="part-time">Part-time</option>
              <option value="other">Other</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type}</p>
            )}

            <select
              name="compensation"
              value={formData.compensation}
              onChange={handleInputChange}
              className={`border p-3 rounded-lg w-full ${
                errors.compensation ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Compensation (Paid/Unpaid)</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="stipend">Stipend</option>
            </select>
            {errors.compensation && (
              <p className="text-red-500 text-sm">{errors.compensation}</p>
            )}

            <input
              type="text"
              name="payRange"
              value={formData.payRange}
              onChange={handleInputChange}
              placeholder="Pay Range (If Paid)"
              className="border border-gray-300 p-3 rounded-lg w-full"
            />

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className={`border p-3 rounded-lg w-full ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location}</p>
            )}

            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              placeholder="Requirements"
              rows="3"
              className={`border p-3 rounded-lg w-full resize-none ${
                errors.requirements ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.requirements && (
              <p className="text-red-500 text-sm">{errors.requirements}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#5E5BFF] hover:bg-[#4B47FF] transform hover:scale-105 active:scale-95 cursor-pointer'
              } text-white p-3 rounded-lg w-full font-semibold transition-all duration-200 shadow-lg`}
            >
              {loading ? '⏳ Creating...' : '✨ Add Opening'}
            </button>
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
              <h3 className="text-lg font-bold text-[#0D141C] mb-4">
                📋 Job Posting Rules
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <span className="font-bold text-[#5E5BFF] mr-2 min-w-[20px]">
                    1.
                  </span>
                  <p>
                    <strong>Clear Title & Description:</strong> Ensure the job
                    title and description accurately reflect the role and
                    responsibilities.
                  </p>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-[#5E5BFF] mr-2 min-w-[20px]">
                    2.
                  </span>
                  <p>
                    <strong>Position Type:</strong> Select the appropriate job
                    type: [Internship, Full-time, Part-time, Contract].
                  </p>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-[#5E5BFF] mr-2 min-w-[20px]">
                    3.
                  </span>
                  <p>
                    <strong>Compensation:</strong> Specify whether the job is
                    Paid or Unpaid. For unpaid, include any benefits or
                    stipends.
                  </p>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-[#5E5BFF] mr-2 min-w-[20px]">
                    4.
                  </span>
                  <p>
                    <strong>Location:</strong> Include the job location or
                    mention if the role is remote.
                  </p>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-[#5E5BFF] mr-2 min-w-[20px]">
                    5.
                  </span>
                  <p>
                    <strong>Requirements:</strong> List essential qualifications
                    and skills clearly.
                  </p>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-[#5E5BFF] mr-2 min-w-[20px]">
                    6.
                  </span>
                  <p>
                    <strong>Application Instructions:</strong> Provide clear
                    instructions and the application deadline (if any).
                  </p>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-[#5E5BFF] mr-2 min-w-[20px]">
                    7.
                  </span>
                  <p>
                    <strong>Non-Discrimination:</strong> Follow local labor laws
                    and ensure a non-discriminatory posting.
                  </p>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-[#5E5BFF] mr-2 min-w-[20px]">
                    8.
                  </span>
                  <p>
                    <strong>Job Expiry:</strong> Remove postings once the
                    position is filled or after the expiry date.
                  </p>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-[#5E5BFF] mr-2 min-w-[20px]">
                    9.
                  </span>
                  <p>
                    <strong>No Spam or Duplicates:</strong> Only post unique,
                    relevant job openings.
                  </p>
                </div>

                <div className="flex items-start">
                  <span className="font-bold text-[#5E5BFF] mr-2 min-w-[20px]">
                    10.
                  </span>
                  <p>
                    <strong>Ethical Compliance:</strong> Ensure the job complies
                    with labor laws and ethical standards.
                  </p>
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
      />
      </div>
    </>
  );
};

export default New_Openings;