import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
        <h2 className="text-3xl mb-2 font-bold text-center text-white">Login</h2>
        <p className="text-zinc-400 text-center mb-6 text-sm">Sign in as a Client or Tasker</p>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        
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
          Sign In
        </button>
        
        <p className="mt-6 text-center text-sm text-zinc-500">
          New Customer? <Link to="/register" className="text-[#D4AF37] hover:underline">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
