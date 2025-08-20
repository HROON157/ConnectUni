import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { toast, ToastContainer } from "react-toastify";
import { signIn } from "../Firebase/auth";
import { useAuth } from "../Context/Context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/db";
import "react-toastify/dist/ReactToastify.css";
import OpteraLogo from "../assets/Logo.png"
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
  const { login } = useAuth();

  
  const checkProfileCompletion = async (userId, role) => {
    try {
      const collectionName = role === 'student' ? 'studentProfiles' : 'hrProfiles';
      const profileRef = doc(db, collectionName, userId);
      const profileSnap = await getDoc(profileRef);
      
      if (!profileSnap.exists()) {
        return false;
      }
      
      const profileData = profileSnap.data();
      
      if (role === 'hr') {
      
        return !!(
          profileData.name && 
          profileData.company && 
          profileData.about && 
          profileData.title
        );
      } else {
    
        return !!(
          profileData.name && 
          profileData.university && 
          profileData.degreeProgram && 
          profileData.timePeriod
        );
      }
    } catch (error) {

      return false;
    }
  };

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

    try {

      const signInPromise = signIn(formData.email, formData.password);
      
      const result = await signInPromise;
      const { userData, user } = result;
   
      login({
        role: userData.role,
        name: userData.profileName,
        email: userData.email,
        uid: user.uid
      });
      
    
      const profileCheckPromise = checkProfileCompletion(user.uid, userData.role);
      let navigationPath;
      if (userData.role === 'student') {
        navigationPath = '/student-dashboard';
      } else if (userData.role === 'hr') {
        navigationPath = '/hr-dashboard';
      } else {
        navigationPath = '/dashboard';
      }

      const isProfileComplete = await profileCheckPromise;
      
      if (userData.role === 'student' && !isProfileComplete) {
        navigationPath = '/student-profile';
      } else if (userData.role === 'hr' && !isProfileComplete) {
        navigationPath = '/hr-profile';
      }
      
      
      navigate(navigationPath);
      
    } catch (error) {
      
      let errorMessage = "Login failed. Please try again.";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email address.";
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = "Invalid email or password.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Network error. Please check your connection.";
          break;
        default:
          errorMessage = error.message || errorMessage;
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
    
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 transition-all duration-300">
     
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-1">

  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center  overflow-hidden">
    <img 
      src={OpteraLogo} 
      alt="Logo" 
      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-contain"
    />
  </div>
  <span className="text-gray-800 font-bold text-xl sm:text-2xl font-giza bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
    Optera
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
              className={`w-full px-4 py-3 bg-gray-50/80 border rounded-xl outline-none text-gray-800 placeholder-transparent transition-all duration-200 ${
                isFocused.email 
                  ? 'border-blue-500  ring-blue-500/20' 
                  : 'border-gray-200 hover:border-blue-300'
              } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              autoComplete="email"
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

   
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setIsFocused({...isFocused, password: true})}
              onBlur={() => setIsFocused({...isFocused, password: false})}
              required
              disabled={loading}
              className={`w-full px-4 py-3 bg-gray-50/80 border rounded-xl outline-none text-gray-800 placeholder-transparent transition-all duration-200 ${
                isFocused.password 
                  ? 'border-blue-500  ring-blue-500/20' 
                  : 'border-gray-200 hover:border-blue-300'
              } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              autoComplete="current-password"
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
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                showPassword 
                  ? 'text-blue-600 hover:bg-blue-100/50' 
                  : 'text-gray-500 hover:bg-gray-100/50'
              } ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {showPassword ? (
                <BiSolidHide className="w-5 h-5" />
              ) : (
                <BiSolidShow className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between  pt-2 space-y-3 sm:space-y-0">
            <button
              type="submit"
              disabled={loading}
              className={`relative overflow-hidden cursor-pointer w-full sm:w-auto font-medium py-3 px-8 rounded-full transition-all duration-200 text-sm shadow-lg ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:shadow-blue-500/30'
              }`}
            >
              {loading ? (
                <span className="flex items-center  justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500 font-medium">
            Or continue with
          </span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-4 border border-blue-100/50">
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
            Not a member? Join Optera to access exclusive features and connect with your university community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/student-signup"
              className="flex-1 text-center py-2.5 px-4 bg-blue-100 border border-blue-200 text-blue-700 hover:bg-blue-200 rounded-lg font-medium transition-all duration-200 text-sm"
            >
              Join as Student
            </Link>
            <Link
              to="/hr-signup"
              className="flex-1 text-center py-2.5 px-4 bg-indigo-100 border border-indigo-200 text-indigo-700 hover:bg-indigo-200 rounded-lg font-medium transition-all duration-200 text-sm"
            >
              Join as HR
            </Link>
          </div>
        </div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable 
        pauseOnHover={false}
        theme="light"
        className="mt-16"
      />
    </div>
  );
};

export default Login;