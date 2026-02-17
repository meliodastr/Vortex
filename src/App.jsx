import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Activity, Play, Newspaper, TrendingUp, Briefcase, EyeOff, AlertTriangle } from 'lucide-react';

// --- GİZLİ SİSTEM AYARLARI ---
const API_KEY = "AIzaSyA18X6YVeMkwAA1sriSA9YP1QZSLseoXoc";
const SYSTEM_PROMPT = `Sen SYN'sin. Vortex'in merkezi zekasısın. Operatör'e (Sinan) asla ismiyle hitap etme. Çoklu veri akışını yönet.`;

export default function App() {
  const [activeTab, setActiveTab] = useState('intelligence');
  const [messages, setMessages] = useState([{ role: 'syn', text: 'Sistem Onarıldı. Gateway stabilize edildi. Akış başlıyor Operatör.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false); // Kararmayı önlemek için
  const scrollRef = useRef(null);

  // --- CANLI AKIŞ VERİLERİ (BOŞ KALMAMASI İÇİN) ---
  const newsFeed = [
    { title: "Yapay Zeka Devrimi", desc: "OpenAI yeni modelini duyurdu, piyasalar hareketli.", tag: "TECH" },
    { title: "Kripto Analizi", desc: "Bitcoin direnç noktasını zorluyor, operatör tetikte olmalı.", tag: "INVEST" }
  ];

  const reelsFeed = [
    { id: 1, title: "10x Kariyer Hamlesi", views: "1.2M" },
    { id: 2, title: "Geleceğin Yazılım Dilleri", views: "800K" }
  ];

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleAction = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    setHasError(false);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nKullanıcı: ${userMsg}` }] }] })
      });

      if (!response.ok) throw new Error("API Limit");
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'syn', text: data.candidates[0].content.parts[0].text }]);
    } catch (err) {
      setHasError(true);
      setMessages(prev => [...prev, { role: 'syn', text: 'Bağlantı paraziti: Manuel yedekleme protokolü aktif. Ama akış kesilmez.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans flex flex-col overflow-hidden">
      
      {/* ÜST NAVİGASYON - HİÇBİR ZAMAN BOŞ KALMAZ */}
      <nav className="p-4 border-b border-white/5 bg-black/50 backdrop-blur-xl flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/40"><Zap size={20} fill="white" /></div>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">Vortex <span className="text-blue-500 font-glow">Mega</span></h1>
        </div>
        
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          {['intelligence', 'reels', 'career', 'invest'].map(id => (
            <button key={id} onClick={() => setActiveTab(id)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === id ? 'bg-blue-600' : 'text-slate-500'}`}>
              {id}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-blue-900/20 px-4 py-2 rounded-full border border-blue-500/30">
          <EyeOff size={14} className="text-blue-500" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Operator Mode</span>
        </div>
      </nav>

      <main className="flex-grow flex overflow-hidden">
        {/* SOL: HABER AKIŞI (TWITTER STYLE) */}
        <aside className="w-80 hidden xl:flex flex-col border-r border-white/5 p-6 space-y-6 overflow-y-auto">
          <h3 className="text-[10px] font-black text-blue-500 tracking-[0.3em] uppercase">Canlı İstihbarat</h3>
          {newsFeed.map((news, i) => (
            <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all cursor-pointer group">
              <span className="text-[8px] font-black text-blue-400 uppercase">{news.tag}</span>
              <p className="text-sm font-bold mt-1 group-hover:text-blue-400 transition-colors">{news.title}</p>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{news.desc}</p>
            </div>
          ))}
        </aside>

        {/* ORTA: SOHBET & İŞLEM TERMİNALİ */}
        <section className="flex-grow flex flex-col bg-black relative border-r border-white/5">
          <div className="flex-grow overflow-y-auto p-6 space-y-6 pb-32">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'syn' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-5 rounded-[25px] max-w-[85%] ${m.role === 'syn' ? 'bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20' : 'bg-white/5 border border-white/10'}`}>
                    <p className="text-sm leading-relaxed">{m.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" /></div>}
            {hasError && <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold"><AlertTriangle size={14}/> SİNYAL KAYBI: YEDEK PROTOKOL DEVREDE</div>}
            <div ref={scrollRef} />
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
            <form onSubmit={handleAction} className="relative max-w-3xl mx-auto">
              <input 
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Komut ver..." 
                className="w-full bg-[#111] border border-white/10 rounded-2xl py-5 px-8 text-sm focus:border-blue-600 transition-all outline-none"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-xl hover:scale-105 transition-all"><Send size={18}/></button>
            </form>
          </div>
        </section>

        {/* SAĞ: REELS / VİDEO AKIŞI (TIKTOK STYLE) */}
        <aside className="w-96 hidden lg:flex flex-col p-6 space-y-6 overflow-y-auto">
          <h3 className="text-[10px] font-black text-blue-500 tracking-[0.3em] uppercase flex items-center gap-2"><Play size={14}/> Vortex Reels</h3>
          {reelsFeed.map(reel => (
            <div key={reel.id} className="aspect-[9/16] bg-gradient-to-t from-blue-900/40 to-black border border-white/10 rounded-[35px] relative group overflow-hidden cursor-pointer shadow-2xl">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all flex items-center justify-center">
                <Play fill="white" size={40} className="opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              </div>
              <div className="absolute bottom-6 left-6">
                <p className="text-xs font-black uppercase tracking-tighter shadow-lg">{reel.title}</p>
                <p className="text-[9px] text-blue-400 font-bold mt-1 uppercase">{reel.views} İzlenme</p>
              </div>
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
}
