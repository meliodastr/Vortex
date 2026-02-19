import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Radar, Cpu, Activity, Globe, Terminal, TrendingUp, Layers } from 'lucide-react';

// API ANAHTARI KONTROLÜ
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const TABS = [
  { id: 'AI', label: 'NEURAL NET', prompt: "Yapay zeka ve teknoloji haberleri" },
  { id: 'KRIPTO', label: 'ASSET MATRIX', prompt: "Kripto para ve borsa analizleri" },
  { id: 'TEKNOLOJI', label: 'CORE TECH', prompt: "Yeni nesil teknoloji gelişmeleri" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('AI');
  const [nodes, setNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [logs, setLogs] = useState([{ r: 'ai', t: "VORTEX_v7.0: Zero-Tolerance Protokolü Aktif. Operatör: SYN" }]);
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);

  const fetchContent = async (tabId) => {
    if (!API_KEY) {
      setLogs(prev => [...prev, { r: 'ai', t: "HATA: API Anahtarı Sistemde Tanımlı Değil." }]);
      return;
    }
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const target = TABS.find(t => t.id === tabId);
      const prompt = `Şu anki ${target.prompt} konularından 10 adet seç. JSON: [{"title": "Başlık", "vid": "YouTube_ID", "analysis": "Kısa Analiz"}]`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // JSON AYIKLAMA (Sinyal hatasını bitiren cerrahi işlem)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const cleanData = JSON.parse(jsonMatch[0]);
        setNodes(cleanData);
        setActiveNode(cleanData[0]);
        setLogs(prev => [...prev, { r: 'ai', t: `${tabId} hattı başarıyla senkronize edildi.` }]);
      } else {
        throw new Error("Geçersiz Veri Formatı");
      }
    } catch (e) {
      setLogs(prev => [...prev, { r: 'ai', t: `SINYAL_KESINTISI: ${e.message}` }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchContent(activeTab); }, [activeTab]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      
      {/* RUNWAY STYLE HEADER */}
      <header style={{ padding: '20px 40px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#050505' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Radar color="#0055ff" size={24} className={loading ? 'animate-pulse' : ''} />
          <h1 style={{ letterSpacing: '5px', fontWeight: '900', margin: 0 }}>VORTEX</h1>
        </div>
        <nav style={{ display: 'flex', gap: '10px' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ 
              background: activeTab === tab.id ? '#0055ff' : '#111', color: '#fff', border: 'none',
              padding: '8px 20px', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold'
            }}>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* SOL LİSTE */}
        <aside style={{ width: '350px', borderRight: '1px solid #111', overflowY: 'auto', padding: '20px' }}>
          <div style={{ fontSize: '10px', color: '#333', marginBottom: '20px' }}>CANLI_VERI_AKISI</div>
          {nodes.map((n, i) => (
            <div key={i} onClick={() => setActiveNode(n)} style={{ 
              padding: '15px', marginBottom: '10px', border: '1px solid #111', borderRadius: '8px', cursor: 'pointer',
              background: activeNode?.title === n.title ? '#0a0a15' : 'transparent',
              borderColor: activeNode?.title === n.title ? '#0055ff' : '#111'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{n.title}</div>
            </div>
          ))}
        </aside>

        {/* MERKEZ VİDEO/ANALİZ */}
        <main style={{ flex: 1, position: 'relative', background: '#020202' }}>
          {activeNode && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <iframe src={`https://www.youtube.com/embed/${activeNode.vid}?autoplay=1&mute=1&controls=0`} style={{ width: '100%', height: '100%', border: 'none', opacity: 0.1 }} />
                <div style={{ position: 'absolute', inset: 0, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px', maxWidth: '800px' }}>{activeNode.title}</h2>
                  <p style={{ color: '#888', fontSize: '18px', maxWidth: '700px', lineHeight: '1.6' }}>{activeNode.analysis}</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* SAĞ TERMİNAL */}
        <aside style={{ width: '300px', borderLeft: '1px solid #111', display: 'flex', flexDirection: 'column', background: '#050505' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #111', fontSize: '10px' }}>KONTROL_MERKEZI</div>
          <div style={{ flex: 1, padding: '20px', fontSize: '11px', overflowY: 'auto' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ color: log.r === 'ai' ? '#0055ff' : '#fff', marginBottom: '10px' }}>{'> '}{log.t}</div>
            ))}
            <div ref={chatEnd} />
          </div>
        </aside>

      </div>
    </div>
  );
}
