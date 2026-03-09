import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SanAntonioHome({ user }) {
  const location = useLocation();
  const [handymen, setHandymen] = useState([]);
  const [expandedHandymanId, setExpandedHandymanId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const selectedService = location.state?.service;

  useEffect(() => {
    const fetchHandymen = async () => {
      try {
        let url = `http://localhost:5000/api/users?city=San Antonio`;
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
  }, [selectedService]);

  // Local SEO Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Bes Handyman",
    "image": "https://beshandyman.com/beshandyman.jpg",
    "url": "https://beshandyman.com",
    "telephone": "+1-210-693-1422",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Antonio",
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    "areaServed": [
      "San Antonio",
      "Timberwood Park",
      "Kyle",
      "Austin"
    ],
    "founder": {
      "@type": "Person",
      "name": "Brian"
    },
    "description": "Professional home repairs, mounting, electrical, and smart home tech serving the greater San Antonio area."
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
            Bes<span className="text-white">Handyman</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <span className="hidden md:block font-medium text-zinc-300">
              Welcome, <span className="text-[#D4AF37]">{user.name}</span>
            </span>
          ) : (
            <a 
              href="mailto:brian@beshandyman.com" 
              className="hidden md:block font-medium text-zinc-300 hover:text-[#D4AF37] transition-colors"
            >
              brian@beshandyman.com
            </a>
          )}

          {/* Auth Buttons */}
          {user ? (
            <Link 
              to="/profile"
              className="px-4 py-2 text-sm font-bold text-zinc-950 bg-[#D4AF37] rounded hover:bg-[#C5A028] transition-colors"
            >
              Profile
            </Link>
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

      {/* Booking & Profile Section */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Handyman Profile */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold mb-6 text-white">
              Select a BesHandyman {selectedService ? `for ${selectedService}` : ''}
            </h1>
            
            {handymen.length > 0 ? (
              <div className="space-y-6">
                {handymen.map((handyman) => (
                  <div key={handyman._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row gap-6">
                    {/* Avatar Column */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#D4AF37] mb-4">
                        <img src="/brian.jpg" alt={handyman.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[#D4AF37] font-bold text-xl">$65/hr</div>
                    </div>

                    {/* Info Column */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start flex-wrap gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-white">{handyman.name}</h2>
                          <div className="flex items-center gap-1 text-yellow-500 my-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.round(handyman.averageRating || 0) ? "text-yellow-500" : "text-zinc-600"}>★</span>
                            ))}
                            <span className="text-zinc-400 text-sm ml-2">({handyman.totalReviews || 0} Reviews)</span>
                          </div>
                          <div className="text-zinc-400 text-sm mb-4">
                            100% Reliable • ID Verified • {selectedService ? `${handyman.taskCount || 0} ${selectedService} Tasks` : `${handyman.totalReviews || 0} Tasks Completed`}
                          </div>
                        </div>
                        <button className="bg-[#D4AF37] text-zinc-950 font-bold px-6 py-2 rounded-lg hover:bg-[#C5A028] transition-colors">
                          Select & Book
                        </button>
                      </div>

                      <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-800 mb-4">
                        <h3 className="font-bold text-white mb-2">How I can help:</h3>
                        <p className="text-zinc-300 text-sm leading-relaxed">
                          I am a skilled professional serving the San Antonio area. I have experience in {handyman.skills.join(', ')}. I bring the right tools and attitude to get your job done.
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
                <p className="text-xl text-zinc-400">No handymen found for <span className="text-[#D4AF37]">{selectedService || 'this service'}</span> in San Antonio.</p>
                <p className="text-sm text-zinc-500 mt-2">Try selecting a different service or check back later.</p>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full lg:w-1/3 flex-shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl sticky top-8">
              <h3 className="text-xl font-bold text-white mb-4">Task Options</h3>
              
              {/* Date Selection */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">Date</h4>
                <div className="flex flex-wrap gap-2">
                  {['Today', 'Within 3 Days', 'Within a Week'].map(date => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        selectedDate === date 
                        ? 'bg-[#D4AF37] text-zinc-950 border-[#D4AF37]' 
                        : 'bg-transparent text-zinc-300 border-zinc-700 hover:border-[#D4AF37]'
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">Time of Day</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Morning', time: '8am - 12pm' },
                    { label: 'Afternoon', time: '12pm - 5pm' },
                    { label: 'Evening', time: '5pm - 9:30pm' }
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => setSelectedTime(item.label)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium border flex justify-between items-center transition-all ${
                        selectedTime === item.label
                        ? 'bg-[#D4AF37] text-zinc-950 border-[#D4AF37]' 
                        : 'bg-transparent text-zinc-300 border-zinc-700 hover:border-[#D4AF37]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="opacity-70 text-xs">{item.time}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Box */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-start gap-3">
                <div className="text-2xl">🛡️</div>
                <div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-1">
                    <strong>Always have peace of mind.</strong> All BesHandyman taskers undergo ID and criminal background checks.
                  </p>
                  <a href="#" className="text-[#D4AF37] text-xs font-bold hover:underline">Learn more</a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-zinc-900 py-20 px-8 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Everything You Need Done Right.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* TV Mounting */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">📺</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">TV & General Mounting</h3>
              <p className="text-zinc-400">Perfectly leveled, securely anchored TVs, shelves, mirrors, and art installations.</p>
            </div>

            {/* Electrical & Tech */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Light Electrical & Tech</h3>
              <p className="text-zinc-400">Low voltage wiring, fixture swapping, and smart home device installation.</p>
            </div>

            {/* Drywall */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">🧱</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Drywall Repair</h3>
              <p className="text-zinc-400">Seamless patching, texturing, painting, and hardware repair for your walls.</p>
            </div>

            {/* Gutter Cleaning */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">🍂</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Gutter Cleaning</h3>
              <p className="text-zinc-400">Complete debris removal and downspout flushing to protect your home's foundation.</p>
            </div>

            {/* Window Cleaning */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Window Cleaning</h3>
              <p className="text-zinc-400">Streak-free interior and exterior window washing for a crystal-clear view.</p>
            </div>

            {/* Deck & Fence */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">🪵</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Deck & Fence Staining</h3>
              <p className="text-zinc-400">Wood repair, power washing, and professional staining to restore your exterior spaces.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-zinc-500 py-12 px-8 text-center border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-2xl font-bold text-[#D4AF37] mb-4">Bes<span className="text-white">Handyman</span></div>
          <p className="mb-4">Reliable home repair for San Antonio, Austin, Kyle, and beyond.</p>
          <p className="text-sm">© {new Date().getFullYear()} Bes Handyman. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
