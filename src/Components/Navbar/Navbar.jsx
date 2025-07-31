import  { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="w-full bg-[#1E90FF] shadow-lg sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className='flex items-center justify-between h-16'>
          
          {/* Logo */}
          <div className='flex items-center'>
            <Link to="/" className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center'>
                <span className='text-[#1E90FF] font-bold text-sm'>CU</span>
              </div>
              <span className='text-white font-bold text-xl tracking-tight'>ConnectUni</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-4'>
            <Link
              to="/"
              className='text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group'
              style={{ 
                fontFamily: 'Public Sans', 
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '21px',
                letterSpacing: '0px'
              }}
            >
              Home
              <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full'></span>
            </Link>
            
            <Link 
              to="/projects" 
              className='text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group'
              style={{ 
                fontFamily: 'Public Sans', 
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '21px',
                letterSpacing: '0px'
              }}
            >
              Projects
              <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full'></span>
            </Link>
            
            <Link 
              to="/internships" 
              className='text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group'
              style={{ 
                fontFamily: 'Public Sans', 
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '21px',
                letterSpacing: '0px'
              }}
            >
              Internships
              <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full'></span>
            </Link>
            
            <Link 
              to="/about" 
              className='text-white hover:text-gray-200 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group'
              style={{ 
                fontFamily: 'Public Sans', 
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '21px',
                letterSpacing: '0px'
              }}
            >
              About Us
              <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full'></span>
            </Link>
            
            {/* Login Button */}
            <Link 
              to="/login"
              className='bg-[#E8EDF2] text-[#0D141C] px-6 py-2 rounded-full text-sm font-medium hover:bg-white hover:shadow-md transition-all duration-200 transform hover:scale-105'
              style={{ 
                fontFamily: 'Public Sans', 
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '21px',
                letterSpacing: '0px'
              }}
            >
              Login
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button 
              onClick={toggleMenu}
              className='text-white p-2 cursor-pointer duration-200'
              aria-label="Toggle menu"
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                {isMenuOpen ? (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 bg-[#1E90FF] border-t border-blue-400'>
              <Link 
                to="/"
                className='text-white block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200'
                style={{ 
                  fontFamily: 'Public Sans', 
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '21px',
                  letterSpacing: '0px'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link 
                to="/projects" 
                className='text-white block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200'
                style={{ 
                  fontFamily: 'Public Sans', 
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '21px',
                  letterSpacing: '0px'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              
              <Link 
                to="/internships" 
                className='text-white block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200'
                style={{ 
                  fontFamily: 'Public Sans', 
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '21px',
                  letterSpacing: '0px'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Internships
              </Link>
              
              <Link 
                to="/about" 
                className='text-white  block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200'
                style={{ 
                  fontFamily: 'Public Sans', 
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '21px',
                  letterSpacing: '0px'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              
              {/* Mobile Login Button */}
              <div className='pt-2'>
                <Link 
                  to="/login"
                  className='bg-[#E8EDF2] text-[#0D141C] block px-4 py-2 text-sm font-medium rounded-full hover:bg-white transition-colors duration-200 w-fit mx-3'
                  style={{ 
                    fontFamily: 'Public Sans', 
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '21px',
                    letterSpacing: '0px'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar