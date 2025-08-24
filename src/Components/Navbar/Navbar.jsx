import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import NavLink from "./NavLink";
import {
  publicNavItems,
  studentNavItems,
  hrNavItems,
} from "../../Data/navData";
import { useAuth } from "../../Context/Context";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineUser,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase/db";
import "../../App.css";
import OperaLogo from "../../assets/Logo.png";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

const ProfileAvatar = React.memo(
  ({
    profilePic,
    initials,
    isLoading = false,
    size = "w-8 h-8",
    className = "",
  }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = useCallback(() => {
      setImageError(true);
    }, []);

    return (
      <div
        className={`${size} rounded-full flex items-center justify-center overflow-hidden ${className} bg-gradient-to-r from-green-400 to-blue-500`}
      >
        {isLoading ? (
          <div className="w-full h-full bg-gradient-to-r from-gray-400 to-gray-500 animate-pulse" />
        ) : profilePic && !imageError ? (
          <img
            src={profilePic}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <span className="text-white text-xs font-semibold">{initials}</span>
        )}
      </div>
    );
  }
);

ProfileAvatar.displayName = "ProfileAvatar";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const unsubscribeRef = useRef(null);


  const isMobile = useMediaQuery("(max-width: 768px)");

  const navItems = useMemo(() => {
    if (!isAuthenticated) return publicNavItems;
    if (user?.role === "student") return studentNavItems;
    if (user?.role === "hr") return hrNavItems;
    return publicNavItems;
  }, [isAuthenticated, user?.role]);

  const userInitials = useMemo(() => {
    const name =
      profileData?.name ||
      profileData?.profileName ||
      user?.name ||
      user?.profileName ||
      "User";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [
    profileData?.name,
    profileData?.profileName,
    user?.name,
    user?.profileName,
  ]);

  const userName = useMemo(() => {
    return (
      profileData?.name ||
      profileData?.profileName ||
      user?.name ||
      user?.profileName ||
      "User"
    );
  }, [
    profileData?.name,
    profileData?.profileName,
    user?.name,
    user?.profileName,
  ]);

  const dashboardPath = useMemo(() => {
    return user?.role === "student" ? "/student-dashboard" : "/hr-dashboard";
  }, [user?.role]);

  const profilePath = useMemo(() => {
    return user?.role === "student" ? "/student-profile" : "/hr-profile";
  }, [user?.role]);

  const setupProfileListener = useCallback(async () => {
    if (!user?.uid || !isAuthenticated) {
      setProfileData(null);
      return;
    }

    try {
      setProfileLoading(true);


      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      const collectionName =
        user.role === "student" ? "studentProfiles" : "hrProfiles";
      const docRef = doc(db, collectionName, user.uid);
      unsubscribeRef.current = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          } else {
            setProfileData(null);
          }
          setProfileLoading(false);
        },
        (error) => {
          
          setProfileLoading(false);
        }
      );
    } catch (error) {
      setProfileLoading(false);
    }
  }, [user?.uid, user?.role, isAuthenticated]);

  
  useEffect(() => {
    setupProfileListener();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [setupProfileListener]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideDesktop = dropdownRef.current?.contains(event.target);
      const isInsideMobile = mobileDropdownRef.current?.contains(event.target);

      if (!isInsideDesktop && !isInsideMobile) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isProfileDropdownOpen]);


  const handleAuthAction = useCallback(() => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [isAuthenticated, logout, navigate]);

  const handleProfileClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isMobile) {
        setIsMenuOpen(false);
      }
      setIsProfileDropdownOpen((prev) => !prev);
    },
    [isMobile]
  );

  const handleViewProfile = useCallback(() => {
    navigate(profilePath);
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  }, [navigate, profilePath]);

  const handleMessagesClick = useCallback(() => {
    navigate("/messages");
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
  }, [navigate]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
    if (isProfileDropdownOpen) {
      setIsProfileDropdownOpen(false);
    }
  }, [isProfileDropdownOpen]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleMobileProfileClick = useCallback(
    (e) => {
      e.stopPropagation();
      handleProfileClick(e);
    },
    [handleProfileClick]
  );

  const handleMobileViewProfile = useCallback(
    (e) => {
      e.stopPropagation();
      handleViewProfile();
    },
    [handleViewProfile]
  );

  const handleMobileAuthAction = useCallback(
    (e) => {
      e.stopPropagation();
      handleAuthAction();
    },
    [handleAuthAction]
  );

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <nav className="w-full bg-gradient-to-br from-gray-800/95 via-gray-900/95 to-indigo-900/95 backdrop-blur-lg border-b border-gray-800/50 sticky top-0 z-[9999] shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex-shrink-0 flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 group"
              onClick={closeMenu}
            >
              <div className="relative">
                <div className="flex items-center justify-center">
               
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center  overflow-hidden">
                    <img
                      src={OperaLogo}
                      alt="Logo"
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-contain"
                    />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-purple-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300" />
              </div>
              <div className="flex flex-col font-giza">
                <span className="text-gray-200  text-lg sm:text-xl  group-hover:text-blue-400 transition-colors">
                  Optera
                </span>
              </div>
            </Link>

            {isAuthenticated && (
              <Link
                to={dashboardPath}
                className="text-gray-200 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-200 relative group hidden md:block"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(
              ({ path, label }) =>
                label !== "Dashboard" && (
                  <NavLink key={path} to={path} mobile={false}>
                    {label}
                  </NavLink>
                )
            )}

            {isAuthenticated && (
              <button
                onClick={handleMessagesClick}
                className="text-gray-200 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-all duration-200 relative group"
                title="Messages"
                aria-label="Messages"
              >
                <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center" />
              </button>
            )}

            {isAuthenticated ? (
              <div className="relative z-50" ref={dropdownRef}>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 p-2 rounded-full cursor-pointer transition-all duration-200 focus:outline-none hover:bg-gray-800/50 focus:ring-2 focus:ring-blue-500"
                  type="button"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <ProfileAvatar
                    profilePic={profileData?.profilePic}
                    initials={userInitials}
                    isLoading={profileLoading}
                  />
                  <span className="text-gray-200 text-sm xl:block lg:hidden block">
                    {userName}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

               
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-64 bg-gradient-to-br from-gray-800 to-indigo-700 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-2 z-[9999] transform transition-all duration-200 scale-100 opacity-100"
                    role="menu"
                    aria-orientation="vertical"
                  >
                   
                    <div className="px-4 py-3 border-b border-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <ProfileAvatar
                          size="w-12 h-12"
                          profilePic={profileData?.profilePic}
                          initials={userInitials}
                          isLoading={profileLoading}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate">
                            {userName}
                          </p>
                          {profileData?.title && (
                            <p className="text-sm text-gray-400 truncate">
                              {profileData.title}
                            </p>
                          )}
                          <p className="text-sm text-gray-400 capitalize">
                            {profileData?.company || user?.role || "User"}
                          </p>
                        </div>
                      </div>
                    </div>

                      <div className="py-1" role="none">
                      <button
                        onClick={handleViewProfile}
                        className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800/50 cursor-pointer flex items-center space-x-3 transition-colors focus:outline-none focus:bg-gray-800/50"
                        role="menuitem"
                      >
                        <HiOutlineUser className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>

                      <div className="border-t border-gray-700/50 my-1" />

                      <button
                        onClick={handleAuthAction}
                        className="w-full text-left flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-800/50 cursor-pointer rounded-lg transition-colors focus:outline-none focus:bg-gray-800/50"
                        role="menuitem"
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
                className="px-6 py-2 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full  font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            )}
          </div>

    
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleMessagesClick}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Messages"
                >
                  <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                </button>

                <button
                  onClick={handleMobileProfileClick}
                  className="relative z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                  type="button"
                  aria-label="User profile"
                >
                  <ProfileAvatar
                    profilePic={profileData?.profilePic}
                    initials={userInitials}
                    isLoading={profileLoading}
                  />
                </button>
              </>
            ) : (
              <button
                onClick={handleAuthAction}
                className="px-3 py-1.5 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium transition-all duration-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </button>
            )}

            <button
              onClick={toggleMenu}
              className="px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gradient-to-r from-blue-500 to-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Toggle menu</span>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block w-5 h-0.5 bg-current transform transition duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-current transform transition duration-300 mt-1 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-current transform transition duration-300 mt-1 ${
                    isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

  
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 border-t border-gray-700">
          {navItems.map(({ path, label }) => (
            <NavLink key={path} to={path} mobile={true} onClick={closeMenu}>
              {label}
            </NavLink>
          ))}
        </div>
      </div>

    
      {isAuthenticated && isProfileDropdownOpen && (
        <div
          ref={mobileDropdownRef}
          className="md:hidden bg-gradient-to-br from-blue-500 to-purple-900 border-t border-gray-700 relative z-[9999]"
          onClick={stopPropagation}
        >
          <div className="px-4 py-3 space-y-2">
    
            <div className="flex items-center space-x-3 px-3 py-2">
              <ProfileAvatar
                size="w-10 h-10"
                profilePic={profileData?.profilePic}
                initials={userInitials}
                isLoading={profileLoading}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {userName}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  {profileData?.title || user?.role || "Role"}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {profileData?.company || "Company"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700" />

            <button
              onClick={handleMobileViewProfile}
              className="w-full text-left flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:bg-gray-700"
            >
              <HiOutlineUser className="w-4 h-4" />
              <span>View Profile</span>
            </button>

            <button
              onClick={handleMobileAuthAction}
              className="w-full text-left flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:bg-gray-700"
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
