import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

export default function CityHome({ user, setUser }) {
  const { cityName } = useParams();
  const location = useLocation();
  const [handymen, setHandymen] = useState([]);
  const [expandedHandymanId, setExpandedHandymanId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(location.state?.date || '');
  const [selectedTime, setSelectedTime] = useState(location.state?.time || '');
  const selectedService = location.state?.service;

  useEffect(() => {
    const fetchHandymen = async () => {
      try {
        let url = `http://localhost:5000/api/users?city=${encodeURIComponent(cityName)}`;
        if (selectedService) {
          url += `&skill=${encodeURIComponent(selectedService)}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setHandymen(data);
      } catch (err) {
        console.error("Failed to fetch handymen", err);
      }
    };
    fetchHandymen();
  }, [cityName, selectedService]);

  // Sort handymen: Current user first, then others
  const sortedHandymen = [...handymen].sort((a, b) => {
    if (user && a._id === user._id) return -1;
    if (user && b._id === user._id) return 1;
    // Secondary sort by rating could go here
    return (b.averageRating || 0) - (a.averageRating || 0);
  });

  // Helper to format name for privacy (e.g. "Brian V.")
  const formatPrivacyName = (handyman) => {
    if (handyman.firstName && handyman.lastName) {
      return `${handyman.firstName} ${handyman.lastName.charAt(0)}.`;
    }
    if (handyman.name) {
      const parts = handyman.name.trim().split(/\s+/);
      return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1].charAt(0)}.` : handyman.name;
    }
    return 'Tasker';
  };

  // Local SEO Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": `Bes Handyman ${cityName}`,
    "image": "https://beshandyman.com/beshandyman.jpg",
    "url": `https://beshandyman.com/city/${cityName}`,
    "telephone": "+1-210-693-1422",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    "areaServed": [cityName],
    "founder": {
      "@type": "Person",
      "name": "Brian"
    },
    "description": `Professional home repairs, mounting, electrical, and smart home tech serving the ${cityName} area.`
  };

  return (
    <main className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      {/* Invisible SEO Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <img 
            src="/beshandyman.jpg" 
            alt="Bes Handyman Logo" 
            className="h-12 w-auto object-contain rounded-md" 
          />
          <div className="text-2xl font-extrabold tracking-tight text-[#D4AF37] hidden sm:block">
            Bes<span className="text-white">Handyman</span> <span className="text-zinc-500 text-lg font-normal">| {cityName}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:block font-medium text-zinc-300">
                Welcome, <span className="text-[#D4AF37]">{user.name}</span>
              </span>
              <Link 
                to={user.role === 'tasker' ? "/tasker-profile" : "/guest-profile"}
                className="px-4 py-2 text-sm font-bold text-zinc-950 bg-[#D4AF37] rounded hover:bg-[#C5A028] transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('userInfo');
                  setUser(null);
                }}
                className="px-4 py-2 text-sm font-bold text-white border border-zinc-700 rounded hover:bg-zinc-800 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <a href="mailto:brian@beshandyman.com" className="hidden md:block font-medium text-zinc-300 hover:text-[#D4AF37] transition-colors">
                brian@beshandyman.com
              </a>
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

      {/* Booking & Profile Section */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <div className="flex flex-col gap-8">
          
          {/* Left Column: Handyman List */}
          <div className="w-full">
            <h1 className="text-3xl font-bold mb-6 text-white">
              Select a BesHandyman {selectedService ? `for ${selectedService}` : ''} in {cityName}
            </h1>
            
            {sortedHandymen.length > 0 ? (
              <div className="space-y-6">
                {sortedHandymen.map((handyman) => (
                  <div key={handyman._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row gap-6">
                    {/* Avatar Column */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#D4AF37] mb-4">
                        <img src={handyman.profileImage || "/brian.jpg"} alt={handyman.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[#D4AF37] font-bold text-xl">$65/hr</div>
                    </div>

                    {/* Info Column */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                          <Link to={`/handyman/${handyman._id}`} className="hover:underline decoration-[#D4AF37]">
                            <h2 className="text-2xl font-bold text-white">{formatPrivacyName(handyman)}</h2>
                          </Link>
                          <div className="flex items-center gap-1 text-yellow-500 my-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.round(handyman.averageRating || 0) ? "text-yellow-500" : "text-zinc-600"}>★</span>
                            ))}
                            <span className="text-zinc-400 text-sm ml-2">({handyman.totalReviews || 0} Reviews)</span>
                          </div>
                          <div className="text-zinc-400 text-sm mb-4">
                            100% Reliable • ID Verified • {selectedService ? `${handyman.taskCount || 0} ${selectedService} Tasks` : `${handyman.totalReviews || 0} Tasks Completed`}
                          </div>
                          {/* Skills in Info Column */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {handyman.skills && handyman.skills.slice(0, 3).map((skill, i) => (
                              <span key={i} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700">{skill}</span>
                            ))}
                            {handyman.skills && handyman.skills.length > 3 && (
                              <span className="text-xs text-zinc-500 py-1">+{handyman.skills.length - 3} more</span>
                            )}
                          </div>
                        </div>
                        <button className="bg-[#D4AF37] text-zinc-950 font-bold px-6 py-2 rounded-lg hover:bg-[#C5A028] transition-colors">
                          Select & Book
                        </button>
                      </div>

                      <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800 mb-4">
                        <h3 className="font-bold text-white mb-2">How I can help:</h3>
                        <p className="text-zinc-300 text-sm leading-relaxed">
                          I am a skilled professional serving the {cityName} area. I have experience in {handyman.skills.join(', ')}. I bring the right tools and attitude to get your job done.
                        </p>
                        <div className="flex gap-4 mt-2">
                          <button 
                            onClick={() => setExpandedHandymanId(expandedHandymanId === handyman._id ? null : handyman._id)}
                            className="text-[#D4AF37] text-sm font-bold hover:underline focus:outline-none"
                          >
                            {expandedHandymanId === handyman._id ? "Hide Skills" : "View Skills & Experience"}
                          </button>
                        </div>
                        
                        {expandedHandymanId === handyman._id && (
                          <div className="mt-3 pt-3 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-400">
                            {handyman.skills && handyman.skills.length > 0 ? (
                              handyman.skills.map((skill, index) => <span key={index}>• {skill}</span>)
                            ) : (
                              <span>No specific skills listed.</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800">
                <p className="text-xl text-zinc-400">No handymen found for <span className="text-[#D4AF37]">{selectedService || 'this service'}</span> in {cityName}.</p>
                <p className="text-sm text-zinc-500 mt-2">Try selecting a different service or check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-zinc-500 py-12 px-8 text-center border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-2xl font-bold text-[#D4AF37] mb-4">Bes<span className="text-white">Handyman</span></div>
          <p className="mb-4">Reliable home repair for {cityName} and beyond.</p>
          <p className="text-sm">© {new Date().getFullYear()} Bes Handyman. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}