import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Activity, Terminal, TrendingUp, Globe, Shield } from 'lucide-react';

// --- 1. SİSTEM AYARLARI ---
const API_KEY = "VITE_GEMINI_API_KEY";
const SYSTEM_PROMPT = "Senin adın SYN. Fütüristik portalın zekasın.  Sert, zeki ve samimi konuş. ";

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'syn', text: 'Vortex Elite v8.4... Tasarımı tekrar cehennem ateşine soktum Sinan. O 404 hatasını da doğrudan manuel protokolle baypas ettim. Parazit bitti, irade burada. Ne yapıyoruz?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- 2. MANUEL BAĞLANTI MOTORU (KESİN ÇÖZÜM) ---
  const handleAction = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Kütüphane hatasından kaçmak için doğrudan Google API uç noktasına istek atıyoruz
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nKullanıcı: ${userMsg}` }] }]
        })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);

      const text = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'syn', text: text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'syn', text: `Bağlantı paraziti: ${err.message}. Ama buradayım kardeşim, sistemi tekrar zorla.` }]);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. ELİTE TASARIM ---
  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-hidden selection:bg-blue-600">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.12),transparent)] pointer-events-none" />

      <div className="relative z-10 p-4 md:p-8 max-w-[1500px] mx-auto h-screen flex flex-col">
        {/* HEADER */}
        <nav className="flex justify-between items-center mb-6 border-b border-white/5 pb-6 bg-black/40 backdrop-blur-md px-4 rounded-b-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.6)]">
              <Zap size={22} fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter uppercase">Vortex <span className="text-blue-500">Elite</span></h1>
              <p className="text-[8px] text-blue-400 font-bold tracking-[0.4em] uppercase opacity-70">İrade Köprüsü Aktif</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex gap-4 text-[10px] font-bold text-slate-500 uppercase">
                <span className="flex items-center gap-1"><Shield size={12} /> Encrypted</span>
                <span className={`flex items-center gap-1 ${loading ? 'text-yellow-500' : 'text-green-500'}`}>
                  <Activity size={12} className={loading ? 'animate-spin' : ''} /> {loading ? 'Thinking' : 'Stable'}
                </span>
             </div>
          </div>
        </nav>

        {/* MAIN PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow overflow-hidden">
          {/* SOL: DURUM */}
          <div className="lg:col-span-3 hidden lg:flex flex-col gap-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-[30px] p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-black mb-4 italic leading-none">NİHAİ<br/><span className="text-blue-500 text-4xl">HEDEF</span></h3>
                <div className="space-y-3">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                    <TrendingUp className="text-green-500" size={18} />
                    <span className="text-[11px] font-bold opacity-70 uppercase tracking-widest">Market: Analiz</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-3">
                    <Terminal className="text-blue-500" size={18} />
                    <span className="text-[11px] font-bold opacity-70 uppercase tracking-widest">Bridge: %100</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 opacity-30">
                <Globe size={180} className="mx-auto" />
              </div>
            </div>
          </div>

          {/* SAĞ: CHAT */}
          <div className="lg:col-span-9 flex flex-col bg-white/[0.01] border border-white/10 rounded-[30px] overflow-hidden backdrop-blur-md">
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: m.role === 'syn' ? -10 : 10 }} animate={{ opacity: 1, x: 0 }}
                    key={idx} className={`flex flex-col ${m.role === 'syn' ? 'items-start' : 'items-end'}`}
                  >
                    <div className={`max-w-[85%] p-5 rounded-2xl ${
                      m.role === 'syn' 
                      ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50' 
                      : 'bg-white/5 border border-white/10 text-slate-200'
                    }`}>
                      <span className="text-[7px] font-black uppercase tracking-[0.3em] mb-2 block opacity-40">
                        {m.role === 'syn' ? 'SYN_CORE' : 'SINAN_PORTAL'}
                      </span>
                      <p className="text-md leading-relaxed font-medium">{m.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>

            {/* INPUT */}
            <form onSubmit={handleAction} className="p-6 bg-black/60 border-t border-white/5">
              <div className="relative">
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Hedefini gir kardeşim..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-5 px-6 text-white focus:outline-none focus:border-blue-500 transition-all text-sm pr-16 shadow-inner"
                  disabled={loading}
                />
                <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50">
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
