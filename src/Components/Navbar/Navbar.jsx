import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import NavLink from "./NavLink";
import { navItems } from "../../data/navData";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="w-full bg-[#1E90FF] shadow-lg sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#1E90FF] font-bold text-sm">CU</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              ConnectUni
            </span>
          </Link>

          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map(({ path, label }) => (
              <NavLink key={path} to={path}>
                {label}
              </NavLink>
            ))}
            <NavLink to="/login" isLogin>
              Login
            </NavLink>
          </div>

        
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white p-2 cursor-pointer duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

      
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#1E90FF] border-t border-blue-400">
              {navItems.map(({ path, label }) => (
                <NavLink key={path} to={path} mobile onClick={closeMenu}>
                  {label}
                </NavLink>
              ))}
              <div className="pt-2">
                <NavLink to="/login" mobile isLogin onClick={closeMenu}>
                  Login
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
