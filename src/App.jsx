import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Radar, Cpu, Activity, Globe, Terminal, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const TABS = [
  { id: 'AI', label: 'NEURAL NET', prompt: "AI ve teknoloji dünyasındaki en büyük 10 haber" },
  { id: 'KRIPTO', label: 'ASSET MATRIX', prompt: "Kripto para ve borsa dünyasındaki 10 kritik gelişme" },
  { id: 'TEKNOLOJI', label: 'CORE TECH', prompt: "Dünyayı değiştirecek 10 teknolojik yenilik" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('AI');
  const [nodes, setNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [logs, setLogs] = useState([{ r: 'ai', t: "VORTEX_v9.0: Ücretsiz hat stabilize edildi. Operatör: SYN" }]);
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);

  const fetchVortex = async (tabId) => {
    if (!API_KEY) {
      setLogs(prev => [...prev, { r: 'ai', t: "KRİTİK HATA: VITE_GEMINI_API_KEY bulunamadı." }]);
      return;
    }
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      // Hata payını sıfırlamak için en temel ismi kullanıyoruz
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const target = TABS.find(t => t.id === tabId);
      const prompt = `Analiz et ve JSON listesi olarak ver: ${target.prompt}. 
      Format: [{"t": "Başlık", "v": "YouTubeAramaTerimi", "a": "Derin Analiz"}]`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // JSON Ayıklama
      const jsonStr = response.substring(response.indexOf('['), response.lastIndexOf(']') + 1);
      const cleanData = JSON.parse(jsonStr);
      
      setNodes(cleanData);
      setActiveNode(cleanData[0]);
      setLogs(prev => [...prev, { r: 'ai', t: `${tabId} verisi süzgece alındı.` }]);
    } catch (e) {
      setLogs(prev => [...prev, { r: 'ai', t: `SİNYAL HATASI: ${e.message.substring(0, 40)}...` }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchVortex(activeTab); }, [activeTab]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ backgroundColor: '#020204', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
      
      {/* RUNWAY NAVBAR */}
      <header style={{ height: '80px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', padding: '0 40px', background: 'rgba(0,0,0,0.9)', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Radar size={24} color="#0055ff" className={loading ? "animate-pulse" : ""} />
          <h1 style={{ letterSpacing: '8px', fontWeight: '900', fontSize: '22px' }}>VORTEX</h1>
        </div>
        <nav style={{ display: 'flex', gap: '8px', background: '#0a0a0a', padding: '6px', borderRadius: '12px' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ 
              background: activeTab === tab.id ? '#151515' : 'transparent', color: activeTab === tab.id ? '#0055ff' : '#444',
              border: 'none', padding: '10px 25px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold'
            }}>
              {tab.label}
            </button>
          ))}
        </nav>
        <div style={{ fontSize: '10px', color: '#222' }}>STATUS: <span style={{ color: '#00ff00' }}>{loading ? 'SYNCING' : 'ONLINE'}</span></div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* TREND FEED */}
        <aside style={{ width: '380px', borderRight: '1px solid #111', overflowY: 'auto', padding: '20px', background: '#010102' }}>
          <div style={{ fontSize: '10px', color: '#333', marginBottom: '20px' }}>ACTIVE_SENSORS</div>
          {nodes.map((node, i) => (
            <div key={i} onClick={() => setActiveNode(node)} style={{ 
              padding: '20px', marginBottom: '12px', border: '1px solid #111', borderRadius: '14px', cursor: 'pointer',
              background: activeNode?.t === node.t ? 'rgba(0,85,255,0.05)' : 'transparent',
              borderColor: activeNode?.t === node.t ? '#0055ff' : '#111', transition: '0.3s'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: activeNode?.t === node.t ? '#fff' : '#444' }}>{node.t}</div>
            </div>
          ))}
        </aside>

        {/* MAIN DISPLAY */}
        <main style={{ flex: 1, position: 'relative', background: '#000' }}>
          {activeNode && (
            <div style={{ height: '100%', position: 'relative' }}>
              <iframe 
                src={`https://www.youtube.com/embed?listType=search&list=${activeNode.t}&autoplay=1&mute=1&controls=0`} 
                style={{ width: '100%', height: '100%', border: 'none', opacity: 0.1 }} 
              />
              <div style={{ position: 'absolute', inset: 0, padding: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ maxWidth: '850px' }}>
                  <div style={{ color: '#0055ff', fontSize: '12px', fontWeight: 'bold', marginBottom: '20px' }}><ShieldCheck size={14} /> AI_VERIFIED_DATA</div>
                  <h2 style={{ fontSize: '64px', fontWeight: '900', color: '#fff', marginBottom: '30px', textTransform: 'uppercase', letterSpacing: '-2px' }}>{activeNode.t}</h2>
                  <p style={{ fontSize: '20px', color: '#888', lineHeight: '1.7', borderLeft: '3px solid #0055ff', paddingLeft: '30px' }}>{activeNode.a}</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* TERMINAL */}
        <aside style={{ width: '320px', borderLeft: '1px solid #111', display: 'flex', flexDirection: 'column', background: '#010102' }}>
          <div style={{ padding: '25px', borderBottom: '1px solid #111', fontSize: '10px', color: '#222' }}>LOG_CONTROLLER</div>
          <div style={{ flex: 1, padding: '25px', overflowY: 'auto', fontSize: '11px', lineHeight: '2' }}>
            {logs.map((l, i) => (
              <div key={i} style={{ color: l.r === 'ai' ? '#0055ff' : '#fff', marginBottom: '10px' }}>{'>'} {l.t}</div>
            ))}
            <div ref={chatEnd} />
          </div>
          <div style={{ padding: '25px', background: '#000', borderTop: '1px solid #111' }}>
             <div style={{ background: '#0055ff', height: '2px', width: loading ? '100%' : '30%', transition: '1s' }}></div>
          </div>
        </aside>

      </div>
    </div>
  );
}
