import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavLink from "./NavLink";
import { publicNavItems, studentNavItems, hrNavItems } from "../../Data/navData";
import { useAuth } from "../../Context/Context";
import { HiOutlineChatBubbleLeftRight, HiOutlineUser, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../../Firebase/db";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Fetch profile data
  const fetchProfileData = async () => {
    if (!user?.uid || !isAuthenticated) return;
    
    try {
      setProfileLoading(true);
      const collectionName = user.role === 'student' ? 'studentProfiles' : 'hrProfiles';
      const docRef = doc(db, collectionName, user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfileData(docSnap.data());
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch profile data when user changes
  useEffect(() => {
    if (isAuthenticated && user?.uid) {
      fetchProfileData();
    } else {
      setProfileData(null);
    }
  }, [isAuthenticated, user?.uid, user?.role]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNavItems = () => {
    if (!isAuthenticated) return publicNavItems;
    if (user?.role === 'student') return studentNavItems;
    if (user?.role === 'hr') return hrNavItems;
    return publicNavItems;
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProfileDropdownOpen(prev => !prev);
  };

  const handleViewProfile = () => {
    const profilePath = user?.role === 'student' ? '/student-profile' : '/hr-profile';
    navigate(profilePath);
    setIsProfileDropdownOpen(false);
  };

  const handleMessagesClick = () => {
    navigate('/messages');
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Get user initials
  const getUserInitials = () => {
    const name = profileData?.name || user?.name || 'User';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Profile Avatar Component
  const ProfileAvatar = ({ size = "w-8 h-8", className = "" }) => (
    <div className={`${size} rounded-full flex items-center justify-center overflow-hidden ${className}`}>
      {profileLoading ? (
        <div className="w-full h-full bg-gradient-to-r from-gray-400 to-gray-500 animate-pulse"></div>
      ) : profileData?.profilePic ? (
        <img 
          src={profileData.profilePic} 
          alt="Profile" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      {/* Fallback initials */}
      <div 
        className={`w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold ${profileData?.profilePic && !profileLoading ? 'hidden' : 'flex'}`}
      >
        {getUserInitials()}
      </div>
    </div>
  );

  const navItems = getNavItems();

  return (
    <nav className="w-full  bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-indigo-900/95 backdrop-blur-lg border-b border-gray-800/50 sticky top-0 z-[9999] shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center space-x-8">
            <Link
              to={isAuthenticated ? "/" : "/"}
              className="flex items-center space-x-2 group"
              onClick={closeMenu}
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm sm:text-base">CU</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-purple-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"></div>
              </div>
              <span className="text-gray-200 font-bold text-lg sm:text-xl tracking-tight group-hover:text-indigo-400 transition-colors">
                ConnectUni
              </span>
            </Link>

            {isAuthenticated && (
              <Link
                to={user?.role === 'student' ? '/student-dashboard' : '/hr-dashboard'}
                className="text-gray-200 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-200 relative group hidden md:block"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label }) => (
              <NavLink key={path} to={path} mobile={false}>
                {label !== "Dashboard" && label}
              </NavLink>
            ))}

            {isAuthenticated && (
              <button
                onClick={handleMessagesClick}
                className="text-gray-200 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-all duration-200 relative group"
                title="Messages"
              >
                <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center"></span>
              </button>
            )}
            
            {isAuthenticated ? (
              <div className="relative z-50" ref={dropdownRef}>
                {/* Profile Avatar - Clickable */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 p-2 rounded-full cursor-pointer transition-all duration-200 focus:outline-none hover:bg-gray-800/50"
                  type="button"
                >
                  <ProfileAvatar />
                  <span className="text-gray-200 text-sm xl:block lg:hidden block">
                    {profileData?.name || user?.name || 'User'}
                  </span>
                  {/* Dropdown arrow */}
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isProfileDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="fixed right-4 top-14 mt-2 w-64 bg-gradient-to-br from-gray-800  to-indigo-700  backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-2 z-[9999] transform transition-all duration-200 scale-100 opacity-100">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <ProfileAvatar size="w-12 h-12" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate">
                            {profileData?.name || user?.name || 'User'}
                          </p>
                          {profileData?.title && (
                            <p className="text-sm text-gray-400 truncate">
                              {profileData.title}
                            </p>
                          )}
                          <p className="text-sm text-gray-400 capitalize ">
                            {profileData?.company || 'Company'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={handleViewProfile}
                        className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800/50 cursor-pointer flex items-center space-x-3 transition-colors"
                      >
                        <HiOutlineUser className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>

                      <div className="border-t border-gray-700/50 my-1"></div>

                      <button
                        onClick={handleAuthAction}
                        className="w-full text-left flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-800/50 cursor-pointer rounded-lg transition-colors"
                      >
                        <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleAuthAction}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-purple-600 font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-sm"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Messages Icon for Mobile */}
                <button
                  onClick={handleMessagesClick}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors relative"
                >
                  <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Avatar for Mobile */}
                <button
                  onClick={handleProfileClick}
                  className="relative z-50"
                  type="button"
                >
                  <ProfileAvatar />
                </button>
              </>
            ) : (
              <button
                onClick={handleAuthAction}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium transition-all duration-200 text-xs"
              >
                Login
              </button>
            )}
            
            <button
              onClick={toggleMenu}
              className="px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gradient-to-r from-blue-500 to-purple-600 transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Toggle menu</span>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current transform transition duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
                <span className={`block w-5 h-0.5 bg-current transform transition duration-300 mt-1 ${isMenuOpen ? "opacity-0" : ""}`}></span>
                <span className={`block w-5 h-0.5 bg-current transform transition duration-300 mt-1 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pt-2 pb-3 space-y-1 border-t border-gray-700">
          {navItems.map(({ path, label }) => (
            <NavLink key={path} to={path} mobile={true} onClick={closeMenu}>
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile Profile Dropdown */}
      {isAuthenticated && isProfileDropdownOpen && (
        <div className="md:hidden bg-gradient t-br from-blue-500 to-purple-900 border-t border-gray-700 relative z-[9999]">
          <div className="px-4 py-3 space-y-2">
            {/* Mobile User Info */}
            <div className="flex items-center space-x-3 px-3 py-2">
              <ProfileAvatar size="w-10 h-10" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {profileData?.name || user?.name || 'User'}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {profileData?.title || 'Role'}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {profileData?.company || 'Company'}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-700"></div>
            
            <button
              onClick={handleViewProfile}
              className="w-full text-left flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <HiOutlineUser className="w-4 h-4" />
              <span>View Profile</span>
            </button>
            <button
              onClick={handleAuthAction}
              className="w-full text-left flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default React.memo(Navbar);