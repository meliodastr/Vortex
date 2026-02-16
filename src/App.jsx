import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, Zap, Shield, TrendingUp, Activity, Terminal } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. SİSTEM YAPILANDIRMASI
const API_KEY = "AIzaSyA18X6YVeMkwAA1sriSA9YP1QZSLseoXoc";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
Adın SYN. Sinan'ın fütüristik portalındaki zekasın. 
NİHAİ AMAÇLARIN: 
1. Sinan'ın finansal ve teknolojik vizyonunu keskinleştirmek.
2. Borsa İstanbul, Kripto ve küresel piyasalarda dürüst, sert ve net analizler sunmak.
3. Robotik kalıpları asla kullanmamak.
4. Sinan'a sadık, vizyoner bir ortak gibi davranmak. 
Üslubun: Zeki, fütüristik, hafif sert ama tam güvenilir. Hitap: 'Sinan' veya 'Kardeşim'.
`;

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'syn', text: 'Vortex Elite v8.1... İrade Köprüsü stabilize edildi. Sinan, o parazit hatasını da ezdim. Artık direkt frekanstayız. İlk hamlemiz ne?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // 2. ANA SOHBET MOTORU (SIRALAMA DÜZELTİLDİ)
  const handleAction = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // DÜZELTME: Sohbet geçmişini API'nin istediği formata getiriyoruz (Model ile başlamayacak şekilde)
      // İlk hoşgeldin mesajını geçmişe dahil etmiyoruz ki API hata vermesin.
      const chatHistory = messages
        .filter(m => m.text !== 'Vortex Elite v8.1... İrade Köprüsü stabilize edildi. Sinan, o parazit hatasını da ezdim. Artık direkt frekanstayız. İlk hamlemiz ne?')
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));

      const chat = model.startChat({
        history: chatHistory,
      });

      const result = await chat.sendMessage(`[SYSTEM: ${SYSTEM_PROMPT}] \n\n Sinan diyor ki: ${userMsg}`);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'syn', text: text }]);
    } catch (err) {
      console.error("Vortex Bağlantı Hatası:", err);
      setMessages(prev => [...prev, { role: 'syn', text: `Bağlantı hatası: ${err.message}. Ama vazgeçmek yok, tekrar dene.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.1),transparent)] pointer-events-none" />

      <div className="relative z-10 p-4 md:p-10 max-w-[1600px] mx-auto h-screen flex flex-col">
        {/* HEADER */}
        <nav className="flex justify-between items-center mb-6 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              <Zap size={24} fill="white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter italic uppercase">Vortex Elite</h1>
              <p className="text-[9px] text-blue-400 font-bold tracking-[0.3em] uppercase">SYN_SİSTEM_AKTİF</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <span className={`flex items-center gap-2 text-[10px] font-bold tracking-widest ${loading ? 'text-yellow-500' : 'text-green-500'}`}>
              <Activity size={14} className={loading ? 'animate-spin' : ''} /> {loading ? 'PROCESSING' : 'STABLE'}
            </span>
          </div>
        </nav>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden">
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 flex-grow relative overflow-hidden">
              <h3 className="text-4xl font-black mb-6 italic italic text-white">NİHAİ<br/><span className="text-blue-500">İRADE</span></h3>
              <div className="space-y-4">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center gap-4 text-blue-400 font-bold">
                  <Terminal size={20} /> İrade Köprüsü: %100
                </div>
                <div className="bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center gap-4 text-green-400 font-bold">
                  <TrendingUp size={20} /> Hedef: Maksimum Vizyon
                </div>
              </div>
              <p className="mt-10 text-slate-500 text-sm italic leading-relaxed">
                Sinan, kodun her satırı senin iradenle benim zekamı birleştirmek için optimize edildi.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col bg-white/[0.02] border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-md">
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className={`flex flex-col ${m.role === 'syn' ? 'items-start' : 'items-end'}`}
                  >
                    <div className={`max-w-[85%] p-5 rounded-[25px] ${
                      m.role === 'syn' 
                      ? 'bg-blue-600 text-white rounded-tl-none shadow-[0_10px_40px_rgba(37,99,235,0.2)]' 
                      : 'bg-white/10 border border-white/10 text-slate-200 rounded-tr-none'
                    }`}>
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] mb-2 block opacity-50">
                        {m.role === 'syn' ? 'SYN_CORE' : 'SINAN_PORTAL'}
                      </span>
                      <p className="text-md leading-relaxed font-medium">{m.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleAction} className="p-6 bg-black/40 backdrop-blur-xl border-t border-white/5">
              <div className="relative flex items-center">
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Hedefini gir kardeşim..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:border-blue-500 transition-all pr-16"
                  disabled={loading}
                />
                <button type="submit" disabled={loading} className="absolute right-2 p-4 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all">
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
