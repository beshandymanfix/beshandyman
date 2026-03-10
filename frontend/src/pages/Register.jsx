import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Register = ({ setUser }) => {
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState(location.state?.role || 'client'); // Default to client or passed state
  const [profileImage, setProfileImage] = useState('');
  const [uploading, setUploading] = useState(false);

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
        setError('');
      } else {
        setUploading(false);
        setError('Image upload failed');
      }
    } catch (err) {
      setUploading(false);
      setError('Image upload failed');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, profileImage }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={submitHandler} className="bg-zinc-900 p-8 rounded-2xl shadow-2xl w-96 border border-zinc-800">
        <h2 className="text-3xl mb-6 font-bold text-center text-white">Sign Up</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}

        {/* Role Selection */}
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`flex-1 py-2 rounded font-bold text-sm transition-colors ${role === 'client' ? 'bg-[#D4AF37] text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          >
            I want to Hire
          </button>
          <button
            type="button"
            onClick={() => setRole('tasker')}
            className={`flex-1 py-2 rounded font-bold text-sm transition-colors ${role === 'tasker' ? 'bg-[#D4AF37] text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          >
            I want to Work
          </button>
        </div>

        {/* Profile Image Upload - Only for Taskers */}
        {role === 'tasker' && (
          <div className="mb-6">
            <label className="block text-zinc-400 mb-2 text-sm">Profile Photo</label>
            <div className="flex flex-col items-center gap-4">
              {profileImage && (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#D4AF37]">
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
        )}

        <div className="mb-4">
          <label className="block text-zinc-400 mb-2 text-sm">Username</label>
          <input
            type="text"
            className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-zinc-400 mb-2 text-sm">Email</label>
          <input
            type="email"
            className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-zinc-400 mb-2 text-sm">Password</label>
          <input
            type="password"
            className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-[#D4AF37] text-zinc-950 font-bold p-3 rounded hover:bg-[#C5A028] transition-colors">
          Register
        </button>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Have an account? <Link to="/login" className="text-[#D4AF37] hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
