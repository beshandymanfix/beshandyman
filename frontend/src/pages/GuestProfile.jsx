import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [skills, setSkills] = useState([]);
  const [profileImage, setProfileImage] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState(0);
  const [skillRates, setSkillRates] = useState({});
  const [skillImages, setSkillImages] = useState({});
  const [gallery, setGallery] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setCity(user.city || '');
      setSkills(user.skills || []);
      setProfileImage(user.profileImage || '');
      setAddress(user.address || '');
      setDescription(user.description || '');
      setHourlyRate(user.hourlyRate || 0);
      setSkillRates(user.skillRates || {});
      setSkillImages(user.skillImages || {});
      setGallery(user.gallery || []);
    }
  }, [user]);

  const handleSkillChange = (e) => {
    const skill = e.target.value;
    if (e.target.checked) {
      setSkills([...skills, skill]);
    } else {
      setSkills(skills.filter((s) => s !== skill));
    }
  };

  const handleSkillRateChange = (skill, rate) => {
    setSkillRates({ ...skillRates, [skill]: rate });
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
        setProfileImage(data);
        setUploading(false);
      } else {
        setUploading(false);
        setIsError(true);
        setMessage('Image upload failed');
      }
    } catch (err) {
      setUploading(false);
      setIsError(true);
      setMessage('Image upload failed');
    }
  };

  const uploadSkillImageHandler = async (e, skill) => {
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
        setSkillImages({ ...skillImages, [skill]: data });
        setUploading(false);
      } else {
        setUploading(false);
        setIsError(true);
        setMessage('Skill image upload failed');
      }
    } catch (err) {
      setUploading(false);
      setIsError(true);
      setMessage('Skill image upload failed');
    }
  };

  const uploadGalleryHandler = async (e) => {
    const files = e.target.files;
    if (gallery.length + files.length > 5) {
      setIsError(true);
      setMessage('Max 5 pictures allowed in gallery');
      return;
    }
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);
        const res = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) {
          const data = await res.text();
          setGallery((prev) => [...prev, data]);
        }
      }
      setUploading(false);
    } catch (err) {
      setUploading(false);
      setIsError(true);
      setMessage('Gallery upload failed');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ name, email, password, city, address, skills, profileImage, description, hourlyRate, skillRates, skillImages, gallery }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        setIsError(false);
        setMessage('Profile Updated Successfully');
        setPassword('');

        // Redirect after a short delay to show the success message
        setTimeout(() => {
          if (data.role === 'tasker') {
            navigate(`/handyman/${data._id}`);
          } else if (data.city) {
            navigate(`/city/${encodeURIComponent(data.city)}`);
          } else {
            // If no city is selected, just clear the message
            setMessage('');
          }
        }, 1500); // 1.5 second delay
      } else {
        setIsError(true);
        setMessage(data.message || 'Error updating profile');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Something went wrong');
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col justify-between">
      <Header user={user} setUser={setUser} />
      <div className="flex flex-col items-center pt-10 pb-20">
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-96 border border-zinc-800">
        <div className="flex flex-col items-center mb-6">
          <div className="text-5xl mb-2">👤</div>
          <h2 className="text-3xl font-bold text-center text-white">{user && user.role === 'tasker' ? 'Tasker Profile' : 'Client Profile'}</h2>
        </div>
        {message && <p className={`${isError ? 'text-red-500' : 'text-green-500'} mb-4 text-center text-sm`}>{message}</p>}
        
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label className="block text-zinc-400 mb-2 text-sm">Profile Image</label>
            <div className="flex flex-col items-center gap-4">
              {profileImage && (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#D4AF37]">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="file"
                onChange={uploadFileHandler}
                className="block w-full text-sm text-zinc-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#D4AF37] file:text-zinc-950
                  hover:file:bg-[#C5A028] cursor-pointer"
              />
              {uploading && <p className="text-sm text-[#D4AF37] animate-pulse">Uploading...</p>}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-zinc-400 mb-2 text-sm">Username</label>
            <input
              type="text"
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-zinc-400 mb-2 text-sm">Email</label>
            <input
              type="email"
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {user && user.role === 'guest' && (
            <div className="mb-4">
              <label className="block text-zinc-400 mb-2 text-sm">Address</label>
              <input
                type="text"
                className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-zinc-400 mb-2 text-sm">Preferred City</label>
            <select
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="" disabled>Select a city</option>
              <option value="San Antonio">San Antonio</option>
              <option value="Austin">Austin</option>
              <option value="New Braunfels">New Braunfels</option>
              <option value="Kyle">Kyle</option>
              <option value="Buda">Buda</option>
              <option value="San Marcos">San Marcos</option>
            </select>
          </div>

          {user && user.role === 'tasker' && (
            <>
              <div className="mb-4">
                <label className="block text-zinc-400 mb-2 text-sm">About You <span className="text-red-500">*</span></label>
                <textarea
                  rows="3"
                  className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                  placeholder="Describe your experience..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-zinc-400 mb-2 text-sm">Work Gallery (max 5 pictures)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {gallery.map((img, index) => (
                    <div key={index} className="w-16 h-16 border border-zinc-700 rounded overflow-hidden">
                      <img src={img} alt="Work" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                {gallery.length < 5 && (
                  <input
                    type="file"
                    multiple
                    onChange={uploadGalleryHandler}
                    className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-zinc-950 hover:file:bg-[#C5A028] cursor-pointer"
                  />
                )}
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-zinc-400 mb-2 text-sm">Skills</label>
            <div className="grid grid-cols-1 gap-2 bg-zinc-950 p-3 rounded border border-zinc-800 max-h-60 overflow-y-auto">
              {[
                "Furniture Assembly",
                "Home Cleaning",
                "Home Repair",
                "TV Mounting",
                "Electrical Help",
                "Painting",
                "General Mounting",
                "Help Moving",
                "Yardwork Service"
              ].map((skill) => (
                <div key={skill} className="flex flex-col">
                  <label className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-900 p-1 rounded">
                    <input
                      type="checkbox"
                      value={skill}
                      checked={skills.includes(skill)}
                      onChange={handleSkillChange}
                      className="w-4 h-4 accent-[#D4AF37] bg-zinc-800 border-zinc-600 rounded focus:ring-[#D4AF37]"
                    />
                    <span className="text-zinc-300 text-sm">{skill}</span>
                  </label>
                  {user && user.role === 'tasker' && skills.includes(skill) && (
                    <div className="ml-7 mt-2 mb-4 p-3 bg-zinc-800/50 rounded border border-zinc-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-zinc-400 w-20">Rate ($/hr):</span>
                        <input
                          type="number"
                          min="1"
                          value={skillRates[skill] || hourlyRate}
                          onChange={(e) => handleSkillRateChange(skill, e.target.value)}
                          className="w-24 p-1 bg-zinc-900 border border-zinc-700 rounded text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-400 w-20">Work Photo:</span>
                        {skillImages[skill] && (
                          <img src={skillImages[skill]} alt={skill} className="w-8 h-8 rounded object-cover border border-zinc-600" />
                        )}
                        <input
                          type="file"
                          onChange={(e) => uploadSkillImageHandler(e, skill)}
                          className="text-xs text-zinc-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-zinc-700 file:text-white hover:file:bg-zinc-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {user && user.role === 'tasker' && (
            <div className="mb-6 bg-zinc-950 p-3 rounded border border-zinc-800">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 accent-[#D4AF37]" defaultChecked />
                <span className="text-xs text-zinc-400">I acknowledge that I have read the training materials and agree to follow all safety guidelines while performing tasks. <span className="text-red-500">*</span></span>
              </label>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-zinc-400 mb-2 text-sm">New Password</label>
            <input
              type="password"
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
              placeholder="Leave blank to keep current"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-[#D4AF37] text-zinc-950 font-bold p-3 rounded hover:bg-[#C5A028] transition-colors mb-4">
            Update Profile
          </button>
        </form>

        <button 
          onClick={logoutHandler} 
          className="w-full bg-red-600 text-white font-bold p-3 rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
