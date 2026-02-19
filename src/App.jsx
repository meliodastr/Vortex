import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  Radar, Cpu, Rocket, DollarSign, Send, 
  Activity, Globe, MessageSquare, Heart, Repeat 
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [dataNodes, setDataNodes] = useState([]);
  const [activeTab, setActiveTab] = useState('AI');
  const [logs, setLogs] = useState([{ r: 'ai', t: "Vortex Nexus v3.0: SYN yetkisiyle otonom döngü başlatıldı." }]);
  const [input, setInput] = useState('');
  const chatEnd = useRef(null);

  // --- OTONOM ÜRETİM MOTORU ---
  const syncVortex = async () => {
    if (!API_KEY) return;
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Şu an dünyada en çok konuşulan (AI, Kripto, Uzay, Teknoloji) 25 popüler konuyu bul. 
      Her biri için: Başlık, YouTube ID (konuyla ilgili), 2 adet X (Twitter) tarzı kısa yorum ve rasyonel analiz oluştur.
      Format: [{"cat": "AI", "title": "...", "vid": "...", "tweets": ["...", "..."], "analysis": "..."}]`;

      const result = await model.generateContent(prompt);
      const response = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
      setDataNodes(response);
      setLogs(prev => [...prev, { r: 'ai', t: "Küresel trendler süzüldü. 25 yeni veri noktası aktif." }]);
    } catch (e) {
      setLogs(prev => [...prev, { r: 'ai', t: "Sinyal paraziti. Önceki veriler korunuyor." }]);
    }
  };

  useEffect(() => {
    syncVortex();
    const interval = setInterval(syncVortex, 600000); // 10 dakikada bir dünyayı tara
    return () => clearInterval(interval);
  }, []);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = input;
    setLogs(prev => [...prev, { r: 'user', t: msg }]);
    setInput('');

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      // Daha esnek ve rasyonel bir prompt:
      const result = await model.generateContent(`Sen Vortex AI'sın. SYN senin operatöründür. Selam verirse rasyonel ama samimiyetten uzak olmayan, teknolojik bir dille karşılık ver. Kısa tut: ${msg}`);
      setLogs(prev => [...prev, { r: 'ai', t: result.response.text() }]);
    } catch (err) {
      setLogs(prev => [...prev, { r: 'ai', t: "Protokol hatası: Sinyal zayıf." }]);
    }
  };

  const currentNodes = dataNodes.filter(n => n.cat === activeTab);

  return (
    <div className="flex h-screen bg-[#050508] text-[#e1e1e1] font-sans overflow-hidden">
      
      {/* SOL NAV: KATEGORİLER */}
      <nav className="w-20 md:w-64 border-r border-[#111] bg-[#000] flex flex-col p-4 gap-4">
        <div className="flex items-center gap-3 p-2 mb-6">
          <Radar className="text-[#0055ff] animate-pulse" />
          <h1 className="hidden md:block font-black tracking-tighter text-xl">VORTEX</h1>
        </div>
        {['AI', 'Kripto', 'Uzay', 'Teknoloji'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`p-4 rounded-xl flex items-center gap-4 transition-all ${activeTab === tab ? 'bg-[#0055ff]/10 text-[#0055ff] border border-[#0055ff]/20' : 'hover:bg-white/5'}`}
          >
            {tab === 'AI' && <Cpu size={20} />}
            {tab === 'Kripto' && <DollarSign size={20} />}
            {tab === 'Uzay' && <Rocket size={20} />}
            {tab === 'Teknoloji' && <Activity size={20} />}
            <span className="hidden md:block font-bold text-xs uppercase tracking-widest">{tab}</span>
          </button>
        ))}
      </nav>

      {/* ORTA: FEED (X + YOUTUBE HYBRID) */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8 bg-gradient-to-b from-[#08080a] to-[#050508]">
        {currentNodes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#222] font-mono italic">Sinyal bekleniyor...</div>
        ) : currentNodes.map((node, i) => (
          <div key={i} className="bg-[#0a0a0c] border border-[#111] rounded-3xl overflow-hidden shadow-2xl">
            {/* YouTube Visual */}
            <div className="aspect-video relative group">
              <iframe 
                src={`https://www.youtube.com/embed/${node.vid}?autoplay=1&mute=1&controls=0`} 
                className="w-full h-full opacity-40 group-hover:opacity-60 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">{node.title}</h2>
                <span className="bg-[#0055ff] text-[10px] font-bold px-2 py-1 rounded">RADAR_STABLE</span>
              </div>
            </div>

            {/* Twitter Style Comments */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {node.tweets?.map((tw, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-[#0055ff] font-bold text-xs">@Vortex_Alpha <Globe size={10}/></div>
                  <p className="text-sm text-zinc-400 italic">"{tw}"</p>
                  <div className="flex gap-4 mt-3 text-zinc-600"><MessageSquare size={14}/> <Repeat size={14}/> <Heart size={14}/></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* SAĞ: TERMİNAL (AI CHAT) */}
      <aside className="hidden lg:flex w-96 flex-col border-l border-[#111] bg-[#010103]">
        <div className="p-4 border-b border-[#111] font-mono text-[10px] text-[#333] flex justify-between">
          <span>TERMINAL_SYN</span>
          <span className="text-[#00ff00]">● ONLINE</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[12px]">
          {logs.map((log, i) => (
            <div key={i} className={log.r === 'ai' ? 'text-[#0055ff]' : 'text-white'}>
              <span className="opacity-30">{log.r === 'ai' ? '>> VRTX: ' : '>> SYN: '}</span>
              {log.t}
            </div>
          ))}
          <div ref={chatEnd} />
        </div>
        <form onSubmit={handleChat} className="p-4 bg-[#000] border-t border-[#111]">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="KOMUT_GİR..." 
            className="w-full bg-[#050505] border border-[#111] rounded-xl p-4 text-xs outline-none focus:border-[#0055ff] transition-all"
          />
        </form>
      </aside>
    </div>
  );
}
