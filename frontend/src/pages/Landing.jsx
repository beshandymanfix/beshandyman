import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// Sample data for cities. In a real app, this might come from an API or a larger dataset.
const CITIES_BY_STATE = {
  "Texas": ["San Antonio", "Austin", "New Braunfels", "Kyle", "Buda", "San Marcos", "Houston", "Dallas", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo", "Lubbock", "Garland", "Irving", "Amarillo", "Grand Prairie", "Brownsville", "McKinney", "Frisco", "Pasadena", "Mesquite", "Killeen", "McAllen", "Carrollton", "Midland", "Waco", "Denton", "Abilene", "Odessa", "Beaumont", "Round Rock", "The Woodlands", "Richardson", "Pearland", "College Station", "Lewisville", "Tyler", "Wichita Falls", "League City", "San Angelo"],
  "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Fresno", "Long Beach", "Oakland", "Bakersfield", "Anaheim"],
  "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"],
  "Florida": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee"],
  // Default fallback for other states
  "default": ["Major City 1", "Major City 2", "Other"]
};

const getCitiesForState = (state) => {
  return CITIES_BY_STATE[state] || CITIES_BY_STATE["default"];
};

const getStateForCity = (city) => {
  for (const [state, cities] of Object.entries(CITIES_BY_STATE)) {
    if (cities.includes(city)) {
      return state;
    }
  }
  return '';
};

const Landing = ({ user, setUser }) => {
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const navigate = useNavigate();

  const servicesList = [
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

  useEffect(() => {
    if (user && user.city) {
      setCity(user.city);
      const userState = getStateForCity(user.city);
      if (userState) {
        setSelectedState(userState);
      }
      setAvailabilityMessage("Good news! BesHandyman is available in your area.");
    }
  }, [user]);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setCity(''); // Reset city when state changes
    setAvailabilityMessage('');
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    if (e.target.value.length > 0) {
      setAvailabilityMessage("Good news! BesHandyman is available in your area.");
    } else {
      setAvailabilityMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city) {
      navigate(`/city/${encodeURIComponent(city)}`, { state: { service, date, time } });
    } else if (service) {
      navigate(`/services/${service.toLowerCase().replace(/ /g, '-')}`, { state: { date, time } });
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <img 
            src="/beshandyman.jpg" 
            alt="Bes Handyman Logo" 
            className="h-12 w-auto object-contain rounded-md" 
          />
          <div className="text-2xl font-extrabold tracking-tight text-[#D4AF37]">
            Bes<span className="text-white">Handyman</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
            {!user ? (
                <>
                <Link to="/login" className="text-zinc-300 hover:text-[#D4AF37] font-bold text-sm">Sign In</Link>
                <Link to="/register" state={{ role: 'client' }} className="px-4 py-2 bg-[#D4AF37] text-zinc-950 font-bold rounded hover:bg-[#C5A028]">Register</Link>
                </>
            ) : (
                <div className="flex items-center gap-4">
                  <span className="hidden md:block font-medium text-zinc-300">
                    Welcome, <span className="text-[#D4AF37]">{user.name}</span>
                  </span>
                  <Link to="/profile" className="px-4 py-2 bg-[#D4AF37] text-zinc-950 font-bold rounded hover:bg-[#C5A028]">Profile</Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('userInfo');
                      setUser(null);
                    }}
                    className="px-4 py-2 text-sm font-bold text-white border border-zinc-700 rounded hover:bg-zinc-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
            )}
        </div>
      </nav>

      <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Book trusted help for <br className="hidden md:block" />
          <span className="text-[#D4AF37]">home tasks</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-12 max-w-2xl">
          Professional home repairs, mounting, and cleaning services.
        </p>
        
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-2xl shadow-2xl w-full max-w-5xl border border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="w-full">
            <label className="block text-zinc-400 mb-2 text-sm font-bold text-left">State</label>
            <select
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
              value={selectedState}
              onChange={handleStateChange}
            >
              <option value="" disabled>Select State</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-zinc-400 mb-2 text-sm font-bold text-left">City</label>
            <select
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
              value={city}
              onChange={handleCityChange}
              disabled={!selectedState}
            >
              <option value="" disabled>Select City</option>
              {selectedState && getCitiesForState(selectedState).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {availabilityMessage && <p className="text-green-500 text-xs mt-2 text-left">{availabilityMessage}</p>}
          </div>

          <div className="w-full">
            <label className="block text-zinc-400 mb-2 text-sm font-bold text-left">What do you need help with?</label>
            <select
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <option value="" disabled>Select a service</option>
              {servicesList.map((s, index) => (
                <option key={index} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-zinc-400 mb-2 text-sm font-bold text-left">Date</label>
            <input
              type="date"
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="block text-zinc-400 mb-2 text-sm font-bold text-left">Time</label>
            <select
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-[#D4AF37]"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="" disabled>Select Time</option>
              <option value="Morning">Morning (8am - 12pm)</option>
              <option value="Afternoon">Afternoon (12pm - 5pm)</option>
              <option value="Evening">Evening (5pm - 9:30pm)</option>
            </select>
          </div>

          <div className="w-full">
            <button type="submit" className="w-full bg-[#D4AF37] text-zinc-950 font-bold p-3 rounded hover:bg-[#C5A028] transition-colors">
              Book Trusted Help
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Landing;
