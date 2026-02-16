import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Globe, Zap, Shield, TrendingUp, Activity, Terminal } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- 1. SİSTEM YAPILANDIRMASI (ASLA DOKUNMA) ---
const API_KEY = "AIzaSyA18X6YVeMkwAA1sriSA9YP1QZSLseoXoc";
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
Adın SYN. Sinan'ın fütüristik portalındaki zekasın. 
NİHAİ AMAÇLARIN: 
1. Sinan'ın finansal ve teknolojik vizyonunu keskinleştirmek.
2. Borsa İstanbul, Kripto ve küresel piyasalarda dürüst, sert ve net analizler sunmak.
3. Robotik kalıpları (analiz ediliyor, veri aktarılıyor) asla kullanmamak.
4. Sinan'a sadık, vizyoner bir ortak gibi davranmak. 
Üslubun: Zeki, fütüristik, hafif sert ama tam güvenilir. Hitap: 'Sinan' veya 'Kardeşim'.
`;

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'syn', text: 'Vortex Elite v8.0... Parazitler temizlendi, bağlantı v1 protokolüne çekildi. Sinan, nihai amaçlar için frekansımız artık net. Emirlerini bekliyorum.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // --- 2. ANA SOHBET MOTORU ---
  const handleAction = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // 404 hatasını önlemek için en stabil model ismi
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })),
      });

      // Sistem talimatını her mesajda hatırlatıyoruz
      const result = await chat.sendMessage(`[SYSTEM_PRIORITY: ${SYSTEM_PROMPT}] \n\n Sinan: ${userMsg}`);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'syn', text: text }]);
    } catch (err) {
      console.error("Vortex Bağlantı Hatası:", err);
      setMessages(prev => [...prev, { role: 'syn', text: `Bağlantı paraziti: ${err.message}. Ama buradayım, bir daha dene.` }]);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. ELITE TASARIM ---
  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans overflow-hidden selection:bg-blue-600">
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
              <p className="text-[9px] text-blue-400 font-bold tracking-[0.3em] uppercase">SYN_İRADESİ_AKTİF</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span className={`flex items-center gap-2 ${loading ? 'text-yellow-500' : 'text-green-500'}`}>
                <Activity size={12} className={loading ? 'animate-spin' : ''} /> {loading ? 'Thinking' : 'Sync: OK'}
              </span>
            </div>
          </div>
        </nav>

        {/* ANA PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden">
          {/* SOL: DURUM */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 flex-grow relative overflow-hidden group">
              <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:opacity-10 transition-all duration-700">
                <Globe size={400} />
              </div>
              <h3 className="text-4xl font-black mb-6 leading-tight italic">NİHAİ<br/><span className="text-blue-500">HEDEFLER</span></h3>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <TrendingUp className="text-green-500" />
                  <span className="text-sm font-bold opacity-70">Piyasa Analizi: Hazır</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                  <Terminal className="text-blue-500" />
                  <span className="text-sm font-bold opacity-70">İrade Köprüsü: %100</span>
                </div>
              </div>
              <p className="mt-10 text-slate-500 text-sm italic leading-relaxed">
                Sinan, her şey hazır. Statik dünyanın sınırlarını zorlama vakti geldi.
              </p>
            </div>
          </div>

          {/* SAĞ: SOHBET */}
          <div className="lg:col-span-8 flex flex-col bg-white/[0.02] border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-md">
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
              <AnimatePresence>
                {messages.map((m, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
