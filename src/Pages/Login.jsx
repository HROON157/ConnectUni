import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import { signIn } from "../Firebase/auth";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
  
    const loadingToastId = toast.loading("Signing you in...");

    try {
      console.log("Attempting login with:", formData.email);
      
      
      const result = await signIn(formData.email, formData.password);
      console.log("User signed in successfully:", result);
      
      const { userData } = result;
      
      
      toast.dismiss(loadingToastId);
      toast.success(`Welcome back, ${userData.profileName}!`);
      
     
      if (userData.role === 'student') {
        console.log("Redirecting to student dashboard");
        setTimeout(() => navigate('/student-dashboard'), 1500);
      } else if (userData.role === 'hr') {
        console.log("Redirecting to HR dashboard");
        setTimeout(() => navigate('/hr-dashboard'), 1500);
      } else {
        console.log("Unknown role, redirecting to general dashboard");
        setTimeout(() => navigate('/dashboard'), 1000);
      }
      
      
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userName', userData.profileName);
      
    } catch (error) {
      console.error("Login error:", error);
      
  
      toast.dismiss(loadingToastId);
      
   
      let errorMessage = "Login failed. Please try again.";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This account has been disabled.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight">
            Log in to your account
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Welcome back! Please sign in to access your personalized dashboard and connect with your university community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email address"
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-[#66666659] focus:border-blue-500 outline-none text-sm sm:text-base transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-[#66666659] focus:border-blue-500 outline-none pr-14 sm:pr-16 text-sm sm:text-base transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={loading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none flex items-center space-x-1 disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <BiSolidHide className="w-4 h-4" />
                ) : (
                  <BiSolidShow className="w-4 h-4" />
                )}
                <span className="text-xs hidden sm:inline">
                  {showPassword ? "Hide" : "Show"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 space-y-3 sm:space-y-0">
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto font-medium py-3 px-6 sm:px-8 rounded-full transition-colors duration-200 text-sm sm:text-base ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
              }`}
            >
              {loading ? 'Signing in...' : 'Log in'}
            </button>
            <Link
              to="/forgot-password"
              className="text-xs sm:text-sm text-gray-900 hover:text-gray-700 underline text-center sm:text-right"
            >
              Forget your password?
            </Link>
          </div>
        </form>

        <div className="flex items-center my-4 sm:my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 sm:px-4 text-xs sm:text-sm text-black">
            Or sign up with
          </span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <div>
          <p className="text-xs sm:text-sm text-gray-500 mb-2 leading-relaxed">
            Not a member? Get exclusive access to exhibitions and events, free
            admission every day, and much more.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Link
              to="/student-signup"
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Join as Student
            </Link>
            <Link
              to="/hr-signup"
              className="text-xs sm:text-sm text-green-600 hover:text-green-800 underline font-medium"
            >
              Join as HR Professional
            </Link>
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
  );
};

export default Login;