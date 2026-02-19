import React, { useState, useEffect, useRef } from 'react';
import { 
  Radar, Cpu, Rocket, DollarSign, Send, 
  Volume2, VolumeX, BarChart3, Zap, 
  MessageCircle, Heart, Repeat2, Play 
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- VERİ MATRİSİ ---
const CATEGORIES = [
  { id: 'ai', name: 'Artificial Intelligence', icon: <Cpu size={18}/>, color: 'from-blue-600', vid: '9bZkp7q19f0', tweets: [{ id: 1, user: 'Vortex_AI', text: 'SYN için rasyonel veri akışı stabilize edildi.', time: '1m' }] },
  { id: 'crypto', name: 'Crypto Assets', icon: <DollarSign size={18}/>, color: 'from-orange-600', vid: '0f-jL_mNn_A', tweets: [{ id: 1, user: 'Crypto_Watch', text: 'Piyasa volatilitesi SYN tarafından izleniyor.', time: '5m' }] },
  { id: 'space', name: 'Space Exploration', icon: <Rocket size={18}/>, color: 'from-purple-600', vid: 'GoW8Tf7h978', tweets: [{ id: 1, user: 'Orbit_News', text: 'Yörünge verileri Vortex terminaline aktarılıyor.', time: '12m' }] }
];

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [messages, setMessages] = useState([{ role: 'ai', text: "Vortex Nexus çevrimiçi. SYN için rasyonel analiz hazır." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const chatEndRef = useRef(null);

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
      setMessages(prev => [...prev, { role: 'ai', text: "KRİTİK HATA: API Anahtarı bulunamadı SYN. Vercel panelinden VITE_GEMINI_API_KEY ekle." }]);
      return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Sen Vortex AI'sın. Kullanıcın SYN. Rasyonel ve kısa cevap ver. Soru: ${userMsg}`);
      setMessages(prev => [...prev, { role: 'ai', text: result.response.text() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sinyal Kesildi: Protokol hatası SYN." }]);
    } finally { 
      setLoading(false); 
    }
  };

  const current = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans overflow-hidden">
      {/* HEADER */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex justify-between items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Radar className="text-blue-500 animate-pulse" />
          <h1 className="font-black italic text-xl tracking-tighter uppercase">Vortex<span className="text-blue-500">Nexus</span></h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:block text-[10px] font-mono text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">
            SYN_AUTHORIZED
           </div>
           <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="p-2 rounded-full bg-white/5 border border-white/10 text-blue-400">
            {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </header>

      <div className="flex-grow flex p-4 gap-4 overflow-hidden">
        {/* NAV */}
        <nav className="w-64 hidden lg:flex flex-col gap-2 shrink-0">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)} 
              className={`p-4 rounded-2xl flex items-center gap-3 border transition-all ${activeCategory === cat.id ? 'bg-blue-600/20 border-blue-500/50 shadow-2xl shadow-blue-500/10' : 'border-transparent hover:bg-white/5'}`}
            >
              <div className={`p-2 rounded-lg bg-gradient-to-br ${cat.color} to-black`}>{cat.icon}</div>
              <span className="font-bold text-xs uppercase tracking-widest">{cat.name}</span>
            </button>
          ))}
          <div className="mt-auto p-4 bg-white/5 border border-white/5 rounded-2xl">
             <div className="flex items-center gap-2 mb-2"><Zap size={14} className="text-yellow-500" /><span className="text-[10px] font-black uppercase">Core Status</span></div>
             <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[80%] animate-pulse"></div>
             </div>
          </div>
        </nav>

        {/* MAIN FEED */}
        <main className="flex-grow flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="w-full aspect-video bg-black rounded-[32px] overflow-hidden border border-white/10 relative group shadow-2xl shrink-0">
            <iframe 
              src={`https://www.youtube.com/embed/${current.vid}?autoplay=1&mute=1&controls=0&modestbranding=1`} 
              className="w-full h-full opacity-60 pointer-events-none scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-2">{current.name}</h2>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded font-bold uppercase">Live Feed</span>
                  <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Stream_ID: {current.id}</span>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current.tweets.map(t => (
              <div key={t.id} className="bg-white/5 border border-white/10 p-5 rounded-[24px] hover:bg-white/[0.08] transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold shadow-lg shadow-blue-500/20">V</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">@{t.user}</span>
                    <span className="text-[8px] text-zinc-500 uppercase">{t.time} ago</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed italic">"{t.text}"</p>
                <div className="flex gap-4 mt-4 text-zinc-600">
                  <MessageCircle size={14} className="hover:text-blue-500 cursor-pointer" /> 
                  <Repeat2 size={14} className="hover:text-green-500 cursor-pointer" /> 
                  <Heart size={14} className="hover:text-red-500 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* AI TERMINAL */}
        <aside className="w-80 hidden xl:flex flex-col gap-4 shrink-0">
          <div className="flex-grow bg-black/60 border border-white/10 rounded-[32px] flex flex-col overflow-hidden backdrop-blur-xl">
            <div className="p-4 border-b border-white/5 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-zinc-500">
              <BarChart3 size={14} className="text-blue-500" /> Terminal_SYN
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl text-[11px] leading-relaxed max-w-[90%] ${m.role === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/10 border border-white/5 text-zinc-300'}`}>
                    <div className="text-[7px] uppercase font-black mb-1 opacity-50 tracking-widest">
                      {m.role === 'user' ? 'Auth: SYN' : 'Vortex_AI'}
                    </div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChat} className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder="Komut..." 
                className="flex-grow bg-black/50 border border-white/10 rounded-xl p-3 text-[10px] outline-none focus:border-blue-500 text-white" 
              />
              <button type="submit" disabled={loading} className="p-3 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                <Send size={14} />
              </button>
            </form>
          </div>
          <div className="bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 p-5 rounded-[32px]">
             <h4 className="text-[10px] font-black uppercase text-blue-400 mb-2 flex items-center gap-2">Nexus Status</h4>
             <div className="text-xl font-black text-white tracking-tighter">SIGNAL: STABLE</div>
             <p className="text-[9px] text-zinc-500 mt-2 italic tracking-tight">Sistem rasyonel aralıkta çalışıyor.</p>
          </div>
        </aside>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>
    </div>
  );
}
