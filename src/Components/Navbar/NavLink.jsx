import React from "react";
import { Link } from "react-router-dom";

const NavLink = ({ to, children, mobile = false, onClick }) => {
  const baseClasses = mobile
    ? "text-gray-200 hover:text-white block px-3 py-2 text-base hover:bg-transparent font-medium rounded-md transition-all duration-200 hover:bg-gray-800 relative group"
    : "text-gray-200 hover:text-white px-3 py-2 text-sm hover:bg-transparent font-medium transition-all duration-200 relative group";

  return (
    <Link
      to={to}
      className={baseClasses}
      onClick={onClick}
    >
      {children}
      <span className={`absolute ${mobile ? 'bottom-1' : 'bottom-0'} left-0 w-0 h-0.5 hover:bg-transparent bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 group-hover:w-full`}></span>
    </Link>
  );
};

export default React.memo(NavLink);