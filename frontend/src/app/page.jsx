'use client'; // Required for hooks like useState and useEffect

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use Next.js router
import Header from '../components/Header';
import Footer from '../components/Footer';

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const CITIES_BY_STATE = {
  "Texas": ["San Antonio", "Austin", "New Braunfels", "Kyle", "Buda", "San Marcos", "Houston", "Dallas", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo", "Lubbock", "Garland", "Irving", "Amarillo", "Grand Prairie", "Brownsville", "McKinney", "Frisco", "Pasadena", "Mesquite", "Killeen", "McAllen", "Carrollton", "Midland", "Waco", "Denton", "Abilene", "Odessa", "Beaumont", "Round Rock", "The Woodlands", "Richardson", "Pearland", "College Station", "Lewisville", "Tyler", "Wichita Falls", "League City", "San Angelo"],
  "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Fresno", "Long Beach", "Oakland", "Bakersfield", "Anaheim"],
  "New York": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"],
  "Florida": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee"],
  "default": ["Major City 1", "Major City 2", "Other"]
};

const getCitiesForState = (state) => CITIES_BY_STATE[state] || CITIES_BY_STATE["default"];

const getStateForCity = (city) => {
  for (const [state, cities] of Object.entries(CITIES_BY_STATE)) {
    if (cities.includes(city)) return state;
  }
  return '';
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  
  const router = useRouter(); // Next.js Router

  const servicesList = [
    "Furniture Assembly", "Home Cleaning", "Home Repair", "TV Mounting", 
    "Electrical Help", "Painting", "General Mounting", "Help Moving", "Yardwork Service"
  ];

  // Initialize User from LocalStorage
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      if (parsedUser.city) {
        setCity(parsedUser.city);
        const userState = getStateForCity(parsedUser.city);
        if (userState) setSelectedState(userState);
        setAvailabilityMessage("Good news! BesHandyman is available in your area.");
      }
    }
  }, []);

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setCity('');
    setAvailabilityMessage('');
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setAvailabilityMessage(e.target.value ? "Good news! BesHandyman is available in your area." : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create query params for date/time/service
    const params = new URLSearchParams();
    if (service) params.append('service', service);
    if (date) params.append('date', date);
    if (time) params.append('time', time);

    const queryString = params.toString() ? `?${params.toString()}` : '';

    if (city) {
      router.push(`/city/${encodeURIComponent(city)}${queryString}`);
    } else if (service) {
      router.push(`/services/${service.toLowerCase().replace(/ /g, '-')}${queryString}`);
    } else {
      router.push('/services');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col">
      <Header user={user} setUser={setUser} />

      <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Book trusted help for <br className="hidden md:block" />
          <span className="text-[#D4AF37]">home tasks</span>
        </h1>
        <p className="text-xl text-zinc-400 mb-12 max-w-2xl">
          Professional home repairs, mounting, and cleaning services.
        </p>
        
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-2xl shadow-2xl w-full max-w-5xl border border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* ... All your Select/Input elements remain exactly the same as your Vite code ... */}
          <div className="w-full text-left">
            <label className="block text-zinc-400 mb-2 text-sm font-bold">State</label>
            <select className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white" value={selectedState} onChange={handleStateChange}>
              <option value="" disabled>Select State</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="w-full text-left">
            <label className="block text-zinc-400 mb-2 text-sm font-bold">City</label>
            <select className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded text-white" value={city} onChange={handleCityChange} disabled={!selectedState}>
              <option value="" disabled>Select City</option>
              {selectedState && getCitiesForState(selectedState).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* ... Rest of your form fields ... */}
          <div className="w-full">
             <button type="submit" className="w-full bg-[#D4AF37] text-zinc-950 font-bold p-3 rounded hover:bg-[#C5A028] transition-colors">
               Book Trusted Help
             </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}