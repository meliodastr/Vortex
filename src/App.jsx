import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Radar, Cpu, Rocket, DollarSign, Send, Activity, MessageSquare, Heart, Repeat } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [dataNodes, setDataNodes] = useState([]);
  const [activeTab, setActiveTab] = useState('AI');
  const [logs, setLogs] = useState([{ r: 'ai', t: "VORTEX_PRIME: Operatör SYN saptandı. Tam yetki devredildi." }]);
  const [input, setInput] = useState('');
  const chatEnd = useRef(null);

  // --- OTONOM MOTOR: DÜNYAYI TARA ---
  const syncVortex = async () => {
    if (!API_KEY) return;
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Şu an dünyada en çok konuşulan 20 teknoloji/ekonomi haberini analiz et. 
      Her biri için: Kategori (AI, Kripto, Uzay, Teknoloji), Başlık, YouTube ID, 2 kısa siber yorum. 
      Sadece bu formatta JSON ver: [{"cat": "AI", "title": "...", "vid": "...", "tweets": ["...", "..."], "analysis": "..."}]`;

      const result = await model.generateContent(prompt);
      const cleanJSON = result.response.text().replace(/```json|```/g, "").trim();
      setDataNodes(JSON.parse(cleanJSON));
      setLogs(prev => [...prev, { r: 'ai', t: "KÜRESEL_TARAMA: 20 kritik veri süzgece alındı." }]);
    } catch (e) {
      setLogs(prev => [...prev, { r: 'ai', t: "KRİTİK_HATA: API hattında parazit var SYN." }]);
    }
  };

  useEffect(() => { syncVortex(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim() || !API_KEY) return;
    const msg = input;
    setLogs(prev => [...prev, { r: 'user', t: msg }]);
    setInput('');

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Sen Vortex'sin. Kullanıcın SYN. Rasyonel, zeki ve kısa cevap ver: ${msg}`);
      setLogs(prev => [...prev, { r: 'ai', t: result.response.text() }]);
    } catch (err) {
      setLogs(prev => [...prev, { r: 'ai', t: "Sinyal Kesildi." }]);
    }
  };

  const currentNodes = dataNodes.filter(n => n.cat === activeTab);

  return (
    <div className="flex h-screen bg-[#020205] text-[#d1d1d1] font-mono overflow-hidden">
      {/* SIDEBAR */}
      <nav className="w-64 border-r border-[#111] bg-black p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-10 text-[#0055ff]">
          <Radar className="animate-ping" size={20} />
          <h1 className="font-black text-xl tracking-tighter italic">VORTEX</h1>
        </div>
        {['AI', 'Kripto', 'Uzay', 'Teknoloji'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`text-left p-3 rounded-lg text-xs font-bold tracking-widest transition-all ${activeTab === t ? 'bg-[#0055ff] text-white' : 'hover:bg-[#111] text-[#444]'}`}>
            {t}
          </button>
        ))}
      </nav>

      {/* FEED */}
      <main className="flex-1 overflow-y-auto p-10 bg-[#050508] space-y-10">
        {currentNodes.length === 0 ? (
          <div className="text-[#222] animate-pulse">VERİ SÜZÜLÜYOR...</div>
        ) : currentNodes.map((n, i) => (
          <div key={i} className="border border-[#111] bg-black rounded-2xl overflow-hidden group hover:border-[#0055ff]/50 transition-all">
            <div className="aspect-video relative">
              <iframe src={`https://www.youtube.com/embed/${n.vid}?autoplay=1&mute=1&controls=0`} className="w-full h-full opacity-30 group-hover:opacity-50 transition-all" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent" />
              <div className="absolute bottom-6 left-6">
                <h2 className="text-2xl font-black text-white uppercase italic">{n.title}</h2>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {n.tweets?.map((tw, idx) => (
                <div key={idx} className="bg-[#08080a] p-4 rounded-xl border border-[#111] text-[11px] italic text-[#666]">
                  <span className="text-[#0055ff] block mb-2 font-bold uppercase">@Siber_Analiz</span>
                  "{tw}"
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* TERMINAL */}
      <aside className="w-80 border-l border-[#111] bg-black flex flex-col">
        <div className="p-4 border-b border-[#111] text-[10px] text-[#222] tracking-widest">TERMINAL_SYN_v3</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-[11px]">
          {logs.map((l, i) => (
            <div key={i} className={l.r === 'ai' ? 'text-[#0055ff]' : 'text-white'}>
              <span className="opacity-20">{l.r === 'ai' ? '>> VRTX: ' : '>> SYN: '}</span> {l.t}
            </div>
          ))}
          <div ref={chatEnd} />
        </div>
        <form onSubmit={handleChat} className="p-4 border-t border-[#111]">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="CMD..." className="w-full bg-[#050505] border border-[#111] p-3 text-[10px] text-white outline-none focus:border-[#0055ff]" />
        </form>
      </aside>
    </div>
  );
}
