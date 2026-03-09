import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const HandymanProfile = () => {
  const { id } = useParams();
  const [handyman, setHandyman] = useState(null);

  useEffect(() => {
    const fetchHandyman = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        const data = await res.json();
        setHandyman(data);
      } catch (err) {
        console.error("Failed to fetch handyman profile", err);
      }
    };
    fetchHandyman();
  }, [id]);

  if (!handyman) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
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
        <Link to="/" className="text-zinc-300 hover:text-[#D4AF37]">Back to Home</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#D4AF37] flex-shrink-0 mx-auto md:mx-0">
              <img src={handyman.profileImage || "/brian.jpg"} alt={handyman.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">{handyman.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-500 mb-4">
                <span className="text-xl">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(handyman.averageRating || 0) ? "text-yellow-500" : "text-zinc-600"}>★</span>
                  ))}
                </span>
                <span className="text-zinc-400 text-sm">({handyman.totalReviews || 0} Reviews)</span>
              </div>
              <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                {/* Fallback description if none exists in DB yet */}
                I am a skilled professional serving the {handyman.city || 'local'} area. I bring engineering precision and the right tools to get your job done correctly the first time.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 bg-zinc-800 rounded-full text-sm text-[#D4AF37] border border-zinc-700">
                  ID Verified
                </span>
                <span className="px-4 py-2 bg-zinc-800 rounded-full text-sm text-[#D4AF37] border border-zinc-700">
                  Background Checked
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center">
                <div className="text-3xl font-bold text-white mb-1">$65<span className="text-sm text-zinc-500 font-normal">/hr</span></div>
                <button className="w-full mt-4 bg-[#D4AF37] text-zinc-950 font-bold px-8 py-3 rounded-lg hover:bg-[#C5A028] transition-colors">
                  Select & Book
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Skills & Experience</h2>
              {handyman.skills && handyman.skills.length > 0 ? (
                <div className="space-y-4">
                  {handyman.skills.map((skill, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                      <div className="text-2xl">🛠️</div>
                      <div>
                        <h3 className="font-bold text-[#D4AF37]">{skill}</h3>
                        <p className="text-sm text-zinc-400 mt-1">
                          Experienced in {skill.toLowerCase()}. Equipped with professional tools and ready to assist.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500">No specific skills listed.</p>
              )}
            </div>
          </div>

          {/* Sidebar / Additional Info could go here */}
        </div>
      </div>
    </div>
  );
};

export default HandymanProfile;