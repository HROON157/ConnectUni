import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import { signIn } from "../Firebase/auth";
import { useAuth } from "../Context/Context";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHoveringLogin, setIsHoveringLogin] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });
  const navigate = useNavigate();
  const {login} = useAuth();
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
      
      const { userData, user } = result;
      login({
        role: userData.role,
        name: userData.profileName,
        email: userData.email,
        uid: user.uid
      })
      toast.dismiss(loadingToastId);
      toast.success(`Welcome back, ${userData.profileName}!`);
      
      if (userData.role === 'student') {
        console.log("Redirecting to student dashboard");
        setTimeout(() => navigate('/student-dashboard'), 1500);
      } else if (userData.role === 'hr') {
        console.log("Redirecting to HR profile");
        setTimeout(() => navigate('/hr-profile'), 1500);
      } else {
        console.log("Unknown role, redirecting to general dashboard");
        setTimeout(() => navigate('/dashboard'), 1000);
      }
      
      // localStorage.setItem('userRole', userData.role);
      // localStorage.setItem('userName', userData.profileName);
      // localStorage.setItem('uid', user.uid);
      // console.log('UID stored in localStorage:', user.uid);
      
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
    <div className="min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-200/50">
        {/* Animated Logo Section */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
                <span className="text-white font-bold text-xl">CU</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-purple-500 to-indigo-500 rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-500"></div>
            </div>
            <span className="text-gray-800 font-bold text-2xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
              ConnectUni
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 text-center">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            Sign in to access your personalized dashboard and connect with your university community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input with floating label effect */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setIsFocused({...isFocused, email: true})}
              onBlur={() => setIsFocused({...isFocused, email: false})}
              required
              disabled={loading}
              className={`w-full px-4 py-3 bg-gray-50/80 border rounded-xl outline-none text-gray-800 placeholder-transparent peer transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                isFocused.email 
                  ? 'border-blue-500  ring-blue-500/20 shadow-blue-500/10' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            />
            <label 
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                formData.email || isFocused.email
                  ? '-top-2.5 bg-white px-1 text-xs text-blue-600'
                  : 'top-3.5 text-gray-500'
              }`}
            >
              Email address
            </label>
          </div>

          {/* Password Input with interactive eye icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setIsFocused({...isFocused, password: true})}
              onBlur={() => setIsFocused({...isFocused, password: false})}
              placeholder=" "
              required
              disabled={loading}
              className={`w-full px-4 py-3 bg-gray-50/80 border rounded-xl outline-none text-gray-800 placeholder-transparent peer transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                isFocused.password 
                  ? 'border-blue-500  ring-blue-500/20 shadow-blue-500/10' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            />
            <label 
              className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                formData.password || isFocused.password
                  ? '-top-2.5 bg-white px-1 text-xs text-blue-600'
                  : 'top-3.5 text-gray-500'
              }`}
            >
              Password
            </label>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={loading}
              className={`absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                showPassword 
                  ? 'text-blue-600 hover:bg-blue-100/50' 
                  : 'text-gray-500 hover:bg-gray-100/50'
              } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {showPassword ? (
                <BiSolidHide className="w-5 h-5" />
              ) : (
                <BiSolidShow className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center cursor-pointer sm:justify-between pt-2 space-y-3 sm:space-y-0">
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setIsHoveringLogin(true)}
              onMouseLeave={() => setIsHoveringLogin(false)}
              className={`relative overflow-hidden w-full cursor-pointer sm:w-auto font-medium py-3 px-8 rounded-full transition-all duration-300 text-sm shadow-lg ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/30'
              }`}
            >
              <span className="relative z-10 flex items-center  justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </span>
              {!loading && (
                <span className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full ${
                  isHoveringLogin ? 'opacity-100' : 'opacity-0'
                }`}></span>
              )}
            </button>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 underline text-center sm:text-right transition-colors font-medium hover:scale-105 transform"
            >
              Forgot password?
            </Link>
          </div>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500 font-medium">
            Or continue with
          </span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-4 border border-blue-100/50 hover:border-blue-200 transition-all duration-300">
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
            Not a member? Join ConnectUni to access exclusive features, events, and connect with your university community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/student-signup"
              className="flex-1 text-center py-2.5 px-4 bg-blue-100 border border-blue-200 text-blue-700 hover:bg-blue-200 hover:text-blue-800 rounded-lg font-medium transition-all duration-200 text-sm hover:shadow-sm hover:-translate-y-0.5"
            >
              Join as Student
            </Link>
            <Link
              to="/hr-signup"
              className="flex-1 text-center py-2.5 px-4 bg-indigo-100 border border-indigo-200 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-800 rounded-lg font-medium transition-all duration-200 text-sm hover:shadow-sm hover:-translate-y-0.5"
            >
              Join as HR
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
        toastStyle={{
          backgroundColor: '#ffffff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.1)'
        }}
      />
    </div>
  );
};

export default Login;