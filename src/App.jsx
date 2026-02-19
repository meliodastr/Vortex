import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, Activity, Cpu, Rocket, DollarSign, Smartphone, TrendingUp,
  Send, Volume2, VolumeX, BarChart3, Brain, Zap, ShieldCheck
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const CATEGORIES = [
  { id: 'ai', name: 'Yapay Zeka', icon: <Cpu size={16} />, color: 'from-blue-600 to-cyan-400', symbol: 'NASDAQ:NVDA', vid: '9bZkp7q19f0' },
  { id: 'crypto', name: 'Kripto', icon: <DollarSign size={16} />, color: 'from-orange-600 to-yellow-400', symbol: 'BINANCE:BTCUSDT', vid: '0f-jL_mNn_A' },
  { id: 'finance', name: 'Finans', icon: <TrendingUp size={16} />, color: 'from-emerald-600 to-teal-400', symbol: 'TVC:GOLD', vid: '9W44OAtzSUE' },
  { id: 'space', name: 'Uzay', icon: <Rocket size={16} />, color: 'from-purple-600 to-pink-400', symbol: 'NYSE:SPCE', vid: 'GoW8Tf7h978' },
  { id: 'tech', name: 'Teknoloji', icon: <Smartphone size={16} />, color: 'from-green-600 to-emerald-400', symbol: 'NASDAQ:AAPL', vid: 'vS6wzjpCvec' }
];

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ai');
  const [messages, setMessages] = useState([{ role: 'ai', text: "Vortex Radar aktif. Sistem Sinan için hazır." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "Sen Vortex AI'sın. Bu siteyi yöneten rasyonel bir üst akılsın. Sinan'a kısa ve öz analizler sunarsın."
      });
      const result = await model.generateContent(userMsg);
      const text = result.response.text();
      setMessages(prev => [...prev, { role: 'ai', text }]);
      if (voiceEnabled) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'tr-TR';
        window.speechSynthesis.speak(u);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sinyal hatası. Bağlantıyı kontrol et." }]);
    } finally { setLoading(false); }
  };

  const currentCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/60 p-4 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Radar className="text-blue-500 animate-pulse" size={24} />
          <h1 className="text-xl font-black italic tracking-tighter uppercase">Vortex <span className="text-blue-500 text-sm">Radar</span></h1>
        </div>
        <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="p-2 bg-white/5 rounded-xl border border-white/10 text-blue-400">
          {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </header>

      <main className="max-w-[1800px] mx-auto p-6 grid grid-cols-12 gap-6 h-[calc(100vh-80px)]">
        {/* Navigasyon */}
        <div className="col-span-2 flex flex-col gap-2 overflow-y-auto">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${activeCategory === cat.id ? 'bg-blue-600/10 border-blue-500/
