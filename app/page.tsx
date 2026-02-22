import React from 'react';

// NEW: This is the Open Graph Metadata for link previews
export const metadata = {
  title: 'Bes Handyman | San Antonio',
  description: 'Professional home repairs, mounting, electrical, and smart home tech by a Full Stack Engineer.',
  openGraph: {
    title: 'Bes Handyman | Professional Repairs',
    description: 'Serving San Antonio, Timberwood Park, Kyle, and Austin. Get it done with engineering precision.',
    url: 'https://beshandyman.com',
    siteName: 'Bes Handyman',
    images: [
      {
        url: 'https://beshandyman.com/beshandyman.jpg', // Points to your gold foil logo
        width: 1200, // Standard width for iMessage/Facebook previews
        height: 800, // Standard height
        alt: 'Bes Handyman Gold Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function Home() {
  // Local SEO Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Bes Handyman",
    "image": "https://beshandyman.com/beshandyman.jpg",
    "url": "https://beshandyman.com",
    "telephone": "+1-210-693-1422", // Update with your actual phone number
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Antonio",
      "addressRegion": "TX",
      "addressCountry": "US"
    },
    "areaServed": [
      "San Antonio",
      "Timberwood Park",
      "Kyle",
      "Austin"
    ],
    "founder": {
      "@type": "Person",
      "name": "Brian"
    },
    "description": "Professional home repairs, mounting, electrical, and smart home tech serving the greater San Antonio area."
  };

  return (
    <main className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      {/* Invisible SEO Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <img 
            src="/beshandyman.jpg" 
            alt="Bes Handyman Logo" 
            className="h-12 w-auto object-contain rounded-md" 
          />
          <div className="text-2xl font-extrabold tracking-tight text-[#D4AF37] hidden sm:block">
            Bes<span className="text-white">Handyman</span>
          </div>
        </div>
        <a 
          href="mailto:brian@beshandyman.com" 
          className="hidden md:block font-medium text-zinc-300 hover:text-[#D4AF37] transition-colors"
        >
          brian@beshandyman.com
        </a>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 md:py-32 max-w-6xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Professional Repairs by a <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FCE588]">
            Computer Science Pro.
          </span>
        </h1>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
          Serving San Antonio, Timberwood Park, and the surrounding areas. 
          Get your mounting, electrical, and exterior home repairs done with engineering precision.
        </p>



        <div className="flex flex-col sm:flex-row gap-4">
          <a 
            href="sms:+12108386631" // Update with your number
            className="px-8 py-4 bg-[#D4AF37] text-zinc-950 font-bold rounded-lg shadow-lg hover:bg-[#C5A028] hover:shadow-xl transition-all"
          >
            Text for a Quote
          </a>
          <a 
            href="https://instagram.com/beshandyman" 
            target="_blank" 
            rel="noreferrer"
            className="px-8 py-4 bg-transparent text-[#D4AF37] font-bold border border-[#D4AF37] rounded-lg shadow-sm hover:bg-[#D4AF37] hover:text-zinc-950 transition-all"
          >
            See My Work on IG
          </a>
        </div>


<div className="max-w-5xl mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 shadow-2xl mb-20 relative overflow-hidden">
        
        {/* Subtle background glow effect behind the content */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-12">

          {/* 1. THE CIRCLE PICTURE */}
          {/* 'shrink-0' stops the image from getting squished on smaller screens */}
          <div className="shrink-0 relative group">
             {/* The gold border ring with a subtle glow */}
             <div className="absolute -inset-1 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
             
             {/* The actual image container */}
            <div className="relative w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden border-[5px] border-yellow-500 shadow-xl bg-neutral-800">
              {/* Important: 'object-cover' ensures the image fills the circle without stretching */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brian.jpg" // Replace with /profile.jpg later if you have a better square photo
                alt="Bes Handyman Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 2. THE TEXT CONTENT */}
          <div className="flex-grow text-center md:text-left">
             
             {/* Name & Subtitle */}
             <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
               Brian V.
             </h1>
             <p className="text-yellow-500 font-medium text-xl sm:text-2xl mt-3">
               Precision Home Services & Mounting
             </p>

             {/* Reviews Bubble */}
             <div className="inline-flex items-center gap-2 mt-5 bg-neutral-950/80 px-5 py-2 rounded-full border border-neutral-800/60 shadow-sm">
               <div className="flex text-yellow-400 text-xl">★ ★ ★ ★ ★</div>
               <p className="text-white font-bold text-lg">
                 5.0 <span className="text-gray-400 font-medium text-sm ml-1">(Verified Reviews)</span>
               </p>
             </div>

             {/* Bio */}
             <p className="mt-8 text-gray-300 leading-relaxed text-lg max-w-2xl mx-auto md:mx-0 font-light">
               Professional home repairs, advanced TV mounting, and smart home electrical. Engineered with absolute precision by a Full Stack Developer turned professional handyman serving San Antonio.
             </p>

             {/* CTA Button */}
             <div className="mt-10">
              <a
                href="#contact"
                className="inline-block px-10 py-4 bg-yellow-500 text-black font-bold text-lg rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-500/20 transform hover:-translate-y-1"
              >
                Get a Free Quote
              </a>
            </div>

          </div>
        </div>
      </div>
      {/* --- NEW CIRCLE PROFILE CARD END --- */}
      </section>

      {/* Services Grid (Now 6 Cards) */}
      <section className="bg-zinc-900 py-20 px-8 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-white">Everything You Need Done Right.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* TV Mounting */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">📺</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">TV & General Mounting</h3>
              <p className="text-zinc-400">Perfectly leveled, securely anchored TVs, shelves, mirrors, and art installations.</p>
            </div>

            {/* Electrical & Tech */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Light Electrical & Tech</h3>
              <p className="text-zinc-400">Low voltage wiring, fixture swapping, and smart home device installation.</p>
            </div>

            {/* Drywall */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">🧱</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Drywall Repair</h3>
              <p className="text-zinc-400">Seamless patching, texturing, painting, and hardware repair for your walls.</p>
            </div>

            {/* Gutter Cleaning */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">🍂</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Gutter Cleaning</h3>
              <p className="text-zinc-400">Complete debris removal and downspout flushing to protect your home's foundation.</p>
            </div>

            {/* Window Cleaning */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Window Cleaning</h3>
              <p className="text-zinc-400">Streak-free interior and exterior window washing for a crystal-clear view.</p>
            </div>

            {/* Deck & Fence */}
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-[#D4AF37] transition-colors">
              <div className="text-4xl mb-4">🪵</div>
              <h3 className="text-xl font-bold mb-2 text-[#D4AF37]">Deck & Fence Staining</h3>
              <p className="text-zinc-400">Wood repair, power washing, and professional staining to restore your exterior spaces.</p>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="px-8 py-20 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">The Pro Behind the Tools</h2>
        <p className="text-lg text-zinc-400 leading-relaxed mb-6">
          Hi, I'm Brian. I spent years working as a Full Stack Engineer before realizing my true passion was working with my hands and solving physical problems. Now, I bring that same engineering mindset and precision to your home. 
        </p>
        <p className="text-lg text-zinc-400 leading-relaxed">
          When I'm not on a ladder or troubleshooting wiring, you can usually find me at the ice rink officiating a hockey game, planning my next travel adventure, or hanging out with my dog, Bami.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-black text-zinc-500 py-12 px-8 text-center border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-2xl font-bold text-[#D4AF37] mb-4">Bes<span className="text-white">Handyman</span></div>
          <p className="mb-4">Reliable home repair for San Antonio, Austin, Kyle, and beyond.</p>
          <p className="text-sm">© {new Date().getFullYear()} Bes Handyman. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}