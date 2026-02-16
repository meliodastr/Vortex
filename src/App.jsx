import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Zap, Play, Globe, Cpu, Activity, Radio } from 'lucide-react';

// --- VORTEX ENGINE: DÖNEN GİRDAP EFEKTİ ---
const VortexEngine = () => (
  <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ rotate: 0, scale: 0.7, opacity: 0 }}
        animate={{ 
          rotate: i % 2 === 0 ? 360 : -360, 
          scale: [0.7, 1, 0.7],
          opacity: [0.1, 0.4, 0.1] 
        }}
        transition={{ 
          duration: 10 + i * 5, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute border-[2px] border-blue-500/20 rounded-full"
        style={{ width: `${(i + 1) * 250}px`, height: `${(i + 1) * 250}px` }}
      />
    ))}
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 4, repeat: Infinity }}
      className="absolute w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" 
    />
  </div>
);

export default function App() {
  const [view, setView] = useState('landing');

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* GİRİŞ EKRANI (LANDING) */}
        {view === 'landing' && (
          <motion.div 
            key="landing" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(20px)" }}
            className="h-screen flex flex-col items-center justify-center relative z-10"
          >
            <VortexEngine />
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center z-20"
            >
              <h1 className="text-8xl md:text-[12rem] font-black italic tracking-tighter leading-none mb-4 bg-gradient-to-b from-white to-blue-900 bg-clip-text text-transparent">
                VORTEX
              </h1>
              <p className="text-blue-400 font-bold tracking-[0.5em] mb-12 uppercase text-xs">
                POWERED BY SYN
              </p>
              
              <button 
                onClick={() => setView('portal')}
                className="px-16 py-6 bg-white text-black font-black text-xl rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(37,99,235,0.4)]"
              >
                SİSTEME SIZ
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* PORTAL EKRANI */}
        {view === 'portal' && (
          <motion.div 
            key="portal" 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 relative z-10"
          >
            <nav className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-2 font-black text-3xl italic">
                <Globe className="text-blue-500" /> VORTEX
              </div>
              <div className="bg-blue-600/10 border border-blue-500/20 px-6 py-2 rounded-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-blue-300 uppercase">SYN ONLINE</span>
              </div>
            </nav>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="h-[400px] bg-white/5 border border-white/10 rounded-[40px] p-10 relative overflow-hidden group">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Global Flow</span>
                  <h2 className="text-5xl font-black mt-8 leading-tight">Zamanın ve Verinin Ötesinde.</h2>
                  <p className="mt-6 text-slate-400">SYN bugün dünya genelinde 1.4TB trend verisini analiz etti.</p>
                </div>
              </div>

              <div className="bg-gradient-to-b from-blue-600/10 to-transparent border border-white/10 rounded-[40px] p-10 backdrop-blur-3xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Cpu className="text-blue-500" />
                    <h3 className="text-xl font-bold italic underline decoration-blue-500">SYN_LOG</h3>
                  </div>
                  <p className="text-sm text-slate-400 italic">"Girdap dengeli. Tüm sistemler optimize edildi. Keşfetmeye hazırsınız."</p>
                </div>
                <button className="w-full py-5 bg-blue-600 rounded-3xl font-black text-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-3">
                  <Mic size={20} /> SYN'E SOR
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}