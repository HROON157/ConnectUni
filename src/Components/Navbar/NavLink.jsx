import React from "react";
import { Link } from "react-router-dom";
import { textStyles } from "../../data/navData";

const NavLink = ({ to, children, mobile = false, isLogin = false, onClick }) => {
  const baseClasses = mobile
    ? "text-white block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
    : "text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group";

  const loginClasses = isLogin
    ? mobile
      ? "bg-[#E8EDF2] text-[#0D141C] block px-4 py-2 text-sm font-medium rounded-full hover:bg-white transition-colors duration-200 w-fit mx-3"
      : "bg-[#E8EDF2] text-[#0D141C] px-4 py-1 rounded-3xl text-sm font-medium hover:bg-white hover:shadow-md transition-all duration-200 transform hover:scale-105"
    : baseClasses;

  return (
    <Link
      to={to}
      className={loginClasses}
      style={textStyles}
      onClick={onClick}
    >
      {children}
      {!mobile && !isLogin && (
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full"></span>
      )}
    </Link>
  );
};

export default React.memo(NavLink);
