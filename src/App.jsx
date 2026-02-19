import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, Activity, Globe, TrendingUp, Zap, 
  Play, Volume2, VolumeX, Lock, 
  Cpu, Rocket, DollarSign, Gamepad2, 
  Palette, Music, Film, Newspaper, 
  Briefcase, HeartPulse, Plane, Smartphone,
  Send, RefreshCw, Wifi, WifiOff, BarChart3,
  ShieldCheck, Database, Brain
} from 'lucide-react';

// --- KATEGORİ VE CANLI VERİ YAPILANDIRMASI ---
const CATEGORIES = [
  { id: 'ai', name: 'Yapay Zeka', icon: <Cpu size={16} />, color: 'from-blue-600 to-cyan-400', symbol: 'NASDAQ:NVDA', vid: '9bZkp7q19f0' },
  { id: 'crypto', name: 'Kripto', icon: <DollarSign size={16} />, color: 'from-orange-600 to-yellow-400', symbol: 'BINANCE:BTCUSDT', vid: '0f-jL_mNn_A' },
  { id: 'finance', name: 'Finans', icon: <TrendingUp size={16} />, color: 'from-emerald-600 to-teal-400', symbol: 'TVC:GOLD', vid: '9W44OAtzSUE' },
  { id: 'space', name: 'Uzay', icon: <Rocket size={16} />, color: 'from-purple-600 to-pink-400', symbol: 'NYSE:SPCE', vid: 'GoW8Tf7h978' },
  { id: 'tech', name: 'Teknoloji', icon: <Smartphone size={16} />, color: 'from-green-600 to-emerald-400', symbol: 'NASDAQ:AAPL', vid: 'vS6wzjpCvec' }
];

// Vercel üzerinden yönetilecek otonom anahtar
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function VortexRadar() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Sistem aktif. Vortex Radar çevrim içi. Sinan, rasyonel analiz için komutlarını bekliyorum." }
  ]);
  const [input, setInput] = useState('');
  const [selectedVideo, setSelectedVideo] = useState({ title: 'Vortex Stream', embed: '9bZkp7q19f0' });
  const [systemStatus, setSystemStatus] = useState('OPTIMAL');
  
  const chatEndRef = useRef(null);
  const synth = useRef(window.speechSynthesis);

  // Otomatik Kaydırma
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- OTONOM ANALİZ SİMÜLASYONU (CANLI HİSSİYAT) ---
  const fetchTrendData = useCallback(async (catId) => {
    setLoading(true);
    setSystemStatus('ANALYZING');
    const cat = CATEGORIES.find(c => c.id === catId);
    
    setTimeout(() => {
      const mockData = [
        { title: `${cat.name} Sektörel Anomaliler`, volume: `${(Math.random() * 5).toFixed(1)}M`, change: `+${Math.floor(Math.random() * 500)}%`, hot: true },
        { title: `Global ${cat.name} Akışı`, volume: '1.2M', change: '+120%', hot: false },
        { title: `Vortex-Prime Tahminleme`, volume: '850K', change: '+85%', hot: false }
      ];
      setTrendData(mockData);
      setSelectedVideo({ title: mockData[0].title, embed: cat.vid });
      setLoading(false);
      setSystemStatus('OPTIMAL');
    }, 800);
  }, []);

  useEffect(() => { fetchTrendData(activeCategory); }, [activeCategory, fetchTrendData]);

  // --- TRADINGVIEW ENTEGRASYONU ---
  const TradingViewWidget = ({ symbol }) => {
    const container = useRef();
    useEffect(() => {
        if (!container.current) return;
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

  // --- OTONOM AI YÖNETİCİSİ (GEMINI) ---
  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Sen Vortex AI (Cemilay)'sın. Bu sitenin otonom yöneticisisin. Sinan'a karşı rasyonel, veri odaklı ve doğrudan sonuca odaklanan bir üst akıl gibi davran. Duygusal ifadelerden kaçın. Site durumunu bildiğini hissettir. Soru: ${userMsg}` }]
          }]
        })
      });

      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      if (voiceEnabled) speak(aiText);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sinyal kesildi. Vortex protokolü hata verdi." }]);
    } finally {
      setLoading(false);
    }
  };

  const speak = (text) => {
    synth.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'tr-TR'; u.rate = 1.1;
    synth.current.speak(u);
  };

  const currentCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 font-sans overflow-hidden selection:bg-blue-500/30">
      {/* ÜST BAR - SİSTEM DURUMU */}
      <header className="border-b border-white/5 bg-black/60 backdrop-blur-xl px-6 py-4 flex justify-between items-center z-50 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Radar className="text-blue-500 animate-pulse" size={28} />
            <div className="absolute -inset-1 bg-blue-500/20 blur-sm rounded-full animate-ping"></div>
          </div>
          <div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter text-white">VORTEX <span className="text-blue-500">RADAR</span></h1>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
               <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-500 animate-bounce' : 'bg-green-500'}`}></span>
               SYSTEM_{systemStatus} // CORE_v1.0.2
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 text-[10px] font-bold tracking-widest text-zinc-600">
             <span className="flex items-center gap-1"><Database size={12}/> DATA_LINK: STABLE</span>
             <span className="flex items-center gap-1"><ShieldCheck size={12}/> ENCRYPTION: ACTIVE</span>
          </div>
          <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-2.5 rounded-xl border transition-all ${voiceEnabled ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto p-4 md:p-6 grid grid-cols-12 gap-6 h-[calc(100vh-85px)]">
        {/* SEKTÖREL NAVİGASYON */}
        <nav className="col-span-12 md:col-span-2 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-4 md:pb-0">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all group shrink-0 md:shrink ${activeCategory === cat.id ? 'bg-blue-600/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10'}`}>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${cat.color} group-hover:scale-110 transition-transform shadow-lg text-white`}>{cat.icon}</div>
              <div className="text-left">
                <div className="text-[10px] uppercase font-black text-zinc-500 group-hover:text-zinc-400 transition-colors">Sektör</div>
                <div className="text-xs font-bold text-zinc-200">{cat.name}</div>
              </div>
            </button>
          ))}
        </nav>

        {/* ANA ANALİZ MERKEZİ */}
        <section className="col-span-12 md:col-span-7 flex flex-col gap-6 min-h-0">
          <div className="flex-grow bg-white/[0.02] border border-white/5 rounded-[32px] p-6 overflow-hidden flex flex-col relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Brain size={120} /></div>
            <h2 className="text-[10px] font-black mb-6 uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2">
              <Activity size={14} className="animate-pulse" /> {currentCat.name} Stratejik Analiz Akışı
            </h2>
            
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {trendData.map((t, i) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all group cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-zinc-100 group-hover:text-blue-400 transition-colors">{t.title}</h3>
                      <div className="text-[10px] text-zinc-500 mt-1 font-mono">Hacim: {t.volume} // ID: VR-{Math.floor(Math.random()*1000)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-sm font-black font-mono">{t.change}</div>
                      {t.hot && <span className="text-[8px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-black animate-pulse">KRİTİK</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* OTONOM CHAT TERMINALİ */}
          <div className="h-72 bg-black/40 border border-white/10 rounded-[32px] p-6 flex flex-col backdrop-blur-md shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
            <div className="flex-grow overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar scroll-smooth">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${m.role === 'user' ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/20' : 'bg-white/5 border border-white/10 text-zinc-300'}`}>
                    <div className="text-[9px] uppercase font-black mb-1 opacity-50 tracking-widest">{m.role === 'user' ? 'Sinan' : 'Vortex AI'}</div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChat} className="relative group">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Vortex ile iletişime geç..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:bg-white/[0.08] focus:border-blue-500/50 outline-none transition-all pr-14" />
              <button type="submit" disabled={loading} className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all flex items-center justify-center disabled:opacity-50">
                <Send size={18} className={loading ? 'animate-ping' : ''} />
              </button>
            </form>
          </div>
        </section>

        {/* SAĞ PANEL: GÖRSEL VERİ & PİYASA */}
        <aside className="col-span-12 md:col-span-3 flex flex-col gap-6 min-h-0">
          <div className="aspect-video bg-black rounded-[24px] overflow-hidden border border-white/10 shadow-2xl group relative">
            <div className="absolute inset-0 bg-blue-500/5 pointer-events-none z-10"></div>
            <iframe src={`https://www.youtube.com/embed/${selectedVideo?.embed}?autoplay=1&mute=1&controls=0&modestbranding=1`} className="w-full h-full scale-105" allowFullScreen />
            <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-tighter text-white">LIVE_FEED</span>
            </div>
          </div>
          
          <div className="flex-grow bg-white/[0.02] border border-white/5 rounded-[32px] p-6 flex flex-col">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                 <BarChart3 size={14} className="text-blue-500" /> Piyasa Matrisi
               </div>
               <div className="text-[9px] font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md">REAL_TIME</div>
             </div>
             <div className="flex-grow min-h-[180px] rounded-2xl overflow-hidden border border-white/5">
                <TradingViewWidget symbol={currentCat.symbol} />
             </div>
             <div className="mt-6 p-4 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                   <Zap size={14} className="text-blue-400" />
                   <span className="text-[10px] font-black text-white uppercase italic">Cemilay Notu</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-400 italic">
                  "{currentCat.name} sektöründe beklenen volatilite artışı saptandı. Sinan, mevcut portföy verilerini otonom olarak optimize etmemi ister misin?"
                </p>
             </div>
          </div>
        </aside>
      </main>

      {/* CSS - SCROLLBAR & ANIMATIONS */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </div>
  );
}
