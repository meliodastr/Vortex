import React, { useState, useEffect, useRef } from 'react';
import { Radar, Cpu, Rocket, DollarSign, Send, Zap, Activity, Globe, RefreshCcw, AlertTriangle } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export default function App() {
  const [categories, setCategories] = useState([
    { id: 0, name: 'SİNYAL ARANIYOR', icon: <Radar />, vid: '9bZkp7q19f0', opinion: 'Küresel trendler taranıyor, rasyonel veri bekleniyor...' },
  ]);
  const [activeId, setActiveId] = useState(0);
  const [messages, setMessages] = useState([{ role: 'ai', text: "VORTEX_CORE: Otonom tarayıcı aktif. SYN için veri matrisi hazırlanıyor." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const chatEndRef = useRef(null);

  // --- GÜVENLİ OTONOM GÜNCELLEME (FAIL-SAFE) ---
  const fetchNewTrends = async () => {
    if (!API_KEY) return;
    setIsUpdating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Şu anki dünya gündeminden en popüler 5 teknoloji veya bilim temasını bul. 
      Yanıtı SADECE şu JSON formatında ver, başka metin ekleme: 
      [{"name": "KONU", "vid": "YOUTUBE_ID", "opinion": "KISA_YORUM"}]`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      
      // JSON temizleme ve parse etme (Hata koruması)
      let cleanJson = text.replace(/```json|```/g, "").trim();
      const data = JSON.parse(cleanJson);
      
      const formatted = data.map((item, index) => ({
        id: index,
        name: item.name.toUpperCase(),
        icon: [<Cpu size={16}/>, <Rocket size={16}/>, <Globe size={16}/>, <Zap size={16}/>, <Activity size={16}/>][index % 5],
        vid: item.vid,
        opinion: item.opinion,
        color: '#3b82f6'
      }));

      setCategories(formatted);
      setActiveId(0);
      setMessages(prev => [...prev, { role: 'ai', text: `SYNC_COMPLETE: Dünya gündemi stabilize edildi SYN.` }]);
    } catch (err) {
      console.error("GÜNCELLEME HATASI:", err);
      setMessages(prev => [...prev, { role: 'ai', text: "GÜNCELLEME_HATASI: Veri parse edilemedi, tekrar deneniyor..." }]);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchNewTrends();
    const interval = setInterval(fetchNewTrends, 600000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !API_KEY) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Sen Vortex Üst Aklısın. Kullanıcın SYN. Rasyonel ve siberpunk bir dille kısa cevap ver. Soru: ${userMsg}`);
      setMessages(prev => [...prev, { role: 'ai', text: result.response.text() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "SİNYAL_HATASI: Protokol zaman aşımı." }]);
    } finally { setLoading(false); }
  };

  const current = categories.find(c => c.id === activeId) || categories[0];

  return (
    <div className="min-h-screen bg-[#020308] text-zinc-400 font-mono overflow-hidden flex flex-col">
      {/* HEADER */}
      <header className="h-14 border-b border-blue-500/20 bg-black/60 backdrop-blur-xl flex justify-between items-center px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Radar className={`text-blue-500 ${isUpdating ? 'animate-spin' : ''}`} size={20} />
          <h1 className="text-lg font-black italic tracking-[0.1em] text-white">VORTEX <span className="text-blue-500">NEXUS</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end leading-none mr-4">
            <span className="text-[8px] text-zinc-600 tracking-widest uppercase">Global_Clock</span>
            <span className="text-[10px] text-white uppercase">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="h-8 w-px bg-white/10 mx-2"></div>
          <span className="text-[10px] font-bold text-blue-500 animate-pulse">SYN_AUTH</span>
        </div>
      </header>

      <div className="flex-grow flex p-3 gap-3 overflow-hidden relative">
        {/* SIDEBAR: KONULAR */}
        <aside className="w-64 flex flex-col gap-2 shrink-0 overflow-y-auto custom-scrollbar">
          <div className="text-[9px] font-black text-zinc-700 px-2 py-1 tracking-widest">ACTIVE_TRENDS</div>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveId(cat.id)} className={`relative p-3.5 rounded border transition-all duration-300 group ${activeId === cat.id ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'border-white/5 hover:border-white/10 text-zinc-500'}`}>
              <div className="flex items-center gap-3 relative z-10">
                <div className={`${activeId === cat.id ? 'text-blue-400' : 'text-zinc-700'}`}>{cat.icon}</div>
                <span className="text-[10px] font-black tracking-tighter uppercase truncate">{cat.name}</span>
              </div>
            </button>
          ))}
          <button onClick={fetchNewTrends} className="mt-auto p-3 border border-dashed border-blue-500/20 rounded-md flex items-center justify-center gap-2 text-[9px] hover:bg-blue-500/5 transition-all text-blue-500 font-bold uppercase">
             <RefreshCcw size={12} className={isUpdating ? 'animate-spin' : ''} /> Force_Sync
          </button>
        </aside>

        {/* MAIN CORE: VIDEO & OPINION */}
        <main className="flex-grow flex flex-col gap-3 min-w-0">
          <div className="flex-grow bg-black rounded-xl border border-white/5 overflow-hidden relative shadow-2xl">
            <iframe src={`https://www.youtube.com/embed/${current.vid}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`} className="w-full h-full opacity-30 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020308] via-transparent to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6">
               <div className="bg-black/80 backdrop-blur-3xl border border-white/10 p-6 rounded-lg border-l-4 border-l-blue-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-[9px] text-blue-500 uppercase tracking-widest mb-1 font-black underline decoration-blue-500/30 underline-offset-4">Rasyonel_Analiz</div>
                        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{current.name}</h2>
                    </div>
                    <div className="bg-white/5 p-2 rounded tracking-widest text-[8px] text-zinc-500 uppercase">Vid_Ref: {current.vid}</div>
                  </div>
                  <p className="text-[12px] text-zinc-300 leading-relaxed italic font-medium">"{current.opinion}"</p>
               </div>
            </div>
          </div>
        </main>

        {/* TERMINAL: AI CHAT */}
        <aside className="w-80 flex flex-col gap-3 shrink-0">
          <div className="flex-grow bg-black/60 border border-white/10 rounded-xl flex flex-col overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-2 font-black text-[9px] uppercase tracking-widest text-zinc-500"><Zap size={14} className="text-blue-500"/> Nexus_Terminal</div>
                <div className="flex gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div></div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-lg text-[11px] leading-relaxed max-w-[90%] ${m.role === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-900 border border-white/5 text-blue-300'}`}>
                    <div className="text-[8px] uppercase font-black mb-1 opacity-40">{m.role === 'user' ? 'AUTH: SYN' : 'VORTEX_CORE'}</div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChat} className="p-3 bg-white/5 border-t border-white/5 flex gap-2 group">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Send protocol command..." className="flex-grow bg-black border border-white/10 rounded-md p-3 text-[10px] outline-none focus:border-blue-500 transition-all text-white font-mono placeholder:text-zinc-800" />
              <button type="submit" disabled={loading} className="p-3 bg-blue-600 hover:bg-blue-500 rounded-md transition-all shadow-lg shadow-blue-600/20 active:scale-95"><Send size={16} /></button>
            </form>
          </div>
        </aside>
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 2px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f633; }`}</style>
    </div>
  );
}
