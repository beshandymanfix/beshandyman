import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NewPage = ({ user, setUser }) => {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col">
      <Header user={user} setUser={setUser} />

      <main className="flex-grow px-8 py-12 max-w-6xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-white mb-6">New Page Title</h1>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <p className="text-zinc-400">Your content goes here...</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewPage;