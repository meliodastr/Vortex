import React, { useState, useEffect, useRef } from 'react';
import { Radar, Cpu, Rocket, DollarSign, Send, BarChart3, MessageCircle, Heart, Repeat2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const CATEGORIES = [
  { id: 'ai', name: 'Artificial Intelligence', icon: <Cpu size={18}/>, color: 'from-blue-600', vid: '9bZkp7q19f0' },
  { id: 'crypto', name: 'Crypto Assets', icon: <DollarSign size={18}/>, color: 'from-orange-600', vid: '0f-jL_mNn_A' }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [messages, setMessages] = useState([{ role: 'ai', text: "Vortex Nexus Çevrimiçi. SYN için sinyal taranıyor..." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Vercel'den gelen anahtarı kontrol et
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!API_KEY) {
      setMessages(prev => [...prev, { role: 'ai', text: "KRİTİK: VITE_GEMINI_API_KEY tanımsız. Vercel paneline anahtarı gir SYN." }]);
    }
  }, [messages, API_KEY]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      if (!API_KEY) throw new Error("API_KEY_MISSING");

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Sen Vortex AI'sın. Kullanıcın SYN. Rasyonel ve kısa cevaplar ver."
      });

      const result = await model.generateContent(userMsg);
      const responseText = result.response.text();
      setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    } catch (err) {
      console.error(err);
      let errorDesc = "Sinyal Kesildi: Protokol Hatası.";
      if (err.message === "API_KEY_MISSING") errorDesc = "HATA: Vercel üzerinde API anahtarı bulunamadı.";
      if (err.message.includes("API_KEY_INVALID")) errorDesc = "HATA: Girdiğin API anahtarı geçersiz SYN.";
      
      setMessages(prev => [...prev, { role: 'ai', text: errorDesc }]);
    } finally {
      setLoading(false);
    }
  };

  const current = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans overflow-hidden">
      <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex justify-between items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Radar className="text-blue-500 animate-pulse" />
          <h1 className="font-black italic text-xl tracking-tighter">VORTEX<span className="text-blue-500">NEXUS</span></h1>
        </div>
        <div className="text-[10px] font-mono text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-widest">SYN_Otonom_Mod</div>
      </header>

      <div className="flex-grow flex p-4 gap-4 overflow-hidden">
        {/* SOL NAV */}
        <nav className="w-64 hidden md:flex flex-col gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`p-4 rounded-2xl flex items-center gap-3 border transition-all ${activeCategory === cat.id ? 'bg-blue-600/20 border-blue-500/50' : 'border-transparent hover:bg-white/5'}`}>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${cat.color} to-black shadow-lg`}>{cat.
