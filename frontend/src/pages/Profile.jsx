import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ user, setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [skills, setSkills] = useState([]);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setCity(user.city || '');
      setSkills(user.skills || []);
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

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ name, email, password, city, skills }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        setMessage('Profile Updated Successfully');
        setPassword('');

        // Redirect after a short delay to show the success message
        setTimeout(() => {
          if (data.city) {
            navigate(`/city/${encodeURIComponent(data.city)}`);
          } else {
            // If no city is selected, just clear the message
            setMessage('');
          }
        }, 1500); // 1.5 second delay
      } else {
        setMessage(data.message || 'Error updating profile');
      }
    } catch (err) {
      setMessage('Something went wrong');
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center pt-10">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-96 border border-zinc-800">
        <h2 className="text-3xl mb-6 font-bold text-center text-white">User Profile</h2>
        {message && <p className="text-green-500 mb-4 text-center text-sm">{message}</p>}
        
        <form onSubmit={submitHandler}>
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
                <label key={skill} className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-900 p-1 rounded">
                  <input
                    type="checkbox"
                    value={skill}
                    checked={skills.includes(skill)}
                    onChange={handleSkillChange}
                    className="w-4 h-4 accent-[#D4AF37] bg-zinc-800 border-zinc-600 rounded focus:ring-[#D4AF37]"
                  />
                  <span className="text-zinc-300 text-sm">{skill}</span>
                </label>
              ))}
            </div>
          </div>

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
  );
};

export default Profile;
