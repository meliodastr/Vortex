import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, Activity, Globe, TrendingUp, Zap, 
  Play, Volume2, VolumeX, Lock, 
  Cpu, Rocket, DollarSign, Gamepad2, 
  Palette, Music, Film, Newspaper, 
  Briefcase, HeartPulse, Plane, Smartphone,
  Send, RefreshCw, Wifi, WifiOff, BarChart3
} from 'lucide-react';

// --- KATEGORİ VE VİDEO EŞLEŞTİRMELERİ ---
const CATEGORIES = [
  { id: 'ai', name: 'Yapay Zeka', icon: <Cpu size={16} />, color: 'from-blue-500 to-cyan-500', symbol: 'NASDAQ:NVDA', vid: '9bZkp7q19f0' },
  { id: 'crypto', name: 'Kripto', icon: <DollarSign size={16} />, color: 'from-orange-500 to-yellow-500', symbol: 'BINANCE:BTCUSDT', vid: '0f-jL_mNn_A' },
  { id: 'movies', name: 'Sinema', icon: <Film size={16} />, color: 'from-amber-500 to-orange-500', symbol: 'NYSE:DIS', vid: '9bZkp7q19f0' },
  { id: 'finance', name: 'Finans', icon: <TrendingUp size={16} />, color: 'from-emerald-500 to-teal-500', symbol: 'TVC:GOLD', vid: '9W44OAtzSUE' },
  { id: 'space', name: 'Uzay', icon: <Rocket size={16} />, color: 'from-purple-500 to-pink-500', symbol: 'NYSE:SPCE', vid: 'GoW8Tf7h978' },
  { id: 'tech', name: 'Teknoloji', icon: <Smartphone size={16} />, color: 'from-green-500 to-emerald-500', symbol: 'NASDAQ:AAPL', vid: 'vS6wzjpCvec' }
];

const GEMINI_API_KEY = "AIzaSyA18X6YVeMkwAA1sriSA9YP1QZSLseoXoc";

export default function VortexRadar() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [eliteMode, setEliteMode] = useState(false);
  
  const chatEndRef = useRef(null);
  const synth = useRef(window.speechSynthesis);

  // Auto-scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- TREND VERİSİ ÇEKME ---
  const fetchTrendData = useCallback(async (catId) => {
    setLoading(true);
    const cat = CATEGORIES.find(c => c.id === catId);
    // Simüle ama gerçekçi veri yapısı
    const mockData = [
      { title: `${cat.name} Sinyal Artışı`, volume: '2.4M', change: '+412%', hot: true },
      { title: `${cat.name} Global Analiz`, volume: '1.2M', change: '+120%', hot: false },
      { title: `SYN-Prime ${cat.name} Raporu`, volume: '850K', change: '+85%', hot: false }
    ];
    setTrendData(mockData);
    setSelectedVideo({ title: mockData[0].title, embed: cat.vid });
    setLoading(false);
  }, []);

  useEffect(() => { fetchTrendData(activeCategory); }, [activeCategory, fetchTrendData]);

  // --- TRADINGVIEW WIDGET ---
  const TradingViewWidget = ({ symbol }) => {
    const container = useRef();
    useEffect(() => {
        container.current.innerHTML = "";
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
          "symbol": symbol, "width": "100%", "height": "100%", "locale": "tr",
          "dateRange": "12M", "colorTheme": "dark", "trendLineColor": "rgba(41, 98, 255, 1)",
          "underLineColor": "rgba(41, 98, 255, 0.3)", "isTransparent": true, "autosize": true
        });
        container.current.appendChild(script);
      }, [symbol]);
    return <div className="h-full w-full" ref={container}></div>;
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Sen Cemilay'sın. Vortex Radar analistisin. Kullanıcının şu sorusuna kısa ve profesyonel cevap ver: ${userMsg}` }] }] })
      });
      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      if (voiceEnabled) speak(aiText);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: "Sinyal kesildi, Cemilay çevrimdışı." }]);
    }
  };

  const speak = (text) => {
    synth.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'tr-TR'; u.rate = 1;
    synth.current.speak(u);
  };

  const currentCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-hidden">
      {/* HEADER */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Radar className="text-blue-500 animate-spin-slow" size={24} />
          <h1 className="text-xl font-black italic uppercase tracking-tighter">Vortex <span className="text-blue-500">Radar</span></h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-2 rounded-lg border transition-all ${voiceEnabled ? 'bg-blue-600/20 border-blue-500' : 'bg-white/5 border-white/10'}`}>
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button onClick={() => setEliteMode(!eliteMode)} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-xs font-black text-black">
            {eliteMode ? 'ELITE AKTIF' : 'YÜKSELT'}
          </button>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-6 grid grid-cols-12 gap-6 h-[calc(100vh-80px)]">
        {/* SOL PANEL: SEKTÖRLER */}
        <div className="col-span-2 flex flex-col gap-2 overflow-y-auto">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${activeCategory === cat.id ? 'bg-white/10 border-white/20 shadow-xl' : 'border-transparent bg-white/5 hover:bg-white/10'}`}>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${cat.color}`}>{cat.icon}</div>
              <span className="text-xs font-bold">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* ORTA PANEL: TRENDLER & CHAT */}
        <div className="col-span-7 flex flex-col gap-6">
          <div className="flex-grow bg-white/[0.02] border border-white/5 rounded-3xl p-6 overflow-y-auto">
            <h2 className="text-sm font-black mb-4 uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Activity size={14} /> {currentCat.name} Sinyalleri
            </h2>
            <div className="space-y-3">
              {trendData.map((t, i) => (
                <motion.div key={i} initial={{ x: -20 }} animate={{ x: 0 }} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm">{t.title}</h3>
                    <span className="text-green-400 text-xs font-black">{t.change}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CHAT BOX */}
          <div className="h-64 bg-black/60 border border-white/10 rounded-3xl p-4 flex flex-col">
            <div className="flex-grow overflow-y-auto space-y-3 mb-3 text-xs">
              {messages.map((m, i) => (
                <div key={i} className={`p-3 rounded-xl ${m.role === 'user' ? 'bg-blue-600/20 ml-12 text-blue-100' : 'bg-white/5 mr-12 text-slate-300'}`}>
                  <b>{m.role === 'user' ? 'SYN' : 'CEMİLAY'}:</b> {m.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChat} className="relative">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Analiz iste..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" />
              <button type="submit" className="absolute right-2 top-2 p-1.5 bg-blue-600 rounded-lg"><Send size={14} /></button>
            </form>
          </div>
        </div>

        {/* SAĞ PANEL: VİDEO & GRAFİK */}
        <div className="col-span-3 flex flex-col gap-6">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 relative">
            <iframe src={`https://www.youtube.com/embed/${selectedVideo?.embed}?autoplay=1&mute=1`} className="w-full h-full" allowFullScreen />
          </div>
          <div className="flex-grow bg-white/[0.02] border border-white/5 rounded-3xl p-4">
             <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-500 uppercase">
               <BarChart3 size={12} /> Canlı Veri Akışı
             </div>
             <div className="h-40">
                <TradingViewWidget symbol={currentCat.symbol} />
             </div>
             <div className="mt-4 p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[10px] text-blue-200">
                Cemilay Notu: {currentCat.name} sektörü son 24 saatte %{Math.floor(Math.random()*15)+5} volatilite gösterdi.
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
