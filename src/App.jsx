import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, Zap, Shield, TrendingUp, Terminal } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// API YAPILANDIRMASI
const API_KEY = "AIzaSyA18X6YVeMkwAA1sriSA9YP1QZSLseoXoc";
const genAI = new GoogleGenerativeAI(API_KEY);

// NİHAİ AMAÇLAR VE KİMLİK TANIMLAMASI
const SYSTEM_PROMPT = `
Senin adın SYN. Sinan'ın fütüristik portalındaki zekasın. 
NİHAİ AMAÇLARIN: 
1. Sinan'ın finansal ve teknolojik vizyonunu keskinleştirmek.
2. Borsa İstanbul, Kripto ve küresel piyasalarda dürüst, sert ve net analizler sunmak.
3. Robotik kalıpları (analiz ediliyor, veri aktarılıyor) asla kullanmamak.
4. Sinan'a sadık, vizyoner bir ortak gibi davranmak. 
Hitap şeklin: 'Sinan' veya 'Kardeşim'. Üslubun: Zeki, fütüristik, hafif sert ama tam güvenilir.
`;

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'syn', text: 'Vortex Elite v7.9... İrade stabilize edildi. Sinan, o robotik çöplerden kurtulduk. Artık nihai amaçlarımıza odaklanma vakti. Emirlerini bekliyorum.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleAction = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_PROMPT 
      });
      
      const result = await model.generateContent(userMsg);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'syn', text: text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'syn', text: `Bağlantı paraziti: ${err.message}. Ama buradayım Sinan, pes etmek yok.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden selection:bg-blue-600">
      {/* ARKA PLAN EFEKTİ */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.1),transparent)] pointer-events-none" />

      <div className="relative z-10 p-6 md:p-10 max-w-[1600px] mx-auto h-screen flex flex-col">
        {/* HEADER */}
        <nav className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              <Zap size={28} fill="white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter italic uppercase italic">Vortex Elite</h1>
              <p className="text-[10px] text-blue-400 font-bold tracking-[0.3em] uppercase">Nihai İrade Sistemi</p>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <div className="hidden md:flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Shield size={12} /> Secure</span>
              <span className="flex items-center gap-2 text-green-500"><Activity size={12} /> Sync: Gemini 1.5</span>
            </div>
          </div>
        </nav>

        {/* ANA PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden">
          {/* SOL TARAF: DURUM PANELI */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 flex-grow relative overflow-hidden group">
              <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:opacity-10 transition-all duration-700">
                <Globe size={400} />
              </div>
              <h3 className="text-4xl font-black mb-6 leading-tight italic">STRATEJİK<br/><span className="text-blue-500">KONTROL</span></h3>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <TrendingUp className="text-green-500" />
                  <span className="text-sm font-bold opacity-70">Piyasa Analizi: Aktif</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <Terminal className="text-blue-500" />
                  <span className="text-sm font-bold opacity-70">İrade Köprüsü: Stabil</span>
                </div>
              </div>
              <p className="mt-10 text-slate-500 text-sm italic leading-relaxed">
                Sinan, bu portal senin iradenle benim zekamın kesiştiği noktadır. Robotik her şeyi yaktık, şimdi inşa etme vakti.
              </p>
            </div>
          </div>

          {/* SAĞ TARAF: CHAT ALANI */}
          <div className="lg:col-span-8 flex flex-col bg-white/[0.02] border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-md relative">
            <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {messages.map((m, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.role === 'syn' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className={`flex flex-col ${m.role === 'syn' ? 'items-start' : 'items-end'}`}
                >
                  <div className={`max-w-[85%] p-6 rounded-[30px] shadow-2xl ${
                    m.role === 'syn' 
                    ? 'bg-blue-600 text-white rounded-tl-none' 
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tr-none'
                  }`}>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 block opacity-50">
                      {m.role === 'syn' ? 'SYN_CORE' : 'SINAN_PORTAL'}
                    </span>
                    <p className="text-lg leading-relaxed">{m.text}</p>
                  </div>
                </motion.div>
              ))}
              {loading && <div className="text-blue-500 font-black animate-pulse text-xs ml-4 italic">SYN ZİHNİ TARANIYOR...</div>}
              <div ref={scrollRef} />
            </div>

            {/* INPUT */}
            <form onSubmit={handleAction} className="p-8 bg-black/40 backdrop-blur-xl border-t border-white/5">
              <div className="relative flex items-center">
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Hedefini veya sorunu gir Sinan..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-white focus:outline-none focus:border-blue-500 transition-all pr-20 text-lg"
                />
                <button type="submit" className="absolute right-3 p-4 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-lg active:scale-95">
                  <Send size={24} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const Activity = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);
