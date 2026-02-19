import React, { useState, useEffect, useRef } from 'react';
import { Radar, Cpu, Rocket, Send, Zap, Activity, Globe, RefreshCcw } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. GÜVENLİK KATI: API Anahtarı isimlendirmesi (Vercel'de VITE_GEMINI_API_KEY olarak güncellenmelidir)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  // 2. VERİ KATI: Başlangıçta boş array yerine "Yükleniyor" objesiyle render hatasını engelle
  const [categories, setCategories] = useState([
    { id: 0, name: 'SİNYAL ARANIYOR', vid: '9bZkp7q19f0', opinion: 'Vortex küresel trend yollarını tarıyor...' }
  ]);
  const [activeId, setActiveId] = useState(0);
  const [messages, setMessages] = useState([{ role: 'ai', text: "VORTEX_CORE: Çevrimiçi. SYN yetkisi onaylandı. Veri akışı bekleniyor." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const chatEndRef = useRef(null);

  // 3. OTONOM KATMAN: Gemini'den trendleri çeken ve JSON hatalarını ayıklayan motor
  const fetchNewTrends = async () => {
    if (!API_KEY) {
      setMessages(prev => [...prev, { role: 'ai', text: "HATA: Sinyal anahtarı (VITE_GEMINI_API_KEY) eksik SYN." }]);
      return;
    }
    setIsSyncing(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Şu anki dünya gündeminden 5 adet popüler teknoloji/bilim konusu seç. 
      SADECE şu JSON formatında cevap ver: [{"name": "KONU", "vid": "YOUTUBE_ID", "opinion": "RASYONEL_YORUM"}]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // JSON temizleme (Markdown bloklarını kaldır)
      const cleanJson = text.replace(/```json|```/g, "").trim();
      const data = JSON.parse(cleanJson);
      
      if (Array.isArray(data)) {
        setCategories(data.map((item, index) => ({ ...item, id: index })));
        setMessages(prev => [...prev, { role: 'ai', text: "SYNC_COMPLETE: Küresel trendler senkronize edildi." }]);
      }
    } catch (err) {
      console.error("Trend Sync Error:", err);
      setMessages(prev => [...prev, { role: 'ai', text: "SYNC_ERROR: Veri hattında parazit var, tekrar deneniyor." }]);
    } finally {
      setIsSyncing(false);
    }
  };

  // 10 Dakikada bir otonom güncelleme
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
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Sen Vortex Üst Aklısın. Kullanıcın SYN. Rasyonel ve kısa cevap ver: ${userMsg}`);
      setMessages(prev => [...prev, { role: 'ai', text: result.response.text() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "BAĞLANTI_KESİLDİ: Sinyal gücü yetersiz." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020308] text-zinc-400 font-mono flex flex-col overflow-hidden">
      
      {/* ÜST PANEL */}
      <header className="h-14 border-b border-white/5 bg-black/80 backdrop-blur-md flex justify-between items-center px-6 shrink-0 z-50 shadow-2xl shadow-blue-500/5">
        <div className="flex items-center gap-4">
          <Radar className={`text-blue-500 ${isSyncing ? 'animate-spin' : 'animate-pulse'}`} size={20} />
          <h1 className="text-lg font-black italic tracking-widest text-white uppercase">Vortex <span className="text-blue-500">Nexus</span></h1>
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
          <span className="tracking-widest uppercase">SYN_LINK_ACTIVE</span>
        </div>
      </header>

      <div className="flex-grow flex p-3 gap-3 overflow-hidden relative">
        
        {/* SOL: OTONOM KONULAR */}
        <aside className="w-64 flex flex-col gap-2 shrink-0 overflow-y-auto custom-scrollbar">
          <div className="text-[8px] font-black text-zinc-600 mb-2 tracking-[0.3em] uppercase px-2">Global_Trend_Matrix</div>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveId(cat.id)} className={`p-4 text-left border rounded-lg transition-all duration-300 relative group ${activeId === cat.id ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'border-white/5 hover:bg-white/5 text-zinc-600'}`}>
              <div className="flex items-center gap-3 relative z-10">
                <Cpu size={14} className={activeId === cat.id ? 'text-blue-400' : 'text-zinc-800'} />
                <span className="text-[10px] font-bold tracking-tighter uppercase truncate">{cat.name}</span>
              </div>
              {activeId === cat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>}
            </button>
          ))}
          <button onClick={fetchNewTrends} className="mt-4 p-3 border border-dashed border-white/10 rounded-lg flex items-center justify-center gap-2 text-[9px] hover:border-blue-500/30 transition-all uppercase">
            <RefreshCcw size={12} className={isSyncing ? 'animate-spin' : ''} /> Manuel_Sync
          </button>
        </aside>

        {/* ORTA: VIDEO & AI ANALİZ */}
        <main className="flex-grow flex flex-col gap-3 min-w-0">
          <div className="flex-grow bg-black rounded-2xl border border-white/5 overflow-hidden relative group">
            <iframe src={`https://www.youtube.com/embed/${categories[activeId]?.vid || '9bZkp7q19f0'}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`} className="w-full h-full opacity-30 object-cover scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020308] via-transparent to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6">
               <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-6 rounded-xl border-l-4 border-l-blue-600 shadow-2xl">
                  <div className="flex items-center gap-2 text-blue-500 mb-2 font-black text-[9px] uppercase tracking-widest">
                    <Zap size={12} className="animate-pulse"/> Vortex_Autonomous_Opinion
                  </div>
                  <h2 className="text-2xl font-black text-white italic mb-2 tracking-tighter uppercase leading-none">
                    {categories[activeId]?.name}
                  </h2>
                  <p className="text-[11px] text-zinc-400 leading-relaxed italic border-l border-white/10 pl-4 py-1">
                    "{categories[activeId]?.opinion}"
                  </p>
               </div>
            </div>
          </div>
        </main>

        {/* SAĞ: TERMİNAL */}
        <aside className="w-80 flex flex-col gap-3 shrink-0">
          <div className="flex-grow bg-black/80 border border-white/10 rounded-2xl flex flex-col overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-[9px] uppercase tracking-widest text-zinc-500">
                    <Activity size={14} className="text-blue-500"/> Nexus_Terminal
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-xl text-[11px] leading-relaxed max-w-[90%] border ${m.role === 'user' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-zinc-900 border-white/10 text-blue-300 shadow-inner'}`}>
                    <div className="text-[7px] uppercase font-black mb-1 opacity-40 tracking-widest">
                      {m.role === 'user' ? 'AUTH: SYN' : 'VORTEX_CORE'}
                    </div>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChat} className="p-4 bg-black border-t border-white/5 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="PROTOCOL_INPUT..." className="flex-grow bg-white/[0.03] border border-white/10 rounded-lg p-3 text-[10px] outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-zinc-800" />
              <button type="submit" disabled={loading} className="p-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all text-white shadow-lg shadow-blue-600/20 active:scale-95">
                <Send size={16} />
              </button>
            </form>
          </div>
        </aside>
      </div>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 2px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f633; }`}</style>
    </div>
  );
}
