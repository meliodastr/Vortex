import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Radar, Cpu, Activity, Globe, Terminal, TrendingUp, ShieldCheck } from 'lucide-react';

// API ANAHTARI KONTROLÜ
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const TABS = [
  { id: 'AI', label: 'NEURAL NET', prompt: "AI dünyasındaki 10 kritik haber" },
  { id: 'KRIPTO', label: 'ASSET MATRIX', prompt: "Kripto piyasasındaki 10 önemli gelişme" },
  { id: 'TEKNOLOJI', label: 'CORE TECH', prompt: "Gelecek teknolojileri üzerine 10 başlık" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('AI');
  const [nodes, setNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [logs, setLogs] = useState([{ r: 'ai', t: "VORTEX_v9.2: Build stabilize edildi. Sinyal bekleniyor." }]);
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);

  const fetchVortex = async (tabId) => {
    if (!API_KEY) {
      setLogs(prev => [...prev, { r: 'ai', t: "UYARI: VITE_GEMINI_API_KEY eksik. Vercel ayarlarını kontrol et." }]);
      return;
    }
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const target = TABS.find(t => t.id === tabId);
      const prompt = `Analiz et ve sadece JSON listesi döndür: ${target.prompt}. Format: [{"t": "Başlık", "v": "YouTubeArama", "a": "Analiz"}]`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        const cleanData = JSON.parse(jsonMatch[0]);
        setNodes(cleanData);
        setActiveNode(cleanData[0]);
        setLogs(prev => [...prev, { r: 'ai', t: `${tabId} verisi başarıyla süzüldü.` }]);
      }
    } catch (e) {
      setLogs(prev => [...prev, { r: 'ai', t: "SİNYAL HATASI: Bağlantı kurulamadı." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVortex(activeTab); }, [activeTab]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      
      {/* ÜST PANEL */}
      <header style={{ height: '70px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'space-between', background: '#050505' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Radar size={24} color="#0055ff" className={loading ? "animate-pulse" : ""} />
          <h1 style={{ letterSpacing: '5px', fontWeight: '900', margin: 0 }}>VORTEX</h1>
        </div>
        <nav style={{ display: 'flex', gap: '10px' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? '#0055ff' : '#111', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px' }}>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ANA GÖVDE */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* SOL LİSTE */}
        <aside style={{ width: '320px', borderRight: '1px solid #111', overflowY: 'auto', padding: '15px' }}>
          {nodes.map((n, i) => (
            <div key={i} onClick={() => setActiveNode(n)} style={{ padding: '15px', marginBottom: '10px', border: '1px solid #111', borderRadius: '8px', cursor: 'pointer', background: activeNode?.t === n.t ? '#0a0a20' : 'transparent', borderColor: activeNode?.t === n.t ? '#0055ff' : '#111' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{n.t}</div>
            </div>
          ))}
        </aside>

        {/* MERKEZ GÖRÜNÜM */}
        <main style={{ flex: 1, position: 'relative', background: '#020202' }}>
          {activeNode && (
            <div style={{ padding: '60px' }}>
              <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px
