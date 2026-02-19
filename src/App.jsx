import React, { useState, useEffect, useRef } from 'react';
import { Radar, Cpu, Rocket, DollarSign, Send, BarChart3, ShieldCheck, Zap, Activity, ExternalLink } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const CATEGORIES = [
  { id: 'ai', name: 'Artificial Intelligence', icon: <Cpu size={18}/>, color: 'from-blue-600', vid: '9bZkp7q19f0', symbol: 'NVDA' },
  { id: 'crypto', name: 'Crypto Assets', icon: <DollarSign size={18}/>, color: 'from-orange-600', vid: '0f-jL_mNn_A', symbol: 'BTC' },
  { id: 'space', name: 'Space Exploration', icon: <Rocket size={18}/>, color: 'from-purple-600', vid: 'GoW8Tf7h978', symbol: 'SPCE' }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [messages, setMessages] = useState([{ role: 'ai', text: "Vortex Nexus Çevrimiçi. SYN için rasyonel analiz modülü aktif." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // --- KRİTİK VERİ YOLU ---
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    if (!API_KEY) {
      setMessages(prev => [...prev, { role: 'ai', text: "HATA: Sinyal kaynağı (API KEY) bulunamadı SYN. Vercel paneline VITE_GEMINI_API_KEY ekle." }]);
      return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Sen Vortex AI rasyonel üst aklısın. Kullanıcın SYN. Yanıtların teknik, çok kısa ve öz olmalı. Asla Sinan ismini kullanma."
      });
      
      const chat = model.startChat();
      const result = await chat.sendMessage(userMsg);
      const response = await result.response;
      
      setMessages(prev => [...prev, { role: 'ai', text: response.text() }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "Sinyal Kesildi: Protokol hatası veya API limiti SYN." }]);
    } finally {
      setLoading(false);
    }
  };

  const current = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-sans overflow-hidden">
      {/* ÜST PANEL */}
      <header className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-xl flex justify-between items-center px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <Radar className="text-blue-500 animate-pulse" size={20} />
          <h1 className="font-black italic text-lg tracking-tighter uppercase">VORTEX<span className="text-blue-500">NEXUS</span></h1>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono">
            <span className="text-green-500 flex items-center gap-1"><ShieldCheck size={12}/> SYN_Otonom</span>
            <span className="text-zinc-500 border border-white/10 px-2 py-0.5 rounded uppercase tracking-tighter">Node_22_Optimized</span>
        </div>
      </header>

      <div className="flex-grow flex p-4 gap-4 overflow-hidden relative">
        {/* SOL NAVİGASYON (X Stil) */}
        <nav className="w-56 hidden lg:flex flex-col gap-1.5 shrink-0">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`p-3.5 rounded-xl flex items-center gap-3 transition-all border ${activeCategory === cat.id ? 'bg-blue-600/10 border-blue-500/30 text-white' : 'border-transparent text-zinc-500 hover:bg-white/5'}`}>
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${cat.color} to-black shadow-lg text-white`}>{cat.icon}</div>
              <span className="font-bold text-[11px] uppercase tracking-tight">{cat.name}</span>
            </button>
          ))}
          <div className="mt-auto p-4 bg-white/5 border border-white/5 rounded-2xl">
             <div className="flex items-center justify-between text-[9px] mb-2 text-zinc-500 font-black"><span>CPU_USE</span><span>14%</span></div>
             <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[40%]"></div></div>
          </div>
        </nav>

        {/* ANA AKIŞ (YouTube Stil) */}
        <main className="flex-grow flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
          <div className="w-full aspect-video bg-black rounded-[32px] overflow-hidden border border-white/5 relative shadow-2xl shrink-0">
            <iframe src={`https://www.youtube.com/embed/${current.vid}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`} className="w-full h-full opacity-40 shadow-inner" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-600 text-[9px] font-black px-2 py-0.5 rounded italic animate-pulse">LIVE</span>
                    <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase italic">Data_Matrix_{current.symbol}</span>
                </div>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{current.name}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[28px] group hover:border-blue-500/30 transition-all">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase">Otonom Analiz</span>
                    <Activity size={14} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="text-[11px] text-zinc-400 italic leading-relaxed">"Sistem SYN komutlarını rasyonel olarak işliyor. {current.name} verileri stabilize edildi. Sektörel anomali taranıyor."</p>
             </div>
             <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[28px]">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">Market Cap</span>
                    <ExternalLink size={12} className="text-zinc-800" />
                </div>
                <div className="text-2xl font-black text-white">$ {Math.floor(Math.random()*90000 + 10000).toLocaleString()}</div>
                <div className="mt-3 flex gap-1 italic text-[9px] text-green-500 font-bold"><span>+%{Math.floor(Math.random()*15)}</span><span>(24H_SIGNAL)</span></div>
             </div>
          </div>
        </main>

        {/* TERMİNAL (AI Chat) */}
        <aside className="w-80 hidden md:flex flex-col gap-4 shrink-0">
          <div className="flex-grow bg-black/80 border border-white/10 rounded-[32px] flex flex-col overflow-hidden backdrop-blur-3xl shadow-2xl relative">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2"><Zap size={14} className="text-blue-500" /><span className="font-black text-[10px] uppercase tracking-widest text-zinc-400">Terminal</span></div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3.5 rounded-2xl text-[12px] leading-relaxed transition-all shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/10 text-zinc-300'}`}>
                    <div className="text-[8px] uppercase font-black mb-1 opacity-40 tracking-widest">{m.role === 'user' ? 'SYN' : 'Vortex'}</div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChat} className="p-4 bg-white/5 border-t border-white/5">
              <div className="relative">
                <input 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  placeholder="Komut gir..." 
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[11px] outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700" 
                />
                <button type="submit" disabled={loading} className="absolute right-2 top-2 bottom-2 px-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all">
                  <Send size={14} className={loading ? 'animate-pulse' : ''} />
                </button>
              </div>
            </form>
          </div>
        </aside>
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f633; border-radius: 10px; }`}</style>
    </div>
  );
}
