'use client';

import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useUser } from '../../context/UserContext';

const ALL_SERVICES = [
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

export default function ServicesPage() {
  const { user, setUser } = useUser();

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col">
      <Header user={user} setUser={setUser} />
      
      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Our Services</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ALL_SERVICES.map((service, index) => (
            <Link 
              key={index} 
              href={`/services/${service.toLowerCase().replace(/ /g, '-')}`}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl hover:border-[#D4AF37] transition-colors flex flex-col items-center justify-center text-center gap-4 group"
            >
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform border border-zinc-700">
                🛠️
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">{service}</h2>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}