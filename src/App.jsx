import React, { useState, useEffect, useRef } from 'react';
import { Radar, Cpu, Rocket, DollarSign, Send, Zap, Activity, Globe, RefreshCcw } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export default function App() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'SİSTEM YÜKLENİYOR', icon: <Cpu />, vid: '9bZkp7q19f0', opinion: 'Veri taranıyor...' },
  ]);
  const [activeId, setActiveId] = useState(1);
  const [messages, setMessages] = useState([{ role: 'ai', text: "VORTEX_CORE: Otonom tarama başlatıldı. Her 10 dakikada bir dünya trendleri senkronize edilecek." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const chatEndRef = useRef(null);

  // --- OTONOM GÜNCELLEME FONKSİYONU ---
  const fetchNewTrends = async () => {
    if (!API_KEY) return;
    setIsUpdating(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Şu anki dünya gündeminden en popüler 5 teknoloji, bilim veya gelecek temasını bul. 
      Her biri için: 1. Kısa başlık, 2. O konuyla ilgili popüler bir YouTube VIDEO_ID'si (sadece ID), 3. Vortex AI'nın o konu hakkındaki rasyonel fikri. 
      Format: JSON olsun. Örn: [{"name": "AI SAVAŞLARI", "vid": "ID", "opinion": "Yorum"}]`;

      const result = await model.generateContent(prompt);
      const data = JSON.parse(result.response.text().replace(/```json|```/g, ""));
      
      const formatted = data.map((item, index) => ({
        id: index,
        name: item.name.toUpperCase(),
        icon: index % 2 === 0 ? <Cpu size={18}/> : <Rocket size={18}/>,
        vid: item.vid,
        opinion: item.opinion,
        color: index === 0 ? '#3b82f6' : '#8b5cf6'
      }));

      setCategories(formatted);
      setActiveId(0);
      setMessages(prev => [...prev, { role: 'ai', text: `SYSTEM_UPDATE: Başlıklar ve veri akışı en son trendlere göre güncellendi SYN.` }]);
    } catch (err) {
      console.error("GÜNCELLEME HATASI:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // 10 Dakikada bir tetikleyici
  useEffect(() => {
    fetchNewTrends();
    const interval = setInterval(fetchNewTrends, 600000); // 600.000 ms = 10 dk
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
      const result = await model.generateContent(`Sen Vortex Üst Aklısın. Kullanıcın SYN. Rasyonel ve kısa cevap ver. Soru: ${userMsg}`);
      setMessages(prev => [...prev, { role: 'ai', text: result.response.text() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "SIGNAL_LOST: Bağlantı hatası." }]);
    } finally { setLoading(false); }
  };

  const current = categories.find(c => c.id === activeId) || categories[0];

  return (
    <div className="min-h-screen bg-[#010206] text-zinc-400 font-mono overflow-hidden flex flex-col">
      
      {/* ÜST PANEL */}
      <header className="h-14 border-b border-blue-500/10 bg-black/80 backdrop-blur-2xl flex justify-between items-center px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Radar className={`text-blue-500 ${isUpdating ? 'animate-spin' : ''}`} size={22} />
          <h1 className="text-xl font-black italic tracking-[0.2em] text-white uppercase">Vortex Nexus</h1>
        </div>
        <div className="flex items-center gap-4">
          {isUpdating && <span className="text-[8px] text-blue-500 animate-pulse tracking-widest">SCANNING_GLOBAL_TRENDS...</span>}
          <div className="text-[10px] text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full uppercase">SYN_OPERATOR</div>
        </div>
      </header>

      <div className="flex-grow flex p-3 gap-3 overflow-hidden relative">
        
        {/* SOL: AI TARAFINDAN OLUŞTURULAN KONULAR */}
        <aside className="w-64 flex flex-col gap-2 shrink-0 overflow-y-auto custom-scrollbar">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveId(cat.id)} className={`relative p-4 rounded-lg border transition-all duration-300 ${activeId === cat.id ? 'bg-blue-600/10 border-blue-500/40 text-white' : 'border-white/5 hover:bg-white/5 text-zinc-600'}`}>
              <div className="flex items-center gap-3 relative z-10">
                <span className="opacity-70">{cat.icon}</span>
                <span className="text-[9px] font-black tracking-widest uppercase truncate">{cat.name}</span>
              </div>
              {activeId === cat.id && <div className="absolute right-0 top-2 bottom-2 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>}
            </button>
          ))}
          <button onClick={fetchNewTrends} className="mt-4 p-2 border border-dashed border-blue-500/30 rounded flex items-center justify-center gap-2 text-[8px] hover:bg-blue-500/10 transition-all">
            <RefreshCcw size={12} /> MANUEL_SYNC
          </button>
        </aside>

        {/* ORTA: DINAMIK VIDEO & OPINION */}
        <main className="flex-grow flex flex-col gap-3 min-w-0">
          <div className="flex-grow bg-black rounded-2xl border border-white/5 overflow-hidden relative">
            <iframe src={`https://www.youtube.com/embed/${current.vid}?autoplay=1&mute=1&controls=0&modestbranding=1`} className="w-full h-full opacity-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010206] via-transparent to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 border border-white/10 backdrop-blur-xl rounded-xl">
               <div className="flex items-center gap-2 mb-2 text-blue-500">
                 <Zap size={14} className="animate-pulse"/>
                 <span className="text-[9px] font-black uppercase tracking-[0.2em]">Vortex_Rasyonel_Analiz</span>
               </div>
               <h2 className="text-xl font-black text-white italic mb-2 tracking-tighter uppercase">{current.name}</h2>
               <p className="text-[11px] text-zinc-400 leading-relaxed italic border-l-2 border-blue-500 pl-4">"{current.opinion}"</p>
            </div>
          </div>
        </main>

        {/* SAĞ: TERMINAL */}
        <aside className="w-80 flex flex-col gap-3 shrink-0">
          <div className="flex-grow bg-black/80 border border-white/10 rounded-2xl flex flex-col overflow-hidden backdrop-blur-3xl shadow-2xl relative">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-[9px] uppercase tracking-widest text-zinc-500"><Activity size={14} className="text-blue-500"/> Terminal</div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-lg text-[11px] leading-relaxed max-w-[90%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-900 border border-white/5 text-blue-300 shadow-inner'}`}>
                    <div className="text-[8px] uppercase font-black mb-1 opacity-40">{m.role === 'user' ? 'SYN' : 'Vortex'}</div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChat} className="p-3 bg-white/5 border-t border-white/5 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Send command..." className="flex-grow bg-black border border-white/10 rounded-lg p-3 text-[10px] outline-none focus:border-blue-500 transition-all text-white" />
              <button type="submit" disabled={loading} className="p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all"><Send size={16} /></button>
            </form>
          </div>
        </aside>
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 2px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f655; }`}</style>
    </div>
  );
}
