// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { BiSolidHide, BiSolidShow } from "react-icons/bi";
// import ReCAPTCHA from "react-google-recaptcha";
// const CompanySignup = () => {
//         const [formData, setFormData] = useState({
//         profileName: "",
//         email: "",
//         company: "",
//         password: "",
//         gender: "",
//         shareData: false,
//       });
//       const [showPassword, setShowPassword] = useState(false);
//       const [verified, setVerified] = useState(false);
    
//       const handleInputChange = (e) => {
//         const { name, value, type: inputType, checked } = e.target;
//         setFormData((prev) => ({
//           ...prev,
//           [name]: inputType === "checkbox" ? checked : value,
//         }));
//       };
    
//       const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!verified) {
//           alert("Please complete the reCAPTCHA verification");
//           return;
//         }
//         console.log("Student signup data:", formData);
//       };
    
//       const togglePasswordVisibility = () => {
//         setShowPassword((prev) => !prev);
//       };
    
//       const handleCaptchaChange = (value) => {
//         console.log("Captcha value:", value);
//         setVerified(!!value); 
//       };
    
//       const handleCaptchaExpired = () => {
//         setVerified(false);
//       };
    
//   return (
//         <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
//       <div className="max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
       
//         <div className="text-center mt-4 sm:mt-8">
//           <h3
//             className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900 leading-tight"
//             style={{
//               fontFamily: "Poppins",
//             }}
//           >
//             Sign up for free to start live-streaming
//           </h3>
//         </div>

       
//         <div className="flex items-center justify-center mt-6 sm:mt-8">
//           <div
//             style={{ width: "25%" }}
//             className="border-t border-[#66666640]"
//           ></div>
//           <span className="px-3 sm:px-4 text-[#666666] text-xs sm:text-sm font-medium">
//             OR
//           </span>
//           <div
//             style={{ width: "25%" }}
//             className="border-t border-[#66666640]"
//           ></div>
//         </div>

        
//         <div className="text-center mt-6 sm:mt-8 px-2">
//           <p className="text-[#333333] text-sm sm:text-base">
//             Sign up with your Company email address as a company
//           </p>
//         </div>

        
//         <form
//           onSubmit={handleSubmit}
//           className="mt-6 sm:mt-8 space-y-4 sm:space-y-5"
//         >
     
//           <div>
//             <label className="block text-sm font-medium text-[#666666] mb-1 sm:mb-2">
//               Profile name
//             </label>
//             <input
//               type="text"
//               name="profileName"
//               placeholder="Enter your profile name"
//               value={formData.profileName}
//               onChange={handleInputChange}
//               required
//               className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-[#66666659] focus:border-blue-500 outline-none text-sm sm:text-base"
//             />
//           </div>

         
//           <div>
//             <label className="block text-sm font-medium text-[#666666] mb-1 sm:mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your email address"
//               value={formData.email}
//               onChange={handleInputChange}
//               required
//               className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-[#66666659] focus:border-blue-500 outline-none text-sm sm:text-base"
//             />
//           </div>

          
//           <div>
//             <label className="block text-sm font-medium text-[#666666] mb-1 sm:mb-2">
//               Company
//             </label>
//             <input
//               type="text"
//               name="company"
//               placeholder="Enter your Company name"
//               value={formData.company}
//               onChange={handleInputChange}
//               required
//               className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-[#66666659] focus:border-blue-500 outline-none text-sm sm:text-base"
//             />
//           </div>
                  
//           <div>
//             <label className="block text-sm font-medium text-[#666666] mb-1 sm:mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-[#66666659] focus:border-blue-500 outline-none pr-16 text-sm sm:text-base"
//               />
//               <button
//                 type="button"
//                 onClick={togglePasswordVisibility}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none flex items-center space-x-1"
//               >
//                 {showPassword ? (
//                   <BiSolidHide className="w-4 h-4" />
//                 ) : (
//                   <BiSolidShow className="w-4 h-4" />
//                 )}
//                 <span className="text-xs">
//                   {showPassword ? "Hide" : "Show"}
//                 </span>
//               </button>
//             </div>
//             <p className="text-xs text-[#666666] mt-1 sm:mt-2">
//               Use 8 or more characters with a mix of letters, numbers & symbols
//             </p>
//           </div>

         
//           <div>
//             <label className="block text-sm font-medium text-[#666666] mb-2 sm:mb-3 text-center">
//               What's your gender?{" "}
//               <span className="text-gray-400">(optional)</span>
//             </label>
//             <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
//               <label className="flex items-center justify-center">
//                 <input
//                   type="radio"
//                   name="gender"
//                   value="female"
//                   checked={formData.gender === "female"}
//                   onChange={handleInputChange}
//                   className="mr-2 w-4 h-4 flex-shrink-0"
//                 />
//                 <span className="text-sm sm:text-base">Female</span>
//               </label>

//               <label className="flex items-center justify-center">
//                 <input
//                   type="radio"
//                   name="gender"
//                   value="male"
//                   checked={formData.gender === "male"}
//                   onChange={handleInputChange}
//                   className="mr-2 w-4 h-4 flex-shrink-0"
//                 />
//                 <span className="text-sm sm:text-base">Male</span>
//               </label>
//             </div>
//           </div>

          
//           <div className="flex items-start space-x-2">
//             <input
//               type="checkbox"
//               name="shareData"
//               checked={formData.shareData}
//               onChange={handleInputChange}
//               className="mt-1 w-4 h-4 flex-shrink-0"
//             />
//             <label className="text-xs sm:text-sm text-gray-600 leading-relaxed">
//               Share my registration data with our content providers for
//               marketing purposes.
//             </label>
//           </div>

        
//           <div className="text-xs text-[#666666] leading-relaxed">
//             By creating an account, you agree to the{" "}
//             <Link to="#" className="text-[#666666] underline">
//               Terms of use
//             </Link>{" "}
//             and{" "}
//             <Link to="#" className="text-[#666666] underline">
//               Privacy Policy
//             </Link>
//             .
//           </div>

         
//           <div className="mt-4 border-0">
//             <ReCAPTCHA
//               sitekey="6LdUPJcrAAAAAOTXcQy3X-1Tpi_dNt-UnCFxfq4Y"
//               onChange={handleCaptchaChange}
//               onExpired={handleCaptchaExpired}
//               onError={() => setVerified(false)}
//             />
//           </div>

          
//           <div className="pt-2">
//             <button
//               type="submit"
//               className={`w-full py-3 sm:py-3.5 px-4 rounded-2xl font-semibold transition-colors duration-200 text-sm sm:text-base ${
//                 verified 
//                   ? 'bg-blue-500 hover:bg-blue-600 text-white' 
//                   : 'bg-gray-400 hover:bg-gray-500 text-white cursor-not-allowed'
//               }`}
//             >
//               Sign up
//             </button>
//           </div>

          
//           <div className="text-center text-xs sm:text-sm text-gray-600 pt-2">
//             Already have an account?{" "}
//             <Link to="/login" className="text-[#111111] underline">
//               Log in
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default CompanySignup
import CombinedSignup from "../Components/Forms/RoleSection";
const CompanySignup = () => {
  return (
    <CombinedSignup userRole="hr" />
  )
}
export default CompanySignup