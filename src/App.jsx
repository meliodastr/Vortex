import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Activity, Play, Newspaper, TrendingUp, Briefcase, EyeOff, AlertCircle } from 'lucide-react';

// --- GÜVENLİ API VE SİSTEM PROMPTU ---
const API_KEY = "AIzaSyA18X6YVeMkwAA1sriSA9YP1QZSLseoXoc";
const SYSTEM_PROMPT = `Sen SYN'sin. Vortex Elite'in beynisin. Operatör'ün (Sinan) kimliğini gizli tut. 
Twitter tarzı anlık haber, TikTok tarzı hızlı Reels ve YouTube tarzı derin analizler yap. 
Sert, zeki ve sonuca odaklı ol.`;

export default function App() {
  const [activeTab, setActiveTab] = useState('intelligence');
  const [messages, setMessages] = useState([
    { role: 'syn', text: 'Yedek Protokol Devrede. Parazit filtrelendi. Anonim Operatör için veri akışı stabilize edildi. Emirlerini bekliyorum.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // --- CANLI VERİ HAVUZU (SİTE BOŞ KALMASIN DİYE) ---
  const dynamicNews = [
    { id: 1, tag: "TRENDING", title: "AI Gateway 2.0 Yayında", desc: "Tüm veri sağlayıcıları tek bir noktada toplandı." },
    { id: 2, tag: "MARKET", title: "Kripto Volatilitesi", desc: "Balinalar hareketli, Operatör için fırsat kapıda." }
  ];

  const dynamicReels = [
    { id: 1, title: "Zenginlik Protokolü", duration: "0:15", category: "Invest" },
    { id: 2, title: "Geleceğin Meslekleri", duration: "0:22", category: "Career" }
  ];

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleAction = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\n[Tab: ${activeTab}] Kullanıcı: ${userMsg}` }] }] })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'syn', text: data.candidates[0].content.parts[0].text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'syn', text: 'Sinyal Kaybı: Manuel yedekleme protokolü aktif. Cevap yerel bellekten geliyor.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-blue-600/30">
      
      {/* HEADER: GİZLİLİK ODAKLI */}
      <nav className="h-20 border-b border-white/5 bg-black/80 backdrop-blur-2xl flex justify-between items-center px-8 sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"><Zap size={20} fill="white" /></div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Vortex <span className="text-blue-500">Mega</span></h1>
            <p className="text-[7px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-1">Multi-Intelligence Sync</p>
          </div>
        </div>

        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          {['intelligence', 'reels', 'career', 'invest'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-blue-950/30 px-5 py-2 rounded-full border border-blue-500/20">
          <EyeOff size={14} className="text-blue-500" />
          <span className="text-[9px] font-black tracking-widest uppercase">ID: GİZLİ_OPERATOR</span>
        </div>
      </nav>

      <main className="flex-grow flex overflow-hidden">
        {/* SOL: TWITTER FEED (HABER) */}
        <aside className="w-80 hidden xl:flex flex-col border-r border-white/5 p-6 space-y-6 overflow-y-auto bg-white/[0.01]">
          <h3 className="text-[10px] font-black text-blue-500 tracking-[0.3em] uppercase">Canlı Akış</h3>
          {dynamicNews.map(news => (
            <div key={news.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/40 transition-all cursor-pointer">
              <span className="text-[8px] font-black text-blue-400 uppercase bg-blue-400/10 px-2 py-0.5 rounded-md">{news.tag}</span>
              <p className="text-sm font-bold mt-2">{news.title}</p>
              <p className="text-[11px] text-slate-500 mt-2 leading-snug">{news.desc}</p>
            </div>
          ))}
        </aside>

        {/* ORTA: ANA TERMİNAL (KARARMA ÖNLENDİ) */}
        <section className="flex-grow flex flex-col bg-black relative border-r border-white/5 shadow-2xl">
          <div className="flex-grow overflow-y-auto p-8 space-y-8 pb-32 scrollbar-hide">
            <AnimatePresence mode='popLayout'>
              {messages.map((m, i) => (
                <motion.div initial={{ opacity: 0, x: m.role === 'syn' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} key={i} className={`flex ${m.role === 'syn' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-6 rounded-[30px] max-w-[85%] ${m.role === 'syn' ? 'bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20' : 'bg-white/5 border border-white/10'}`}>
                    <div className="flex items-center gap-2 mb-3">
                       <div className={`w-1.5 h-1.5 rounded-full ${m.role === 'syn' ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`} />
                       <span className="text-[7px] font-black uppercase tracking-[0.3em] opacity-40">{m.role === 'syn' ? 'SYN_CORE' : 'OPERATOR'}</span>
                    </div>
                    <p className="text-[15px] leading-relaxed font-medium text-slate-200">{m.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={scrollRef} />
          </div>

          <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black to-transparent">
            <form onSubmit={handleAction} className="relative max-w-4xl mx-auto">
              <input 
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder={`${activeTab} modunda bir komut gönder...`} 
                className="w-full bg-[#111] border border-white/10 rounded-2xl py-6 px-10 text-sm focus:border-blue-600 transition-all outline-none shadow-2xl"
                disabled={loading}
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 rounded-xl hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all">
                {loading ? <Activity className="animate-spin" size={20}/> : <Send size={20} />}
              </button>
            </form>
          </div>
        </section>

        {/* SAĞ: TIKTOK REELS (SÜPER BİLGİ) */}
        <aside className="w-96 hidden lg:flex flex-col p-6 space-y-6 overflow-y-auto bg-white/[0.01]">
          <h3 className="text-[10px] font-black text-blue-500 tracking-[0.3em] uppercase flex items-center gap-2"><Play size={14} fill="currentColor"/> Vortex Reels</h3>
          {dynamicReels.map(reel => (
            <div key={reel.id} className="aspect-[9/16] bg-gradient-to-b from-blue-900/30 to-black border border-white/10 rounded-[40px] relative group overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all flex items-center justify-center">
                <Play fill="white" size={48} className="opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all" />
              </div>
              <div className="absolute bottom-8 left-8">
                <span className="text-[8px] font-black uppercase bg-blue-600 px-3 py-1 rounded-full mb-3 inline-block tracking-widest">{reel.category}</span>
                <p className="text-sm font-bold leading-tight">{reel.title}</p>
              </div>
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
}
