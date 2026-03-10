import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const SkillGallery = () => {
  const { id, skillName } = useParams();
  const decodedSkillName = decodeURIComponent(skillName);
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

  const skillImage = handyman.skillImages && handyman.skillImages[decodedSkillName];
  const skillRate = handyman.skillRates && handyman.skillRates[decodedSkillName];
  const taskCount = handyman.skillCounts && handyman.skillCounts[decodedSkillName] || 0;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <img src="/beshandyman.jpg" alt="Bes Handyman Logo" className="h-12 w-auto object-contain rounded-md" />
          <div className="text-2xl font-extrabold tracking-tight text-[#D4AF37] hidden sm:block">
            Bes<span className="text-white">Handyman</span>
          </div>
        </div>
        <Link to={`/handyman/${id}`} className="text-zinc-300 hover:text-[#D4AF37]">Back to Profile</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-2">{decodedSkillName}</h1>
        <p className="text-xl text-zinc-400 mb-8">by <span className="text-[#D4AF37]">{handyman.name}</span></p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex items-center justify-center">
                {skillImage ? (
                    <img src={skillImage} alt={decodedSkillName} className="w-full h-auto rounded-lg object-cover" />
                ) : (
                    <div className="w-full h-64 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 flex-col gap-2">
                        <span className="text-4xl">🛠️</span>
                        <span>No image available for this skill</span>
                    </div>
                )}
            </div>
            <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Details</h3>
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-4">
                        <span className="text-zinc-400">Hourly Rate</span>
                        <span className="text-[#D4AF37] font-bold text-xl">${skillRate || handyman.hourlyRate || 50}/hr</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Tasks Completed</span>
                        <span className="text-white font-bold">{taskCount}</span>
                    </div>
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Description</h3>
                    <p className="text-zinc-300 leading-relaxed">
                        {handyman.name} is experienced in {decodedSkillName.toLowerCase()}. 
                        {handyman.description ? ` ${handyman.description}` : ''}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGallery;