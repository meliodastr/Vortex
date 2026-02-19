import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, Cpu, Rocket, DollarSign, Smartphone, TrendingUp,
  Send, Volume2, VolumeX, BarChart3, Brain, Zap, 
  Share2, MessageCircle, Heart, Repeat2, ExternalLink, Play
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const CATEGORIES = [
  { 
    id: 'ai', name: 'Artificial Intelligence', icon: <Cpu />, color: 'from-blue-600', 
    vid: '9bZkp7q19f0', symbol: 'NVDA',
    tweets: [
      { id: 1, user: 'Vortex_Alpha', text: 'Gemini 1.5 Flash entegrasyonu tamamlandı. SYN için veri işleme kapasitesi %40 artırıldı.', time: '2d' },
      { id: 2, user: 'Neural_Net', text: 'LLM mimarilerinde yeni bir kırılma noktası: Rasyonel analiz artık otonom.', time: '5h' }
    ]
  },
  { 
    id: 'crypto', name: 'Crypto Assets', icon: <DollarSign />, color: 'from-orange-600', 
    vid: '0f-jL_mNn_A', symbol: 'BTC',
    tweets: [
      { id: 1, user: 'Chain_Watcher', text: 'On-chain verileri büyük bir balina hareketliliği saptadı. SYN, dikkatli ol.', time: '12m' },
      { id: 2, user: 'DeFi_Pulse', text: 'Likidite havuzlarında ani daralma. Vortex protokolü koruma modunda.', time: '1h' }
    ]
  },
  { 
    id: 'space', name: 'Space Exploration', icon: <Rocket />, color: 'from-purple-600', 
    vid: 'GoW8Tf7h978', symbol: 'SPCE',
    tweets: [
      { id: 1, user: 'Orbit_News', text: 'Mars kolonizasyonu için yeni roket prototipi ateşlendi.', time: '45m' },
      { id: 2, user: 'Starlink_Tracker', text: 'Yörünge verimliliği %99.8 seviyesinde sabitlendi.', time: '3h' }
    ]
  }
];

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || ""); // Boş string ile crash önlendi

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [messages, setMessages] = useState([{ role: 'ai', text: "Vortex Radar aktif. Sistem SYN için rasyonel analize hazır." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !API_KEY) {
        if(!API_KEY) setMessages(prev => [...prev, { role: 'ai', text: "HATA: Vercel panelinde VITE_GEMINI_API_KEY tanımlanmamış SYN." }]);
        return;
    }
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Sen Vortex AI'sın. Kullanıcın SYN'dir. Rasyonel, teknolojik ve kısa cevaplar ver. Asla Sinan ismini kullanma."
      });
      const result = await model.generateContent(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: result.response.text() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sinyal hatası: API anahtarını kontrol et SYN." }]);
    } finally { setLoading(false); }
  };

  const current = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      
      {/* ÜST BAR (GLASSMORPHISM) */}
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex justify-between items-center px-6 z-50">
        <div className="flex items-center gap-4">
          <Radar className="text-blue-500 animate-pulse" />
          <h1 className="font-black italic text-xl tracking-tighter text-white">VORTEX<span className="text-blue-500">NEXUS</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 text-[10px] font-mono text-zinc-500">
            <span>CPU_LOAD: 24%</span>
            <span className="text-green-500">SYN_AUTH: VERIFIED</span>
          </div>
          <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="p-2 rounded-full bg-white/5 border border-white/10 text-blue-400">
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      <div className="flex-grow flex p-4 gap-4 overflow-hidden">
        
        {/* SOL: SEKTÖR SEÇİCİ (TWITTER STYLE NAV) */}
        <nav className="w-20 md:w-64 flex flex-col gap-3 h-full">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)}
              className={`p-4 rounded-2xl flex items-center gap-4 transition-all border ${activeCategory === cat.id ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-2xl shadow-blue-500/10' : 'bg-transparent border-transparent hover:bg-white/5'}`}
            >
              <div className={`p-2 rounded-xl bg-gradient-to-br ${cat.color} to-black shadow-lg`}>{cat.icon}</div>
              <span className="hidden md:block font-bold text-sm uppercase tracking-widest">{cat.name}</span>
            </button>
          ))}
          <div className="mt-auto p-4 bg-white/5 border border-white/5 rounded-2xl">
             <div className="flex items-center gap-2 mb-2"><Zap size={14} className="text-yellow-500" /><span className="text-[10px] font-black uppercase">Core Status</span></div>
             <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[80%] animate-pulse"></div></div>
          </div>
        </nav>

        {/* ORTA: FEED (YOUTUBE + TWITTER HYBRID) */}
        <main className="flex-grow flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          
          {/* VİDEO ANALİZ PANELİ (YOUTUBE STYLE) */}
          <div className="w-full aspect-video bg-black rounded-[32px] overflow-hidden border border-white/10 shadow-3xl relative group">
            <iframe 
              src={`https://www.youtube.com/embed/${current.vid}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`} 
              className="w-full h-full object-cover opacity-80" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">{current.name} Visual Feed</h2>
                    <div className="flex gap-2">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">LIVE</span>
                        <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded">VORTEX_DATA_STREAM</span>
                    </div>
                </div>
                <button className="p-4 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:scale-110 transition-transform">
                    <Play fill="white" size={24} />
                </button>
            </div>
          </div>

          {/* BİLGİ KARTLARI (TWITTER STYLE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current.tweets.map(tweet => (
              <div key={tweet.id} className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px] hover:bg-white/[0.06] transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">V</div>
                    <div>
                        <div className="font-bold text-white flex items-center gap-1">@{tweet.user} <ShieldCheck size={12} className="text-blue-500" /></div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">{tweet.time} ago</div>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-zinc-600 group-hover:text-blue-400" />
                </div>
                <p className="text-sm leading-relaxed text-zinc-300 mb-4">{tweet.text}</p>
                <div className="flex gap-6 text-zinc-500">
                    <div className="flex items-center gap-1 hover:text-blue-400 cursor-pointer text-[10px]"><MessageCircle size={14} /> 12</div>
                    <div className="flex items-center gap-1 hover:text-green-400 cursor-pointer text-[10px]"><Repeat2 size={14} /> 4</div>
                    <div className="flex items-center gap-1 hover:text-red-400 cursor-pointer text-[10px]"><Heart size={14} /> 89</div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* SAĞ: AI TERMINAL (X STYLE CHAT) */}
        <aside className="hidden lg:flex w-96 flex-col gap-4">
          <div className="flex-grow bg-black/40 border border-white/10 rounded-[32px] backdrop-blur-3xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center gap-3">
                <Brain className="text-blue-500" size={20} />
                <h3 className="font-black text-xs uppercase tracking-widest text-white">Vortex Terminal</h3>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl text-[12px] leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 border border-white/10 text-zinc-300'}`}>
                    <div className="text-[9px] uppercase font-black mb-1 opacity-50 tracking-widest">
                        {m.role === 'user' ? 'SYN' : 'Vortex AI'}
                    </div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5">
                <form onSubmit={handleChat} className="relative group">
                    <input 
                        value={input} 
                        onChange={e => setInput(e.target.value)} 
                        placeholder="Komut ver SYN..." 
                        className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-xs focus:border-blue-500 outline-none transition-all pr-12" 
                    />
                    <button type="submit" className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all">
                        <Send size={16} />
                    </button>
                </form>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 p-6 rounded-[32px]">
             <h4 className="text-[10px] font-black uppercase text-blue-400 mb-2 flex items-center gap-2"><BarChart3 size={14}/> Market Matrix</h4>
             <div className="text-2xl font-black text-white tracking-tighter">$ {Math.floor(Math.random()*90000).toLocaleString()}</div>
             <p className="text-[10px] text-zinc-500 mt-2 italic">SYN, sistem rasyonel aralıkta çalışıyor.</p>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59,130,246,0.5); }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
