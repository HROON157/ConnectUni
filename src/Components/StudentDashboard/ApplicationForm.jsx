// import React, { useState, useEffect } from "react";
// import { submitJobApplication, checkExistingApplication } from "../../Firebase/auth";

// const ApplicationForm = ({ job, onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     title: "",
//     bio: "",
//     university: "",
//     degreeProgram: "",
//     timePeriod: "",
//     linkedin: "",
//     github: "",
//     about: "",
//     resume: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [hasApplied, setHasApplied] = useState(false);
//   const [checkingApplication, setCheckingApplication] = useState(true);

//   const studentEmail = localStorage.getItem("userEmail");

//   useEffect(() => {
    
//     const storedData = {
//       name: localStorage.getItem("userName") || "",
//       email: studentEmail || "",
//       university: localStorage.getItem("university") || "",
//     };
    
//     setFormData(prev => ({ ...prev, ...storedData }));

//     // Check if already applied
//     if (job?.id && studentEmail) {
//       checkExistingApplication(job.id, studentEmail)
//         .then(exists => {
//           setHasApplied(exists);
//           setCheckingApplication(false);
//         })
//         .catch(() => setCheckingApplication(false));
//     } else {
//       setCheckingApplication(false);
//     }
//   }, [job?.id, studentEmail]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!job?.id || !studentEmail) return;

//     setLoading(true);
//     try {
//       await submitJobApplication(job.id, {
//         ...formData,
//         email: studentEmail,
//         jobTitle: job.jobTitle,
//         companyName: job.companyName || "Unknown Company"
//       });
      
//       onSuccess();
//       onClose();
//     } catch (error) {
//       console.error("Error submitting application:", error);
//       alert("Failed to submit application. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (checkingApplication) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl p-8 max-w-md w-full">
//           <div className="text-center">
//             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p>Checking application status...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (hasApplied) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-2">Already Applied</h3>
//           <p className="text-gray-600 mb-6">You have already submitted an application for this position.</p>
//           <button
//             onClick={onClose}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-gray-900">Apply for {job?.jobTitle}</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 transition-colors"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="e.g., Computer Science Student"
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
//             <textarea
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               rows={3}
//               placeholder="Brief professional bio..."
//               className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">University *</label>
//               <input
//                 type="text"
//                 name="university"
//                 value={formData.university}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Degree Program *</label>
//               <input
//                 type="text"
//                 name="degreeProgram"
//                 value={formData.degreeProgram}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g., Bachelor of Computer Science"
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Study Period</label>
//             <input
//               type="text"
//               name="timePeriod"
//               value={formData.timePeriod}
//               onChange={handleChange}
//               placeholder="e.g., 2020-2024"
//               className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
//               <input
//                 type="url"
//                 name="linkedin"
//                 value={formData.linkedin}
//                 onChange={handleChange}
//                 placeholder="https://linkedin.com/in/yourprofile"
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
//               <input
//                 type="url"
//                 name="github"
//                 value={formData.github}
//                 onChange={handleChange}
//                 placeholder="https://github.com/yourusername"
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">About Yourself</label>
//             <textarea
//               name="about"
//               value={formData.about}
//               onChange={handleChange}
//               rows={4}
//               placeholder="Tell us about yourself, your interests, and why you're interested in this position..."
//               className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Resume/Portfolio Link</label>
//             <input
//               type="url"
//               name="resume"
//               value={formData.resume}
//               onChange={handleChange}
//               placeholder="Link to your resume or portfolio"
//               className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div className="flex gap-4 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Submitting..." : "Submit Application"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ApplicationForm;