
const Footer = () => {
  return (
    <footer className="bg-black text-zinc-500 py-12 px-8 text-center border-t border-zinc-900 w-full">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mb-8">
          {/* Column 1: Contact */}
          <div className="flex flex-col items-center">
             <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Contact</h4>
             <p className="text-sm mb-2 text-zinc-400">Contact me for more information.</p>
             <a href="mailto:brian@beshandyman.com" className="text-[#D4AF37] hover:text-white transition-colors duration-300">brian@beshandyman.com</a>
          </div>

          {/* Column 2: Security & Legal */}
          <div className="flex flex-col items-center">
             <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Security & Legal</h4>
             <div className="flex items-center gap-2 text-green-500 mb-2">
               <span className="text-lg">🛡️</span>
               <span className="text-sm font-semibold">High Security Background Check</span>
             </div>
             <p className="text-xs text-zinc-600">Business & Legal Protection</p>
          </div>

          {/* Column 3: Payments */}
          <div className="flex flex-col items-center">
             <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Payments</h4>
             <p className="text-sm mb-2 text-zinc-400">Accept to use Visa</p>
             <div className="flex gap-3 justify-center items-center opacity-80 hover:opacity-100 transition-opacity">
               <div className="bg-zinc-100 px-2 py-1 rounded shadow-sm">
                  <span className="text-blue-800 font-bold text-xs italic">VISA</span>
               </div>
               <div className="bg-zinc-100 px-2 py-1 rounded shadow-sm">
                  <span className="text-red-600 font-bold text-xs">MasterCard</span>
               </div>
             </div>
          </div>
        </div>

        <div className="w-full border-t border-zinc-900 pt-8">
          <div className="text-2xl font-bold text-[#D4AF37] mb-2">Bes<span className="text-white">Handyman</span></div>
          <p className="text-sm text-zinc-400 mb-2">
            Copyright &copy; {new Date().getFullYear()} Created by <span className="text-[#D4AF37]">Brian V.V.</span>
          </p>
          <p className="text-[10px] text-red-500/40 mt-4 hover:text-red-500 transition-colors cursor-default tracking-wider uppercase">
            Restricted Area • Authorized Access Only
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;