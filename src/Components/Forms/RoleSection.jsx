import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import { signUpWithRole } from "../../Firebase/auth";
import "react-toastify/dist/ReactToastify.css";
import OpteraLogo from "../../assets/Logo.png";

const CombinedSignup = ({ userRole = "student" }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profileName: "",
    email: "",
    university: "",
    degreeProgram: "",
    hodReferralCode: "",
    companyName: "",
    password: "",
    gender: "",
    shareData: false,
    role: userRole,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false,
    profileName: false,
    university: false,
    degreeProgram: false,
    companyName: false,
    hodReferralCode: false,
  });

  const handleInputChange = useCallback((e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === "checkbox" ? checked : value,
    }));
  }, []);

  const handleRoleChange = useCallback((newRole) => {
    setFormData((prev) => ({
      ...prev,
      role: newRole,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!formData.email || !formData.profileName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.role === "student" && formData.hodReferralCode !== "HS-1221") {
      toast.error("Please enter the correct HOD referral code");
      return;
    }

    setIsLoading(true);

    try {
      await signUpWithRole(formData);
      toast.success("Account created successfully! Redirecting to login...", {
        onClose: () => navigate("/login"),
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      let errorMessage = "Signup failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Try logging in instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-200/50">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="flex items-center justify-center mb-0">
                <div className="flex items-center space-x-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden">
                    <img
                      src={OpteraLogo}
                      alt="Logo"
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-contain"
                    />
                  </div>
                  <span className="text-gray-800 font-bold text-xl sm:text-2xl font-giza bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Join Optera
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 text-center mb-6 cursor-pointer">
          Sign up to connect with{" "}
          {formData.role === "student" ? "opportunities" : "talented students"}
        </p>
        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange("student")}
            className={`px-6 py-2 rounded-xl cursor-pointer font-medium transition-all duration-200 ${
              formData.role === "student"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("hr")}
            className={`px-6 py-2 rounded-xl cursor-pointer font-medium transition-all duration-200 ${
              formData.role === "hr"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            HR Professional
          </button>
        </div>
        <div className="mb-6 text-center">
          {formData.role === "student" ? (
            <div className="text-blue-700 bg-blue-50 rounded-lg p-3 text-base font-semibold shadow-sm">
              <span className="font-bold">As a Student:</span> Access top
              internships, connect with verified companies, and build your
              career profile.
            </div>
          ) : (
            <div className="text-blue-700 bg-blue-50 rounded-lg p-3 text-base font-semibold shadow-sm">
              <span className="font-bold">As an HR:</span> Discover talented
              students, manage applications, and promote your company’s
              opportunities.
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              name="profileName"
              placeholder=" "
              value={formData.profileName}
              onChange={handleInputChange}
              onFocus={() => setIsFocused({ ...isFocused, profileName: true })}
              onBlur={() => setIsFocused({ ...isFocused, profileName: false })}
              required
              className={`w-full px-4 py-3 bg-gray-50/80 border rounded-xl outline-none text-gray-800 placeholder-transparent peer transition-all duration-200 ${
                isFocused.profileName
                  ? "border-blue-500 ring-blue-500/20 shadow-blue-500/10"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                formData.profileName || isFocused.profileName
                  ? "-top-2.5 bg-white px-1 text-xs text-blue-600"
                  : "top-3.5 text-gray-500"
              }`}
            >
              Profile Name
            </label>
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setIsFocused({ ...isFocused, email: true })}
              onBlur={() => setIsFocused({ ...isFocused, email: false })}
              required
              className={`w-full px-4 py-3 bg-gray-50/80 border rounded-xl outline-none text-gray-800 placeholder-transparent peer transition-all duration-200 ${
                isFocused.email
                  ? "border-blue-500 ring-blue-500/20 shadow-blue-500/10"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                formData.email || isFocused.email
                  ? "-top-2.5 bg-white px-1 text-xs text-blue-600"
                  : "top-3.5 text-gray-500"
              }`}
            >
              Email Address
            </label>
          </div>

          {formData.role === "student" ? (
            <>
              <div className="relative">
                <input
                  type="text"
                  name="university"
                  placeholder=" "
                  value={formData.university}
                  onChange={handleInputChange}
                  onFocus={() =>
                    setIsFocused({ ...isFocused, university: true })
                  }
                  onBlur={() =>
                    setIsFocused({ ...isFocused, university: false })
                  }
                  required
                  className={`w-full px-4 py-3 bg-gray-50/80 border rounded-xl outline-none text-gray-800 placeholder-transparent peer transition-all duration-200 ${
                    isFocused.university
                      ? "border-blue-500 ring-blue-500/20 shadow-blue-500/10"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                />
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.university || isFocused.university
                      ? "-top-2.5 bg-white px-1 text-xs text-blue-600"
                      : "top-3.5 text-gray-500"
                  }`}
                >
                  University
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="degreeProgram"
                  placeholder=" "
                  value={formData.degreeProgram}
                  onChange={handleInputChange}
                  onFocus={() =>
                    setIsFocused({ ...isFocused, degreeProgram: true })
                  }
                  onBlur={() =>
                    setIsFocused({ ...isFocused, degreeProgram: false })
                  }
                  required
                  className={`w-full px-4 py-3 bg-gray-50/80 border rounded-xl outline-none text-gray-800 placeholder-transparent peer transition-all duration-200 ${
                    isFocused.degreeProgram
                      ? "border-blue-500 ring-blue-500/20 shadow-blue-500/10"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                />
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.degreeProgram || isFocused.degreeProgram
                      ? "-top-2.5 bg-white px-1 text-xs text-blue-600"
                      : "top-3.5 text-gray-500"
                  }`}
                >
                  Degree Program
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="hodReferralCode"
                  placeholder=" "
                  value={formData.hodReferralCode}
                  onChange={handleInputChange}
                  onFocus={() =>
                    setIsFocused({ ...isFocused, hodReferralCode: true })
                  }
                  onBlur={() =>
                    setIsFocused({ ...isFocused, hodReferralCode: false })
                  }
                  required
                  className={`w-full px-4 py-3 bg-gray-50/80 border rounded-xl outline-none text-gray-800 placeholder-transparent peer transition-all duration-200 ${
                    isFocused.hodReferralCode
                      ? "border-blue-500 ring-blue-500/20 shadow-blue-500/10"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                />
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    formData.hodReferralCode || isFocused.hodReferralCode
                      ? "-top-2.5 bg-white px-1 text-xs text-blue-600"
                      : "top-3.5 text-gray-500"
                  }`}
                >
                  HOD Referral Code
                </label>
              </div>
            </>
          ) : (
            <div className="relative">
              <input
                type="text"
                name="companyName"
                placeholder=" "
                value={formData.companyName}
                onChange={handleInputChange}
                onFocus={() =>
                  setIsFocused({ ...isFocused, companyName: true })
                }
                onBlur={() =>
                  setIsFocused({ ...isFocused, companyName: false })
                }
                required
                className={`w-full px-4 py-3 bg-gray-50/80 border rounded-xl outline-none text-gray-800 placeholder-transparent peer transition-all duration-200 ${
                  isFocused.companyName
                    ? "border-blue-500 ring-blue-500/20 shadow-blue-500/10"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              />
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  formData.companyName || isFocused.companyName
                    ? "-top-2.5 bg-white px-1 text-xs text-blue-600"
                    : "top-3.5 text-gray-500"
                }`}
              >
                Company Name
              </label>
            </div>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setIsFocused({ ...isFocused, password: true })}
              onBlur={() => setIsFocused({ ...isFocused, password: false })}
              required
              className={`w-full px-4 py-3 bg-gray-50/80 border rounded-xl outline-none text-gray-800 placeholder-transparent peer transition-all duration-200 ${
                isFocused.password
                  ? "border-blue-500 ring-blue-500/20 shadow-blue-500/10"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            />
            <label
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                formData.password || isFocused.password
                  ? "-top-2.5 bg-white px-1 text-xs text-blue-600"
                  : "top-3.5 text-gray-500"
              }`}
            >
              Password
            </label>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                showPassword
                  ? "text-blue-600 hover:bg-blue-100/50"
                  : "text-gray-500 hover:bg-gray-100/50"
              }`}
            >
              {showPassword ? (
                <BiSolidHide className="w-5 h-5" />
              ) : (
                <BiSolidShow className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Use 8 or more characters with a mix of letters, numbers & symbols
          </p>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's your gender?{" "}
              <span className="text-gray-400">(optional)</span>
            </label>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <div
                  className={`w-5 h-5 rounded-full ml-2.5 border-2 flex items-center justify-center transition-colors ${
                    formData.gender === "female"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {formData.gender === "female" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <span className="text-sm">Female</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                    formData.gender === "male"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {formData.gender === "male" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <span className="text-sm">Male</span>
              </label>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors mt-0.5 cursor-pointer ${
                formData.shareData
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-300 hover:border-blue-300"
              }`}
              onClick={() =>
                setFormData({ ...formData, shareData: !formData.shareData })
              }
            >
              {formData.shareData && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <label
              className="text-xs text-gray-600 leading-relaxed cursor-pointer"
              onClick={() =>
                setFormData({ ...formData, shareData: !formData.shareData })
              }
            >
              Share my registration data with our content providers for
              marketing purposes.
            </label>
          </div>

          <div className="text-xs text-gray-500 leading-relaxed">
            By creating an account, you agree to the{" "}
            <Link
              to="#"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Terms of use
            </Link>{" "}
            and{" "}
            <Link
              to="#"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Privacy Policy
            </Link>
            .
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              onMouseEnter={() => setIsHoveringSubmit(true)}
              onMouseLeave={() => setIsHoveringSubmit(false)}
              className={`relative overflow-hidden w-full font-medium py-3 px-4 rounded-full transition-all duration-300 text-sm shadow-lg ${
                !isLoading
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 cursor-pointer text-white hover:shadow-blue-500/30"
                  : "bg-gray-300 cursor-not-allowed text-gray-500"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing up...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10">
                    Sign up as{" "}
                    {formData.role === "student"
                      ? "Student"
                      : "HR Professional"}
                  </span>
                  {!isLoading && (
                    <span
                      className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full ${
                        isHoveringSubmit ? "opacity-100" : "opacity-0"
                      }`}
                    ></span>
                  )}
                </>
              )}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 pt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Log in
            </Link>
          </div>
        </form>
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
        toastStyle={{
          backgroundColor: "#ffffff",
          color: "#1f2937",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.1)",
        }}
      />
    </div>
  );
};

export default CombinedSignup;
