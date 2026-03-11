import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SkillGallery = ({ user, setUser }) => {
  const { id, skillName } = useParams();
  const decodedSkillName = decodeURIComponent(skillName);
  const [handyman, setHandyman] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editRate, setEditRate] = useState(0);
  const [editDesc, setEditDesc] = useState('');
  const [editYears, setEditYears] = useState('');
  const [editLevel, setEditLevel] = useState('Beginner');
  const [editImages, setEditImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    if (handyman) {
      setEditRate(handyman.skillRates?.[decodedSkillName] || handyman.hourlyRate || 50);
      setEditDesc(handyman.skillDescriptions?.[decodedSkillName] || '');
      setEditYears(handyman.skillYears?.[decodedSkillName] || '');
      setEditLevel(handyman.skillLevels?.[decodedSkillName] || 'Beginner');
      setEditImages(handyman.skillImages?.[decodedSkillName] || []);
    }
  }, [handyman, decodedSkillName]);

  const handleSave = async () => {
    try {
      const updatedRates = { ...handyman.skillRates, [decodedSkillName]: editRate };
      const updatedDescriptions = { ...handyman.skillDescriptions, [decodedSkillName]: editDesc };
      const updatedYears = { ...handyman.skillYears, [decodedSkillName]: editYears };
      const updatedLevels = { ...handyman.skillLevels, [decodedSkillName]: editLevel };
      const updatedImages = { ...handyman.skillImages, [decodedSkillName]: editImages };

      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          skillRates: updatedRates,
          skillDescriptions: updatedDescriptions,
          skillYears: updatedYears,
          skillLevels: updatedLevels,
          skillImages: updatedImages
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Skill updated successfully!');
        setHandyman({ ...handyman, ...data });
        // Note: The response data from PUT /profile might return merged/updated fields, but merging manually ensures UI reflects changes immediately if structure differs slightly.
        // Actually, updating the local handyman state with returned data is safer if the structure matches.
        // Since we are viewing "handyman" (which might be a public view structure), and data is "user" (private profile structure), 
        // we mostly care about the maps we just updated.
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Error updating skill');
      }
    } catch (err) {
      setMessage('Something went wrong');
    }
  };

  const uploadSkillImageHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.text();
        setEditImages([...editImages, data]);
        setUploading(false);
      } else {
        setUploading(false);
        setMessage('Image upload failed');
      }
    } catch (err) {
      setUploading(false);
      setMessage('Image upload failed');
    }
  };

  const handleDeleteImage = (indexToDelete) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      setEditImages(editImages.filter((_, index) => index !== indexToDelete));
    }
  };

  if (!handyman) {
    return <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">Loading...</div>;
  }

  const isOwner = user && handyman && user._id === handyman._id;
  const skillImages = handyman.skillImages && handyman.skillImages[decodedSkillName];
  const skillRate = handyman.skillRates && handyman.skillRates[decodedSkillName];
  const skillDesc = handyman.skillDescriptions && handyman.skillDescriptions[decodedSkillName];
  const skillYears = handyman.skillYears && handyman.skillYears[decodedSkillName];
  const skillLevel = handyman.skillLevels && handyman.skillLevels[decodedSkillName];
  const taskCount = handyman.skillCounts && handyman.skillCounts[decodedSkillName] || 0;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col justify-between">
      <Header user={user} setUser={setUser} />

      <div className="max-w-6xl mx-auto px-4 py-6 w-full">
        <Link to={`/handyman/${id}`} className="text-zinc-300 hover:text-[#D4AF37]">Back to Profile</Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12 w-full flex-grow">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{decodedSkillName}</h1>
            <p className="text-xl text-zinc-400">by <span className="text-[#D4AF37]">{handyman.name}</span></p>
          </div>
          {isOwner && (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-700"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Skill Details'}
            </button>
          )}
        </div>

        {message && <p className="text-green-500 mb-6 text-center">{message}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex items-center justify-center">
                <div className="w-full">
                  <h3 className="text-xl font-bold text-white mb-4">Proof of Work</h3>
                  {editImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {editImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img src={img} alt={`${decodedSkillName} work ${index + 1}`} className="w-full h-32 rounded-lg object-cover" />
                          {isEditing && (
                            <button
                              onClick={() => handleDeleteImage(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs shadow-sm hover:bg-red-700 transition-colors"
                              title="Delete Image"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                      <div className="w-full h-32 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 flex-col gap-2">
                          <span className="text-4xl">🛠️</span>
                          <span>No images uploaded for this skill</span>
                      </div>
                  )}
                  {isEditing && (
                    <div className="mt-4">
                      <label className="block text-zinc-400 text-sm mb-1">Upload Image</label>
                      <input type="file" onChange={uploadSkillImageHandler} className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-zinc-950 hover:file:bg-[#C5A028] cursor-pointer" />
                      {uploading && <p className="text-sm text-[#D4AF37] animate-pulse mt-2">Uploading...</p>}
                    </div>
                  )}
                </div>
            </div>
            <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Details</h3>
                    
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-zinc-400 text-sm mb-1">Hourly Rate ($)</label>
                          <input 
                            type="number" 
                            value={editRate} 
                            onChange={(e) => setEditRate(e.target.value)}
                            className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded text-white focus:border-[#D4AF37] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-400 text-sm mb-1">Years of Experience</label>
                          <select 
                            value={editYears} 
                            onChange={(e) => setEditYears(e.target.value)}
                            className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded text-white focus:border-[#D4AF37] outline-none"
                          >
                            <option value="">Select Experience</option>
                            <option value="Less than 1 year">Less than 1 year</option>
                            <option value="1-3 years">1-3 years</option>
                            <option value="3-5 years">3-5 years</option>
                            <option value="5-10 years">5-10 years</option>
                            <option value="10+ years">10+ years</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-zinc-400 text-sm mb-1">Expertise Level</label>
                          <select 
                            value={editLevel} 
                            onChange={(e) => setEditLevel(e.target.value)}
                            className="w-full p-2 bg-zinc-950 border border-zinc-700 rounded text-white focus:border-[#D4AF37] outline-none"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                        <button onClick={handleSave} className="w-full bg-[#D4AF37] text-zinc-950 font-bold py-2 rounded mt-2 hover:bg-[#C5A028]">
                          Save Changes
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                            <span className="text-zinc-400">Hourly Rate</span>
                            <span className="text-[#D4AF37] font-bold text-xl">${skillRate || handyman.hourlyRate || 50}/hr</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                            <span className="text-zinc-400">Experience</span>
                            <span className="text-white">{skillYears || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                            <span className="text-zinc-400">Level</span>
                            <span className="text-white">{skillLevel || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Tasks Completed</span>
                            <span className="text-white font-bold">{taskCount}</span>
                        </div>
                      </div>
                    )}
                </div>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Skill Description</h3>
                    {isEditing ? (
                      <textarea 
                        rows="5"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full p-3 bg-zinc-950 border border-zinc-700 rounded text-white focus:border-[#D4AF37] outline-none"
                        placeholder={`Describe your experience with ${decodedSkillName}...`}
                      />
                    ) : (
                      <p className="text-zinc-300 leading-relaxed">
                          {skillDesc || (
                            <>
                              {handyman.name} is experienced in {decodedSkillName.toLowerCase()}. 
                              {handyman.aboutMe ? ` ${handyman.aboutMe}` : ''}
                            </>
                          )}
                      </p>
                    )}
                </div>
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SkillGallery;