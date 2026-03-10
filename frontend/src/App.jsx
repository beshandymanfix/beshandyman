import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Landing from './pages/Landing';
import CityHome from './pages/CityHome';
import Services from './pages/Services';
import HandymanProfile from './pages/HandymanProfile';
import SkillGallery from './pages/SkillGallery';
import TaskerOnboarding from './pages/TaskerOnboarding';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        <Routes>
          <Route path="/" element={<Landing user={user} setUser={setUser} />} />
          <Route path="/city/:cityName" element={<CityHome user={user} setUser={setUser} />} />
          <Route path="/services" element={<Services user={user} setUser={setUser} />} />
          <Route path="/handyman/:id" element={<HandymanProfile user={user} setUser={setUser} />} />
          <Route path="/handyman/:id/skill/:skillName" element={<SkillGallery user={user} />} />
          <Route path="/tasker-onboarding" element={user ? <TaskerOnboarding user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          <Route 
            path="/login" 
            element={!user ? <Login setUser={setUser} /> : (user.role === 'tasker' && !user.isVerified ? <Navigate to="/tasker-onboarding" /> : <Navigate to="/profile" />)} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register setUser={setUser} /> : (user.role === 'tasker' && !user.isVerified ? <Navigate to="/tasker-onboarding" /> : <Navigate to="/profile" />)} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to={user ? "/profile" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
