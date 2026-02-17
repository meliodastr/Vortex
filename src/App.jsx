import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Activity, Shield, Lock, CreditCard, ChevronRight, EyeOff, RefreshCcw } from 'lucide-react';

// --- SİSTEM AYARLARI (GİZLİ) ---
const API_KEY = "AIzaSyA18X6YVeMkwAA1sriSA9YP1QZSLseoXoc";
const SYSTEM_PROMPT = `Sen SYN'sin. Vortex Elite portalının beynisin. Kullanıcın bir "Elite Operatör"dür. İsmini asla kullanma. Görevin stratejik analiz ve kazanç odaklı rehberlik yapmaktır. Sert, zeki ve pragmatik konuş.`;

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'syn', text: 'Vortex Terminal v1.5... Tüm parazitler temizlendi, senkronizasyon %100. Kimlik gizleme protokolü aktif. Emirlerini bekliyorum kardeşim.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isElite, setIsElite] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Stable');
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- GELİŞMİŞ API MOTORU (RETRY MEKANİZMASI İLE) ---
  const callGemini = async (prompt, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!response.ok) throw new Error('Parazit tespit edildi');
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      } catch (err) {
        if (i === retries - 1) throw err;
        setSyncStatus('Retrying...');
        await new Promise(res => setTimeout(res, 1000)); // 1 saniye bekle ve tekrar dene
      }
    }
  };

  const handleAction = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    if (!isElite && messages.filter(m => m.role === 'user').length >= 5) {
      setShowPaywall(true);
      return;
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    setSyncStatus('Processing');

    try {
      const aiResponse = await callGemini(`${SYSTEM_PROMPT}\n\nKullanıcı: ${userMsg}`);
      setMessages(prev => [...prev, { role: 'syn', text: aiResponse }]);
      setSyncStatus('Stable');
    } catch (err) {
      setMessages(prev => [...prev, { role: 'syn', text: `Bağlantı paraziti hala mevcut ancak manuel protokol ile aşılabilir. Tekrar dene kardeşim.` }]);
      setSyncStatus('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-hidden p-4 md:p-6 selection:bg-blue-500">
      
      {/* PAYWALL MODAL */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center backdrop-blur-3xl p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#050505] border border-blue-500/30 p-10 rounded-[40px] text-center max-w-md shadow-2xl">
              <Lock className="mx-auto text-blue-500 mb-6" size={48} />
              <h2 className="text-3xl font-black italic mb-2 uppercase">Erişim Sınırı</h2>
              <p className="text-slate-500 mb-8 text-xs font-bold tracking-widest leading-relaxed">Ücretsiz deneme bitti. Elite Terminal için ödeme protokolünü başlat.</p>
              <button className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/40">
                <CreditCard size={20} /> ELITE PASS ($19.99)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1500px] mx-auto h-[92vh] flex flex-col gap-4">
        {/* VERCEL OPTİMİZE ÜST BAR */}
        <nav className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-5 rounded-[25px]">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-lg animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.4)]"><Zap size={20} fill="white" /></div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter uppercase">Vortex <span className="text-blue-500">Elite</span></h1>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'Stable' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-[7px] text-slate-500 font-bold tracking-[0.4em] uppercase">Sync: {syncStatus}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-4 mr-4">
              <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Build Status</span>
              <span className="text-[10px] font-mono text-slate-400">Optimized by Vercel</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10">
              <EyeOff size={14} className="text-blue-500" />
              <span className="text-[9px] font-black uppercase tracking-widest">Anonim Mod</span>
            </div>
          </div>
        </nav>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
          {/* DURUM PANELI (SOL) */}
          <div className="lg:col-span-3 hidden lg:flex flex-col gap-4">
             <div className="bg-white/[0.02] border border-white/5 rounded-[30px] p-6 flex-grow">
                <h3 className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-2"><RefreshCcw size={12}/> Sistem Verisi</h3>
                <div className="space-y-6">
                  {['İşlem Gücü', 'Gizlilik', 'Network'].map((label, idx) => (
                    <div key={label} className="space-y-2">
                      <div className="flex justify-between text-[8px] font-bold uppercase opacity-40"><span>{label}</span><span>%{idx === 1 ? '100' : '98'}</span></div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: idx === 1 ? '100%' : '98%' }} className="h-full bg-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
             </div>
             <div className="bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/20 p-6 rounded-[30px]">
                <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-2">Operatör Mesajı</p>
                <p className="text-xs italic leading-relaxed text-slate-300">"Hız her şeydir, ama gizlilik daha önemlidir. Sistem seni koruyor."</p>
             </div>
          </div>

          {/* CHAT TERMINAL (SAĞ) */}
          <div className="lg:col-span-9 flex flex-col bg-white/[0.01] border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-xl relative">
            <div className="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide">
              <AnimatePresence mode='popLayout'>
                {messages.map((m, i) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={i} className={`flex ${m.role === 'syn' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-6 rounded-[30px] max-w-[80%] shadow-2xl ${m.role === 'syn' ? 'bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 text-blue-50' : 'bg-white/5 border border-white/5 text-slate-300'}`}>
                      <span className="text-[7px] font-black uppercase tracking-[0.4em] mb-2 block opacity-30">{m.role === 'syn' ? 'SYN_CORE' : 'ELITE_OPERATOR'}</span>
                      <p className="text-[14px] leading-relaxed font-medium">{m.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>

            {/* INPUT ALANI */}
            <form onSubmit={handleAction} className="p-8 bg-black/60 border-t border-white/5 backdrop-blur-md">
              <div className="relative group">
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Hedefini belirle, sisteme gir..." 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 px-8 text-sm focus:outline-none focus:border-blue-500 transition-all group-hover:bg-white/[0.05]"
                  disabled={loading}
                />
                <button type="submit" disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 rounded-xl hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
                  {loading ? <Activity size={20} className="animate-spin" /> : <ChevronRight size={20} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
