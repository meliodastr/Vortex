import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Activity, Shield, Lock, ChevronRight, EyeOff, LayoutGrid, Newspaper, Play, TrendingUp, Briefcase } from 'lucide-react';

// --- SİSTEM PARAMETRELERİ ---
const API_KEY = "AIzaSyA18X6YVeMkwAA1sriSA9YP1QZSLseoXoc";
const SYSTEM_PROMPT = `Sen SYN'sin. Vortex Mega Portal'ın merkezi zekasısın. 
Görevlerin: 
1. Twitter gibi anlık haber analizi yap.
2. TikTok gibi hızlı ve çarpıcı bilgi reelsleri üret.
3. YouTube gibi derinlemesine kariyer ve yatırım stratejisi ver.
Kullanıcıya asla ismiyle hitap etme, o "Operatör"dür. Üslubun: Ultra-modern, hızlı ve etkili.`;

export default function App() {
  const [activeTab, setActiveTab] = useState('intelligence'); // intelligence, reels, career, invest
  const [messages, setMessages] = useState([
    { role: 'syn', text: 'Vortex Multi-Feed Aktif. Twitter, TikTok, YouTube ve LinkedIn veri havuzları Gateway üzerinden bağlandı. Hangi frekanstayız Operatör?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // --- GATEWAY MOTORU ---
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
        body: JSON.stringify({ contents: [{ parts: [{ text: `[Mod: ${activeTab.toUpperCase()}] ${SYSTEM_PROMPT}\n\nKullanıcı: ${userMsg}` }] }] })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'syn', text: data.candidates[0].content.parts[0].text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'syn', text: 'Gateway Sinyal Hatası. Vercel üzerinden tekrar bağlanılıyor...' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-hidden flex flex-col">
      {/* ÜST PANEL: NAVİGASYON (ÇOKLU VERİ) */}
      <nav className="p-4 bg-black/80 border-b border-white/5 backdrop-blur-md flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg"><Zap size={18} fill="white" /></div>
          <h1 className="text-xl font-black italic tracking-tighter uppercase">Vortex <span className="text-blue-500">Mega</span></h1>
        </div>
        
        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          {[
            { id: 'intelligence', icon: <Newspaper size={14} />, label: 'News' },
            { id: 'reels', icon: <Play size={14} />, label: 'Reels' },
            { id: 'career', icon: <Briefcase size={14} />, label: 'Career' },
            { id: 'invest', icon: <TrendingUp size={14} />, label: 'Invest' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-white'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <EyeOff size={16} className="text-blue-500" />
          <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Operator: HIDDEN</span>
        </div>
      </nav>

      {/* ANA İÇERİK ALANI */}
      <main className="flex-grow flex overflow-hidden">
        {/* SOL PANEL: TRENDLER (TWITTER MANTIĞI) */}
        <aside className="w-80 hidden xl:flex flex-col border-r border-white/5 p-6 bg-white/[0.01]">
          <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6">Anlık Trendler</h3>
          <div className="space-y-4">
            {['#AI_REVOLUTION', '#VORTEX_TECH', '#SOLANA_PUMP', '#ELITE_CAREER'].map((trend, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/50 cursor-pointer transition-all">
                <p className="text-[10px] font-bold text-blue-400">{trend}</p>
                <p className="text-[9px] text-slate-500 uppercase mt-1">1.2k Kişi Konuşuyor</p>
              </div>
            ))}
          </div>
        </aside>

        {/* ORTA PANEL: CHAT & FEED (DİNAMİK) */}
        <section className="flex-grow flex flex-col relative bg-black">
          <div className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-hide pb-24">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'syn' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-6 rounded-3xl max-w-[85%] shadow-2xl ${m.role === 'syn' ? 'bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20' : 'bg-white/5 border border-white/10'}`}>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[7px] font-black uppercase tracking-widest opacity-30">{m.role === 'syn' ? `SYN_${activeTab.toUpperCase()}` : 'OPERATOR'}</span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{m.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={scrollRef} />
          </div>

          {/* INPUT (SABİT) */}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black to-transparent">
            <form onSubmit={handleAction} className="relative max-w-4xl mx-auto">
              <input 
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder={`${activeTab} modunda sorgula...`} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-blue-500 transition-all shadow-2xl text-sm"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all">
                <Send size={18} />
              </button>
            </form>
          </div>
        </section>

        {/* SAĞ PANEL: REELS & SÜPER BİLGİ (TIKTOK/TIKTOK MANTIĞI) */}
        <aside className="w-96 hidden lg:flex flex-col border-l border-white/5 bg-white/[0.01] p-6">
           <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><Play size={12}/> Vortex Reels</h3>
           <div className="space-y-4 overflow-y-auto scrollbar-hide">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[9/16] w-full bg-gradient-to-b from-blue-600/20 to-black rounded-[30px] border border-white/10 relative overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play fill="white" size={48} />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] font-black uppercase bg-blue-600 inline-block px-2 py-1 rounded mb-2">Yatırım Sırları</p>
                    <p className="text-xs font-bold leading-tight">Zenginlerin sakladığı 3 kariyer hamlesi...</p>
                  </div>
                </div>
              ))}
           </div>
        </aside>
      </main>
    </div>
  );
}
