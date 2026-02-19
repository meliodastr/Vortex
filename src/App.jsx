import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, Activity, Cpu, Rocket, DollarSign, Smartphone, TrendingUp,
  Send, Volume2, VolumeX, BarChart3, Brain, Zap, ShieldCheck, Sparkles
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const CATEGORIES = [
  { id: 'ai', name: 'Yapay Zeka', icon: <Cpu size={16} />, color: 'from-blue-600 to-cyan-400', symbol: 'NASDAQ:NVDA', vid: '9bZkp7q19f0' },
  { id: 'crypto', name: 'Kripto', icon: <DollarSign size={16} />, color: 'from-orange-600 to-yellow-400', symbol: 'BINANCE:BTCUSDT', vid: '0f-jL_mNn_A' },
  { id: 'finance', name: 'Finans', icon: <TrendingUp size={16} />, color: 'from-emerald-600 to-teal-400', symbol: 'TVC:GOLD', vid: '9W44OAtzSUE' },
  { id: 'space', name: 'Uzay', icon: <Rocket size={16} />, color: 'from-purple-600 to-pink-400', symbol: 'NYSE:SPCE', vid: 'GoW8Tf7h978' },
  { id: 'tech', name: 'Teknoloji', icon: <Smartphone size={16} />, color: 'from-green-600 to-emerald-400', symbol: 'NASDAQ:AAPL', vid: 'vS6wzjpCvec' }
];

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [messages, setMessages] = useState([{ role: 'ai', text: "Vortex Radar aktif. Sistem Sinan için hazır." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Sen Vortex AI'sın. Bu siteyi yöneten rasyonel bir üst akılsın. Sinan'a kısa ve öz analizler sunarsın."
      });
      const result = await model.generateContent(userMsg);
      const text = result.response.text();
      setMessages(prev => [...prev, { role: 'ai', text }]);
      if (voiceEnabled) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'tr-TR';
        window.speechSynthesis.speak(u);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sinyal hatası. Vercel panelindeki API anahtarını kontrol et." }]);
    } finally { setLoading(false); }
  };

  const currentCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans overflow-hidden">
      <header className="border-b border-white/5 bg-black/60 p-4 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Radar className="text-blue-500 animate-pulse" size={24} />
          <h1 className="text-xl font-black italic tracking-tighter uppercase">Vortex <span className="text-blue-500 text-sm">Radar</span></h1>
        </div>
        <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="p-2 bg-white/5 rounded-xl border border-white/10 text-blue-400">
          {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </header>

      <main className="max-w-[1800px] mx-auto p-6 grid grid-cols-12 gap-6 h-[calc(100vh-80px)]">
        <div className="col-span-2 flex flex-col gap-2 overflow-y-auto pr-2">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${activeCategory === cat.id ? 'bg-blue-600/10 border-blue-500/50 shadow-lg' : 'bg-white/5 border-transparent'}`}>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${cat.color}`}>{cat.icon}</div>
              <span className="text-xs font-bold">{cat.name}</span>
            </button>
          ))}
        </div>

        <div className="col-span-7 flex flex-col gap-6">
          <div className="flex-grow bg-white/[0.02] border border-white/5 rounded-[32px] p-6 overflow-y-auto">
             <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-blue-500 uppercase tracking-widest mb-4">
                  <Activity size={14}/> {currentCat.name} Sinyal Akışı
                </div>
                {[1,2,3].map(i => (
                  <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center hover:border-blue-500/30 transition-all">
                    <span className="text-sm font-medium">Analiz Modülü #{i*244}</span>
                    <span className="text-green-400 font-mono text-xs">+%{Math.floor(Math.random()*100)}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="h-64 bg-black/40 border border-white/10 rounded-[32px] p-4 flex flex-col backdrop-blur-md">
            <div className="flex-grow overflow-y-auto space-y-3 mb-3 text-xs pr-2">
              {messages.map((m, i) => (
                <div key={i} className={`p-3 rounded-xl ${m.role === 'user' ? 'bg-blue-600/20 ml-12' : 'bg-white/5 mr-12'}`}>
                  <b className="text-[10px] text-blue-400 uppercase block mb-1">{m.role === 'user' ? 'Sinan' : 'Vortex'}</b>
                  {m.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChat} className="relative">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Komut ver..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500" />
              <button type="submit" className="absolute right-2 top-2 p-1.5 bg-blue-600 rounded-lg shrink-0"><Send size={14} /></button>
            </form>
          </div>
        </div>

        <div className="col-span-3 flex flex-col gap-6">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 relative">
             <iframe src={`https://www.youtube.com/embed/${currentCat.vid}?autoplay=1&mute=1&controls=0`} className="w-full h-full border-none" />
             <div className="absolute top-2 left-2 bg-red-600 text-[8px] font-black px-2 py-1 rounded animate-pulse">LIVE</div>
          </div>
          <div className="flex-grow bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
             <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                <BarChart3 size={12}/> {currentCat.symbol} Veri Matrisi
             </div>
             <div className="space-y-4">
                <div className="text-2xl font-black text-white">$ {Math.floor(Math.random()*90000)}</div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-[65%] animate-pulse"></div>
                </div>
                <p className="text-[10px] text-zinc-500 italic">"Sistem Sinan'ın emirlerini rasyonel olarak işliyor. Sektörel anomali tespit edilmedi."</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
