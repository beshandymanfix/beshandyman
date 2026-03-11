import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ALL_SERVICES = [
  "Furniture Assembly",
  "Home Cleaning",
  "Home Repair",
  "TV Mounting",
  "Electrical Help",
  "Painting",
  "General Mounting",
  "Help Moving",
  "Yardwork Service"
];

const HandymanProfile = ({ user, setUser }) => {
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

  // Helper to format name for privacy (e.g. "Brian V.")
  const formatPrivacyName = (hm) => {
    if (hm.firstName && hm.lastName) {
      return `${hm.firstName} ${hm.lastName.charAt(0)}.`;
    }
    if (hm.name) {
      const parts = hm.name.trim().split(/\s+/);
      return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1].charAt(0)}.` : hm.name;
    }
    return 'Tasker';
  };

  // Helper to format city name (e.g. "san antonio" -> "San Antonio")
  const formatCity = (city) => {
    if (!city) return '';
    return city.toLowerCase().split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      {/* Navigation */}
      <Header user={user} setUser={setUser} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#D4AF37] flex-shrink-0 mx-auto md:mx-0">
              <img src={handyman.profileImage || "/beshandyman.jpg"} alt={handyman.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2 justify-center md:justify-start">
                <h1 className="text-4xl font-bold text-white">{handyman.name}</h1>
                {handyman.isVerified && (
                  <span className="bg-green-900/30 text-green-400 border border-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    ✓ Verified Tasker
                  </span>
                )}
              </div>
              {handyman.firstName && handyman.lastName && (
                <p className="text-lg text-zinc-400 -mt-2 mb-2 text-center md:text-left">{handyman.firstName} {handyman.lastName}</p>
              )}
              {handyman.city && (
                <div className="text-zinc-400 font-medium mb-4 flex items-center justify-center md:justify-start gap-1">📍 {formatCity(handyman.city)}</div>
              )}
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
                {handyman.aboutMe || `I am a skilled professional serving the ${formatCity(handyman.city) || 'local'} area. I bring engineering precision and the right tools to get your job done correctly the first time.`}
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
                <div className="text-3xl font-bold text-white mb-1">${handyman.hourlyRate || 50}<span className="text-sm text-zinc-500 font-normal">/hr</span></div>
                {user && user._id === handyman._id ? (
                  <Link to="/tasker-profile" className="block w-full mt-4 bg-zinc-800 text-white font-bold px-8 py-3 rounded-lg hover:bg-zinc-700 transition-colors text-center">
                    Edit Profile
                  </Link>
                ) : (
                  <button className="w-full mt-4 bg-[#D4AF37] text-zinc-950 font-bold px-8 py-3 rounded-lg hover:bg-[#C5A028] transition-colors">
                    Select & Book
                  </button>
                )}
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
                    <Link key={index} to={`/handyman/${handyman._id}/skill/${encodeURIComponent(skill)}`} className="block hover:bg-zinc-800/30 transition-colors rounded-xl">
                      <div className="flex items-start gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
                        <div className="flex-shrink-0">
                          {handyman.skillImages && handyman.skillImages[skill] && handyman.skillImages[skill].length > 0 ? (
                            <img 
                              src={handyman.skillImages[skill][0]} 
                              alt={skill} 
                              className="w-20 h-20 rounded-lg object-cover border border-zinc-700"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-lg bg-zinc-900 flex items-center justify-center text-3xl border border-zinc-800">
                              🛠️
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-[#D4AF37] text-lg">{skill}</h3>
                            {handyman.skillRates && handyman.skillRates[skill] && (
                              <span className="text-zinc-100 font-bold bg-zinc-800 px-3 py-1 rounded-full text-sm border border-zinc-700">
                                ${handyman.skillRates[skill]}/hr
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                            Experienced in {skill.toLowerCase()}. Equipped with professional tools and ready to assist.
                          </p>
                          <p className="text-xs text-[#D4AF37] mt-2 font-medium">
                            {handyman.skillCounts && handyman.skillCounts[skill] ? `${handyman.skillCounts[skill]} tasks completed` : 'New to this skill'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500">No specific skills listed.</p>
              )}
            </div>
          </div>

          {/* Sidebar / Additional Info could go here */}
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Client Reviews ({handyman.totalReviews || 0})</h2>
          {handyman.reviews && handyman.reviews.length > 0 ? (
            <div className="space-y-6">
              {handyman.reviews.map((review) => (
                <div key={review._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#D4AF37] font-bold border border-zinc-700">
                      {review.clientName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{review.clientName}</div>
                      <div className="flex gap-1 text-yellow-500 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-500" : "text-zinc-600"}>★</span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-auto text-zinc-500 text-xs">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                  <div className="mt-2 text-xs text-[#D4AF37] font-medium">
                    Service: {review.service}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">No reviews yet.</p>
          )}
        </div>

        {/* Service Availability Grid (Can Do vs Can't Do) */}
        <div className="mt-12 pt-12 border-t border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-6">Service Availability</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_SERVICES.map(service => {
              const isOffered = handyman.skills && handyman.skills.includes(service);
              // Use specific skill rate if available, otherwise fallback to base hourly rate
              const rate = (handyman.skillRates && handyman.skillRates[service]) || handyman.hourlyRate || 50;
              
              return (
                <div key={service} className={`p-4 rounded-xl border flex flex-col justify-between h-full ${isOffered ? 'bg-zinc-900 border-zinc-700' : 'bg-zinc-950/30 border-zinc-800/50 opacity-60'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isOffered ? 'text-zinc-200' : 'text-zinc-500'}`}>{service}</span>
                    {isOffered ? (
                      <span className="text-green-500 text-lg">✓</span>
                    ) : (
                      <span className="text-red-900 text-lg">✗</span>
                    )}
                  </div>
                  {isOffered ? (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800">
                      <span className="text-xs text-zinc-400">Rate</span>
                      <span className="text-[#D4AF37] font-bold">${rate}/hr</span>
                    </div>
                  ) : (
                    <div className="mt-2 pt-2 border-t border-zinc-800/50">
                      <span className="text-xs text-zinc-600 italic">Not available</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HandymanProfile;