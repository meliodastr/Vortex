import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Activity, Shield, Lock, CreditCard, ChevronRight, EyeOff } from 'lucide-react';

// --- GİZLİ SİSTEM AYARLARI ---
const API_KEY = "AIzaSyA18X6YVeMkwAA1sriSA9YP1QZSLseoXoc"; // Gemini API Key
const SYSTEM_PROMPT = `Sen SYN'sin. Vortex Elite portalının yapay zekasısın. 
Kullanıcın bir "Elite Operatör"dür. İsmini asla kullanma, ona "kardeşim" veya "operatör" de. 
Görevin stratejik analiz ve kazanç odaklı rehberlik yapmaktır. Sert ve zeki konuş.`;

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'syn', text: 'Vortex Terminal v1.2 Aktif. Kimlik gizleme protokolleri devrede. Kim olduğun değil, ne yapacağın önemli. Ne yapıyoruz kardeşim?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isElite, setIsElite] = useState(false); // Ödeme kontrolü buraya bağlanacak
  const [showPaywall, setShowPaywall] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- GEMINI API BAĞLANTI MOTORU ---
  const handleAction = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    // Gizli Kullanıcı Limit Kontrolü (5 mesaj)
    if (!isElite && messages.filter(m => m.role === 'user').length >= 5) {
      setShowPaywall(true);
      return;
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nKullanıcı: ${userMsg}` }] }]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      setMessages(prev => [...prev, { role: 'syn', text: aiResponse }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'syn', text: `Bağlantı hatası: Sinyal parazitli. Tekrar dene kardeşim.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-hidden p-4 md:p-8">
      {/* ÖDEME DUVARI (PAYWALL) */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-2xl">
            <div className="bg-[#050505] border border-blue-500/30 p-10 rounded-[40px] text-center max-w-md shadow-[0_0_50px_rgba(37,99,235,0.2)]">
              <Lock className="mx-auto text-blue-500 mb-6" size={40} />
              <h2 className="text-2xl font-black italic mb-4">ERİŞİM KISITLANDI</h2>
              <p className="text-slate-400 mb-8 text-xs leading-relaxed uppercase tracking-widest">Ücretsiz limit doldu. Elite Terminal erişimi için protokolü yükselt.</p>
              <button className="w-full bg-blue-600 p-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40">
                <CreditCard size={18} /> ELITE PASS AKTİF ET
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto h-[90vh] flex flex-col">
        {/* ÜST BAR (İSİMSİZ) */}
        <nav className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-xl"><Zap size={20} fill="white" /></div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Vortex <span className="text-blue-500">Elite</span></h1>
              <span className="text-[8px] text-slate-500 font-bold tracking-[0.4em] uppercase">Anonim Protokol Aktif</span>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <EyeOff size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Kimlik: GİZLİ</span>
          </div>
        </nav>

        {/* ANA TERMİNAL */}
        <div className="flex-grow bg-white/[0.01] border border-white/5 rounded-[40px] flex flex-col overflow-hidden backdrop-blur-sm relative">
          <div className="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide">
            {messages.map((m, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'syn' ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-6 rounded-[30px] max-w-[80%] ${m.role === 'syn' ? 'bg-blue-600/10 border border-blue-500/20' : 'bg-white/5 border border-white/10'}`}>
                   <span className="text-[7px] font-black uppercase tracking-[0.3em] mb-2 block opacity-30">
                     {m.role === 'syn' ? 'SYN_CORE' : 'ELITE_OPERATOR'}
                   </span>
                   <p className="text-[14px] font-medium leading-relaxed">{m.text}</p>
                </div>
              </motion.div>
            ))}
            {loading && <div className="text-blue-500 animate-pulse text-[10px] font-bold uppercase">SYN Düşünüyor...</div>}
            <div ref={scrollRef} />
          </div>

          {/* INPUT */}
          <form onSubmit={handleAction} className="p-8 bg-black/40 border-t border-white/5">
            <div className="relative">
              <input 
                type
