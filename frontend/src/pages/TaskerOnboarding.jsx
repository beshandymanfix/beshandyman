import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const CITIES_BY_STATE = {
  "Texas": ["San Antonio", "Austin", "New Braunfels", "Kyle", "Buda", "San Marcos", "Houston", "Dallas", "Fort Worth", "El Paso"],
  "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
  "New York": ["New York City", "Buffalo", "Rochester"],
  "default": ["Major City 1", "Major City 2", "Other"]
};

const TaskerOnboarding = ({ user, setUser }) => {
  const [step, setStep] = useState(1);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [hourlyRate, setHourlyRate] = useState(20);
  const [skillRates, setSkillRates] = useState({});
  const [aboutMe, setAboutMe] = useState('');
  const [safetyAck, setSafetyAck] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setState(user.state || '');
      setCity(user.city || '');
      setDriverLicense(user.driverLicense || '');
      setHourlyRate(user.hourlyRate || 20);
      setSkillRates(user.skillRates || {});
      setAboutMe(user.aboutMe || '');
      setGallery(user.gallery || []);
    }
  }, [user]);

  const getCities = (selectedState) => {
    return CITIES_BY_STATE[selectedState] || CITIES_BY_STATE["default"];
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
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
        setDriverLicense(data);
        setUploading(false);
      } else {
        setUploading(false);
        alert('Image upload failed');
      }
    } catch (err) {
      setUploading(false);
      alert('Image upload failed');
    }
  };

  const uploadGalleryHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploadingGallery(true);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.text();
        setGallery([...gallery, data]);
        setUploadingGallery(false);
      } else {
        setUploadingGallery(false);
        alert('Gallery upload failed');
      }
    } catch (err) {
      setUploadingGallery(false);
      alert('Gallery upload failed');
    }
  };

  const handleSkillRateChange = (skill, rate) => {
    setSkillRates({ ...skillRates, [skill]: rate });
  };

  const submitHandler = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ 
          state, 
          city, 
          driverLicense, 
          hourlyRate, 
          skillRates,
          aboutMe,
          gallery,
          isVerified: true // Simulating verification for now
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        setStep(4); // Go to Congrats step
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 text-sm font-bold text-zinc-500">
          <span className={step >= 1 ? "text-[#D4AF37]" : ""}>1. Location</span>
          <span className={step >= 2 ? "text-[#D4AF37]" : ""}>2. Verification</span>
          <span className={step >= 3 ? "text-[#D4AF37]" : ""}>3. Rates & Training</span>
          <span className={step >= 4 ? "text-[#D4AF37]" : ""}>4. Done</span>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Where do you want to work?</h2>
            <p className="text-zinc-400 mb-6">Select your primary location to get started.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-zinc-400 mb-2 text-sm">State</label>
                <select
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                  value={state}
                  onChange={(e) => { setState(e.target.value); setCity(''); }}
                >
                  <option value="" disabled>Select State</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-zinc-400 mb-2 text-sm">Preferred City</label>
                <select
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!state}
                >
                  <option value="" disabled>Select City</option>
                  {state && getCities(state).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <button 
              onClick={() => setStep(2)} 
              disabled={!city}
              className="w-full mt-8 bg-[#D4AF37] text-zinc-950 font-bold p-3 rounded hover:bg-[#C5A028] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Verification
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Identity Verification</h2>
            <p className="text-zinc-400 mb-6">To ensure trust and safety, please upload a valid Driver's License.</p>
            
            <div className="mb-6">
              <label className="block text-zinc-400 mb-2 text-sm">Driver's License Upload</label>
              <div className="flex flex-col items-center gap-4 border-2 border-dashed border-zinc-700 rounded-xl p-8">
                {driverLicense ? (
                  <img src={driverLicense} alt="License" className="h-40 object-contain" />
                ) : (
                  <div className="text-4xl">🆔</div>
                )}
                <input
                  type="file"
                  onChange={uploadFileHandler}
                  className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-zinc-950 hover:file:bg-[#C5A028] cursor-pointer"
                />
                {uploading && <p className="text-sm text-[#D4AF37] animate-pulse">Uploading...</p>}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 bg-zinc-800 text-white font-bold p-3 rounded hover:bg-zinc-700">Back</button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!driverLicense}
                className="flex-1 bg-[#D4AF37] text-zinc-950 font-bold p-3 rounded hover:bg-[#C5A028] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Training & Rates
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Professional Training & Rates</h2>
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 mb-6">
              <h3 className="font-bold text-[#D4AF37] mb-2">🎓 Quick Training Tip</h3>
              <p className="text-sm text-zinc-400">Always arrive 5 minutes early and bring your own tools. Professionalism earns you 5-star reviews!</p>
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer bg-zinc-950 p-4 rounded border border-zinc-800 hover:border-[#D4AF37] transition-colors">
                <input 
                  type="checkbox" 
                  className="mt-1 w-5 h-5 accent-[#D4AF37]"
                  checked={safetyAck}
                  onChange={(e) => setSafetyAck(e.target.checked)}
                />
                <span className="text-sm text-zinc-300">
                  I acknowledge that <strong>safety is the top priority</strong>. I will perform all tasks safely, use appropriate protective gear, and ensure a safe environment for myself and the client.
                </span>
              </label>
            </div>

            <div className="mb-6">
              <label className="block text-zinc-400 mb-2 text-sm">Base Hourly Rate ($)</label>
              <input
                type="number"
                min="1"
                max="100"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37] text-xl font-bold"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>

            {user.skills && user.skills.length > 0 && (
              <div className="mb-6">
                <label className="block text-zinc-400 mb-2 text-sm">Adjust Rate per Skill (Optional)</label>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {user.skills.map(skill => (
                    <div key={skill} className="flex items-center justify-between bg-zinc-950 p-3 rounded border border-zinc-800">
                      <span className="text-sm text-white">{skill}</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        placeholder={hourlyRate}
                        className="w-24 p-2 bg-zinc-900 border border-zinc-700 rounded text-white text-right focus:outline-none focus:border-[#D4AF37]"
                        value={skillRates[skill] || ''}
                        onChange={(e) => handleSkillRateChange(skill, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-zinc-400 mb-2 text-sm">About You</label>
              <textarea
                rows="4"
                placeholder="Describe your experience, skills, and what makes you impressive to clients..."
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </div>

            <div className="mb-8">
              <label className="block text-zinc-400 mb-2 text-sm">Work Gallery (Images & Videos)</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {gallery.map((url, index) => (
                  <div key={index} className="relative aspect-square bg-zinc-950 rounded overflow-hidden border border-zinc-800">
                    {url.match(/\.(mp4|mov)$/i) ? (
                      <video src={url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={url} alt="Work" className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center aspect-square bg-zinc-950 border-2 border-dashed border-zinc-800 rounded cursor-pointer hover:border-[#D4AF37] transition-colors">
                  <span className="text-2xl mb-1">+</span>
                  <span className="text-xs text-zinc-500">Add Media</span>
                  <input 
                    type="file" 
                    onChange={uploadGalleryHandler} 
                    className="hidden" 
                    accept="image/jpeg,image/png,video/mp4,video/quicktime"
                  />
                </label>
              </div>
              {uploadingGallery && <p className="text-xs text-[#D4AF37] animate-pulse">Uploading media...</p>}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 bg-zinc-800 text-white font-bold p-3 rounded hover:bg-zinc-700">Back</button>
              <button 
                onClick={submitHandler} 
                disabled={!safetyAck || !aboutMe}
                className="flex-1 bg-[#D4AF37] text-zinc-950 font-bold p-3 rounded hover:bg-[#C5A028] disabled:opacity-50 disabled:cursor-not-allowed">
                Complete Registration
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-4">Congratulations!</h2>
            <p className="text-xl text-zinc-400 mb-8">
              You are now a verified BesHandyman Tasker. You can now start accepting jobs in {city}.
            </p>
            <button 
              onClick={() => navigate('/tasker-profile')} 
              className="bg-[#D4AF37] text-zinc-950 font-bold px-8 py-3 rounded-lg hover:bg-[#C5A028] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TaskerOnboarding;