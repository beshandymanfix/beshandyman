import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 w-full">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <img 
          src="/beshandyman.jpg" 
          alt="Bes Handyman Logo" 
          className="h-12 w-auto object-contain rounded-md" 
        />
        <div className="text-2xl font-extrabold tracking-tight text-[#D4AF37] hidden sm:block">
          Bes<span className="text-white">Handyman</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <a 
          href="mailto:brian@beshandyman.com" 
          className="hidden md:block font-medium text-zinc-300 hover:text-[#D4AF37] transition-colors"
        >
          brian@beshandyman.com
        </a>

        {/* Auth Buttons */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* Main Action Button based on Role */}
            {user.role === 'tasker' ? (
              <Link 
                to="/tasker-profile"
                className="px-4 py-2 text-sm font-bold text-zinc-950 bg-[#D4AF37] rounded hover:bg-[#C5A028] transition-colors"
              >
                Tasker Profile
              </Link>
            ) : (
              <Link 
                to="/"
                className="px-4 py-2 text-sm font-bold text-zinc-950 bg-[#D4AF37] rounded hover:bg-[#C5A028] transition-colors"
              >
                Hire a Pro
              </Link>
            )}

            {/* Secondary Links */}
            {user.role === 'guest' && (
              <Link to="/guest-profile" className="text-sm font-medium text-zinc-300 hover:text-[#D4AF37] transition-colors">
                Account
              </Link>
            )}
            
            <button 
              onClick={logoutHandler}
              className="text-sm font-medium text-zinc-300 hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link 
              to="/login"
              className="px-4 py-2 text-sm font-bold text-zinc-950 bg-[#D4AF37] rounded hover:bg-[#C5A028] transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register"
              className="px-4 py-2 text-sm font-bold text-[#D4AF37] border border-[#D4AF37] rounded hover:bg-[#D4AF37] hover:text-zinc-950 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
    </header>
  );
};

export default Header;