



// import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Landing from './pages/Landing';
// import CityHome from './pages/CityHome';
// import Services from './pages/Services';
// import HandymanProfile from './pages/HandymanProfile';
// import SkillGallery from './pages/SkillGallery';
// import TaskerOnboarding from './pages/TaskerOnboarding';

// import NewPage from './pages/NewPage';
// import TaskerProfile from './pages/TaskerProfile';
// import GuestProfile from './pages/GuestProfile';
// import Home from './pages/Home';
// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const userInfo = localStorage.getItem('userInfo');
//     if (userInfo) {
//       setUser(JSON.parse(userInfo));
//     }
//   }, []);

//   return (
//     <Router>
//       <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
//         <Routes>
//           <Route path="/" element={<Landing user={user} setUser={setUser} />} />
//           <Route path="/city/:cityName" element={<CityHome user={user} setUser={setUser} />} />
//           <Route path="/services" element={<Services user={user} setUser={setUser} />} />
//           <Route path="/handyman/:id" element={<HandymanProfile user={user} setUser={setUser} />} />
//           <Route path="/handyman/:id/skill/:skillName" element={<SkillGallery user={user} />} />
//           <Route path="/new-page" element={<NewPage user={user} setUser={setUser} />} />
//           <Route path="/tasker-onboarding" element={user ? <TaskerOnboarding user={user} setUser={setUser} /> : <Navigate to="/login" />} />
//           <Route path="/tasker-profile" element={user && user.role === 'tasker' ? <TaskerProfile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
//           <Route path="/guest-profile" element={user && user.role === 'guest' ? <GuestProfile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
//           <Route 
//             path="/login" 
//             element={!user ? <Login user={user} setUser={setUser} /> : (user.role === 'tasker' && !user.isVerified ? <Navigate to="/tasker-onboarding" /> : (user.role === 'tasker' ? <Navigate to="/tasker-profile" /> : <Navigate to="/guest-profile" />))} 
//           />
//           <Route 
//             path="/register" 
//             element={!user ? <Register user={user} setUser={setUser} /> : (user.role === 'tasker' && !user.isVerified ? <Navigate to="/tasker-onboarding" /> : (user.role === 'tasker' ? <Navigate to="/tasker-profile" /> : <Navigate to="/guest-profile" />))} 
//           />
//           <Route path="*" element={<Navigate to={user ? (user.role === 'tasker' ? "/tasker-profile" : "/guest-profile") : "/login"} />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
