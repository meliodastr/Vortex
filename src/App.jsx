import React, { useState, useEffect, useRef } from 'react';
import { Radar, Cpu, Rocket, DollarSign, Send, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const CATEGORIES = [
  { id: 'ai', name: 'Artificial Intelligence', icon: <Cpu size={18}/>, color: 'from-blue-600', vid: '9bZkp7q19f0' },
  { id: 'crypto', name: 'Crypto Assets', icon: <DollarSign size={18}/>, color: 'from-orange-600', vid: '0f-jL_mNn_A' }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [messages, setMessages] = useState([{ role: 'ai', text: "Vortex Nexus Çevrimiçi. SYN için rasyonel analiz modülü aktif." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Vercel'den gelen anahtarı kontrol eden rasyonel blok
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
      setMessages(prev => [...prev, { role: 'ai', text: "HATA [404]: API Anahtarı sisteme enjekte edilemedi SYN. Vercel Variables kontrol edilmeli." }]);
      return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      // Sürüm 1.5 Flash kullanımı (En hızlı ve rasyonel seçenek)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `Sen Vortex AI rasyonel üst aklısın. Kullanıcın SYN. Yanıtların teknik, kısa ve öz olmalı. Soru: ${userMsg}` }] }],
      });

      const responseText = result.response.text();
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "Sinyal Kesildi: API limiti veya anahtar hatası SYN." }]);
    } finally {
      setLoading(false);
    }
  };

  const current = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-sans overflow-hidden">
      <header className="h-14 border-b border-white/5 bg-black/40 backdrop-blur-xl flex justify-between items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Radar className="text-blue-500 animate-pulse" size={20} />
          <h1 className="font-black italic text-lg tracking-tighter uppercase">VORTEX<span className="text-blue-500">NEXUS</span></h1>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono">
            <span className="text-green-500 flex items-center gap-1"><ShieldCheck size={12}/> SYN_LOGGED_IN</span>
            <span className="text-zinc-500 border border-white/10 px-2 py-0.5 rounded uppercase">v1.0.4_stable</span>
        </div>
      </header>

      <div className="flex-grow flex p-4 gap-4 overflow-hidden">
        {/* SIDE NAV */}
        <nav className="w-56 hidden md:flex flex-col gap-1.5 shrink-0">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`p-3.5 rounded-xl flex items-center gap-3 transition-all border ${activeCategory === cat.id ? 'bg-blue-600/10 border-blue-500/30 text-white' : 'border-transparent text-zinc-500 hover:bg-white/5'}`}>
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${cat.color} to-black shadow-lg text-white`}>{cat.icon}</div>
              <span className="font-bold text-[11px] uppercase tracking-tight">{cat.name}</span>
            </button>
          ))}
        </nav>

        {/* FEED & VISUALS */}
        <main className="flex-grow flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
          <div className="w-full aspect-video bg-black rounded-[24px] overflow-hidden border border-white/5 relative shadow-2xl shrink-0 group">
            <iframe src={`https://www.youtube.com/embed/${current.vid}?autoplay=1&mute=1&controls=0&modestbranding=1`} className="w-full h-full opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
            <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-red-600/80 text-[8px] font-black px-2 py-0.5 rounded tracking-widest animate-pulse uppercase">Live_Feed</span>
                <span className="bg-blue-600/50 backdrop-blur-sm text-[8px] font-black px-2 py-0.5 rounded tracking-widest uppercase">Data_Stream</span>
            </div>
            <div className="absolute bottom-6 left-6 drop-shadow-2xl">
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-blue-500">{current.name}</h2>
                <p className="text-[10px] text-zinc-400 font-mono tracking-widest mt-1 uppercase">Sinyal_Gücü: %98.4</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-[20px] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={40}/></div>
               <div className="text-[9px] font-black text-blue-500 mb-2 tracking-widest uppercase">Matrix_Analiz</div>
               <p className="text-[11px] text-zinc-400 italic leading-relaxed">"Sistem SYN komutlarını bekliyor. Tüm rasyonel veriler stabilize edildi. Sektörel anomali taranıyor."</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-[20px]">
               <div className="text-[9px] font-black text-zinc-500 mb-2 tracking-widest uppercase">Piyasa_Verisi</div>
               <div className="text-xl font-black text-white">$ {Math.floor(Math.random()*70000 + 20000).toLocaleString()}</div>
               <div className="h-1 w-full bg-zinc-8
