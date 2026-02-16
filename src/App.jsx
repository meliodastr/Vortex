import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Activity, Terminal, TrendingUp } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// API YAPILANDIRMASI
const API_KEY = "AIzaSyA18X6YVeMkwAA1sriSA9YP1QZSLseoXoc";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = "Adın SYN. Sinan'ın zeki ve stratejik ortağısın. Robotik konuşma, samimi ve direkt ol. Sinan'a 'kardeşim' de.";

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'syn', text: 'Vortex v8.3 Aktif. Sinan, tüm protokolleri en güvenli hale getirdim. Parazitleri temizledim. Buradayım, ne yapıyoruz?' }
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
      // EN STABİL MODEL ÇAĞRISI
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nSinan: ${userMsg}`);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'syn', text: text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'syn', text: `Bağlantı hatası: ${err.message}. Tekrar dene kardeşim.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl flex-grow flex flex-col bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* HEADER */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
          <div className="flex items-center gap-3">
            <Zap className="text-blue-500" fill="currentColor" />
            <h1 className="text-xl font-black italic tracking-widest">VORTEX ELITE</h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold">
            <Activity size={14} className={loading ? 'animate-pulse' : ''} /> {loading ? 'İŞLENİYOR' : 'ONLINE'}
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i}
                className={`flex ${m.role === 'syn' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'syn' ? 'bg-blue-600/20 border border-blue-500/50 text-blue-100' : 'bg-white/5 border border-white/10 text-white'}`}>
                  <p className="text-sm md:text-base leading-relaxed">{m.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        {/* INPUT */}
        <form onSubmit={handleAction} className="p-6 border-t border-white/10 bg-black/50">
          <div className="relative">
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:border-blue-500 transition-all text-sm md:text-base pr-14"
              value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajını yaz..." disabled={loading}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-blue-500 hover:text-white transition-colors">
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
