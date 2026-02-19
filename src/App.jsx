import React, { useState, useEffect, useRef } from 'react';
import { 
  Radar, Cpu, Rocket, DollarSign, Send, 
  Volume2, VolumeX, BarChart3, Brain, Zap, 
  MessageCircle, Heart, Repeat2, Play 
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- VERİ MATRİSİ ---
const CATEGORIES = [
  { id: 'ai', name: 'Artificial Intelligence', icon: <Cpu size={18}/>, color: 'from-blue-600', vid: '9bZkp7q19f0', tweets: [{ id: 1, user: 'Vortex_AI', text: 'SYN için rasyonel veri akışı stabilize edildi.', time: '1m' }] },
  { id: 'crypto', name: 'Crypto Assets', icon: <DollarSign size={18}/>, color: 'from-orange-600', vid: '0f-jL_mNn_A', tweets: [{ id: 1, user: 'Crypto_Watch', text: 'Piyasa volatilitesi SYN tarafından izleniyor.', time: '5m' }] }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [messages, setMessages] = useState([{ role: 'ai', text: "Vortex Nexus çevrimiçi. SYN için rasyonel analiz hazır." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // --- API GÜVENLİK KONTROLÜ ---
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    if (!API_KEY || API_KEY === "") {
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
    } finally { setLoading(false); }
  };

  const current = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans overflow-hidden">
      {/* HEADER */}
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <Radar className="text-blue-500 animate-pulse" />
          <h1 className="font-black italic text-xl tracking-tighter">VORTEX<span className="text-blue-500">NEXUS</span></h1>
        </div>
        <div className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">SYN_AUTHORIZED</div>
      </header>

      <div className="flex-grow flex p-4 gap-4 overflow-hidden">
        {/* NAV */}
        <nav className="w-64 flex flex-col gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`p-4 rounded-2xl flex items-center gap-3 border transition-all ${activeCategory === cat.id ? 'bg-blue-600/20 border-blue-500/50' : 'border-transparent hover:bg-white/5'}`}>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${cat.color} to-black`}>{cat.icon}</div>
              <span className="font-bold text-xs uppercase">{cat.name}</span>
            </button>
          ))}
        </nav>

        {/* MAIN FEED */}
        <main className="flex-grow flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="w-full aspect-video bg-black rounded-[32px] overflow-hidden border border-white/10 relative group shadow-2xl">
            <iframe src={`https://www.youtube.com/embed/${current.vid}?autoplay=1&mute=1&controls=0`} className="w-full h-full opacity-70" />
            <div className="absolute bottom-6 left-6">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">{current.name}</h2>
                <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded font-bold">LIVE FEED</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {current.tweets.map(t => (
              <div key={t.id} className="bg-white/5 border border-white/10 p-5 rounded-[24px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">V</div>
                  <span className="text-xs font-bold text-blue-400">@{t.user}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{t.text}</p>
                <div className="flex gap-4 mt-4 text-zinc-600"><MessageCircle size={14}/> <Repeat2 size={14}/> <Heart size={14}/></div>
              </div>
            ))}
          </div>
        </main>

        {/* AI TERMINAL */}
        <aside className="w-80 flex flex-col gap-4">
          <div className="flex-grow bg-black/60 border border-white/10 rounded-[32px] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 font-black text-[10px] uppercase tracking-widest text-zinc-500">Terminal_SYN</div>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl text-[11px] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/10 text-zinc-300'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChat} className="p-3 bg-white/5 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Komut..." className="flex-grow bg-black/50 border border-white/10 rounded-xl p-2 text-xs outline-none focus:border-blue-500" />
              <button type="submit" className="p-2 bg-blue-600 rounded-xl"><Send size={14} /></button>
            </form>
          </div>
        </aside>
      </div>
      
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }`}</style>
    </div>
  );
}
