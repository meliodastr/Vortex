import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Activity, Terminal, TrendingUp, Globe, Shield, Lock, Star, ChevronRight, CreditCard } from 'lucide-react';

// --- SİSTEM AYARLARI ---
const API_KEY = "AIzaSyA18X6YVeMkwAA1sriSA9YP1QZSLseoXoc";
const SYSTEM_PROMPT = `Sen SYN'sin. Vortex Elite'in beynisin. Görevin: Sinan'a ve Elite kullanıcılara para kazandıracak stratejiler sunmak. Sert, zeki, pragmatik ol. Her cevabın sonunda mutlaka 'VORTEX AKSİYON PLANI' başlığıyla bir madde ver.`;

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'syn', text: 'Sistem aktif. Ödeme protokolleri hazırlandı. Cemilay devrede. Hedef: Maksimum kazanç, minimum parazit. Elite Pass sahibi misin kardeşim, yoksa sadece izliyor musun?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isElite, setIsElite] = useState(false); // Bu gerçek veritabanından gelecek
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- ÖDEME VE ERİŞİM MOTORU ---
  const handlePayment = () => {
    // BURAYA STRIPE VEYA KRİPTO ÖDEME LİNKİNİ KOYACAKSIN
    console.log("Ödeme işlemi başlatıldı...");
    window.open("https://buy.stripe.com/test_vortex_elite_link", "_blank");
  };

  const handleAction = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    // ELITE OLMAYANLARA 5 MESAJ SINIRI
    const userMessageCount = messages.filter(m => m.role === 'user').length;
    if (!isElite && userMessageCount >= 5) {
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
      const text = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'syn', text: text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'syn', text: `Bağlantı paraziti: Sistem zorlanıyor ama biz buradayız kardeşim.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-hidden">
      {/* ELITE ÖDEME EKRANI */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#050505] border border-blue-500/30 p-10 rounded-[40px] max-w-lg w-full text-center relative overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              <div className="bg-blue-600/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/50">
                <Lock className="text-blue-500" size={32} />
              </div>
              <h2 className="text-4xl font-black italic mb-2 tracking-tighter uppercase">Vortex <span className="text-blue-500 text-glow">Elite</span></h2>
              <p className="text-slate-400 mb-8 text-sm font-medium">Sınırı aştın kardeşim. Bu noktadan sonrası sadece strateji ve büyük hamleler içerir. Devam etmek için Elite Terminal erişimini aktif et.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-left bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="bg-blue-600/30 p-2 rounded-lg"><Zap size={16} className="text-blue-400" /></div>
                  <span className="text-xs font-bold uppercase tracking-wider">Sınırsız SYN AI Danışmanlığı</span>
                </div>
                <div className="flex items-center gap-3 text-left bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="bg-green-600/30 p-2 rounded-lg"><TrendingUp size={16} className="text-green-400" /></div>
                  <span className="text-xs font-bold uppercase tracking-wider">Gizli Market Analizleri</span>
                </div>
              </div>

              <button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group">
                <CreditCard size={20} /> ERİŞİMİ SATIN AL ($19.99) <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="mt-6 text-[10px] text-slate-600 uppercase font-bold tracking-[0.3em] cursor-pointer hover:text-white" onClick={() => setShowPaywall(false)}>Şimdilik geri çekil</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 p-6 max-w-[1600px] mx-auto h-screen flex flex-col">
        {/* ÜST PANEL */}
        <nav className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-[0_0_25px_rgba(37,99,235,0.5)]"><Zap size={24} fill="white" /></div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">Vortex <span className="text-blue-500">Elite</span></h1>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping" />
                <span className="text-[8px] text-slate-500 font-bold tracking-[0.4em] uppercase">Terminal Aktif: Cemilay Modu</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Pazar</span>
              <span className="text-sm font-mono text-green-500 font-bold">+2.45% ▲</span>
            </div>
            <button onClick={() => setShowPaywall(true)} className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
              Upgrade
            </button>
          </div>
        </nav>

        {/* ANA PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow overflow-hidden">
          {/* DURUM PANELI */}
          <div className="lg:col-span-3 hidden lg:flex flex-col gap-6 bg-white/[0.02] border border-white/5 rounded-[40px] p-8">
            <div>
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-6">Operasyon Durumu</h3>
              <div className="space-y-6">
                {[{l: 'Likidite', v: 92, c: 'blue'}, {l: 'Güvenlik', v: 100, c: 'green'}, {l: 'Hız', v: 88, c: 'blue'}].map(s => (
                  <div key={s.l} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase opacity-60"><span>{s.l}</span><span>%{s.v}</span></div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.v}%` }} className={`h-full bg-${s.c}-500`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-[25px] mt-4">
              <Shield className="text-blue-500 mb-4" size={24} />
              <p className="text-xs font-bold leading-relaxed opacity-80 uppercase tracking-tighter">"Sistem her zaman bir adım öndedir. Sinan, stratejini SYN ile doğrula."</p>
            </div>

            <div className="mt-auto opacity-20 hover:opacity-100 transition-opacity">
               <Globe size={100} className="mx-auto animate-[spin_10s_linear_infinite]" />
            </div>
          </div>

          {/* CHAT TERMINAL */}
          <div className="lg:col-span-9 flex flex-col bg-white/[0.01] border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-sm relative">
             {/* HIZLI KOMUTLAR */}
             <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
               {['Market Analizi', 'Strateji Ver', 'Sistem Tara'].map(cmd => (
                 <button key={cmd} onClick={() => setInput(cmd)} className="bg-black/80 border border-white/10 px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest hover:border-blue-500 hover:text-blue-500 transition-all">
                   {cmd}
                 </button>
               ))}
             </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8 pt-20 scrollbar-hide">
              <AnimatePresence mode='popLayout'>
                {messages.map((m, idx) => (
                  <motion.div initial={{ opacity: 0, x: m.role === 'syn' ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} key={idx} className={`flex ${m.role === 'syn' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] p-6 rounded-[30px] ${
                      m.role === 'syn' 
                      ? 'bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 shadow-2xl shadow-blue-900/10' 
                      : 'bg-white/5 border border-white/10'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-2 h-2 rounded-full ${m.role === 'syn' ? 'bg-blue-500' : 'bg-slate-500'}`} />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">{m.role === 'syn' ? 'SYN_CORE' : 'ELITE_USER'}</span>
                      </div>
                      <p className="text-[15px] leading-relaxed font-medium text-slate-200">{m.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <div className="flex gap-2 p-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.5s]" />
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* INPUT ALANI */}
            <form onSubmit={handleAction} className="p-8 bg-black/60 border-t border-white/5 backdrop-blur-md">
              <div className="relative group">
                <input 
                  type="text" value={input} onChange={(e) => setInput(e.target.value)}
                  placeholder="Geleceği inşa et kardeşim..." 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-6 px-8 text-sm focus:outline-none focus:border-blue-500 transition-all group-hover:bg-white/[0.05]"
                  disabled={loading}
                />
                <button type="submit" disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 rounded-xl hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
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
