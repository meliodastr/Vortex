import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Radar, Cpu, Activity, Globe, Terminal, TrendingUp } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const TABS = [
  { id: 'AI', label: 'NEURAL NET', prompt: "Kritik yapay zeka haberleri" },
  { id: 'KRIPTO', label: 'ASSET MATRIX', prompt: "Kripto para piyasa analizi" },
  { id: 'TEKNOLOJI', label: 'CORE TECH', prompt: "Yeni teknoloji trendleri" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('AI');
  const [nodes, setNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [logs, setLogs] = useState([{ r: 'ai', t: "VORTEX_v7.1: Sinyal düzeltme protokolü aktif. SYN operatörü bekleniyor." }]);
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);

  const fetchContent = async (tabId) => {
    if (!API_KEY) {
      setLogs(prev => [...prev, { r: 'ai', t: "HATA: VITE_GEMINI_API_KEY eksik." }]);
      return;
    }
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      // HATA ÇÖZÜMÜ: Model ismini tam ve stabil versiyona çekiyoruz
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      
      const target = TABS.find(t => t.id === tabId);
      const prompt = `Dünyadaki en popüler 10 ${target.prompt} konusunu listele. 
      SADECE JSON formatında döndür: [{"title": "Başlık", "vid": "Kısa Konu Araması", "analysis": "Rasyonel Analiz"}]`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const cleanData = JSON.parse(jsonMatch[0]);
        setNodes(cleanData);
        setActiveNode(cleanData[0]);
        setLogs(prev => [...prev, { r: 'ai', t: `${tabId} hattı stabilize edildi. Veri akışı canlı.` }]);
      } else {
        throw new Error("JSON_PARSE_ERROR");
      }
    } catch (e) {
      console.error(e);
      setLogs(prev => [...prev, { r: 'ai', t: `SINYAL_HATASI: ${e.message.includes('404') ? 'Model Bulunamadı (404)' : e.message}` }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchContent(activeTab); }, [activeTab]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ backgroundColor: '#020205', color: '#e0e0e0', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      
      <header style={{ padding: '20px 40px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Radar color="#0055ff" size={24} className={loading ? 'animate-pulse' : ''} />
          <h1 style={{ letterSpacing: '8px', fontWeight: '900', margin: 0, fontSize: '18px' }}>VORTEX</h1>
        </div>
        <nav style={{ display: 'flex', background: '#0a0a0a', padding: '5px', borderRadius: '8px', gap: '5px' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ 
              background: activeTab === tab.id ? '#111' : 'transparent', color: activeTab === tab.id ? '#0055ff' : '#444', 
              border: 'none', padding: '10px 20px', borderRadius: '5px', fontSize: '11px', cursor: 'pointer', fontWeight: '900'
            }}>
              {tab.label}
            </button>
          ))}
        </nav>
        <div style={{ fontSize: '10px', color: '#222' }}>OP: SYN | STATUS: <span style={{ color: '#00ff00' }}>VERIFIED</span></div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        <aside style={{ width: '380px', borderRight: '1px solid #111', overflowY: 'auto', padding: '20px', background: '#010103' }}>
          <div style={{ fontSize: '10px', color: '#333', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span><TrendingUp size={12} /> LIVE_SENSORS</span>
            <span>{nodes.length} NODES</span>
          </div>
          {nodes.map((n, i) => (
            <div key={i} onClick={() => setActiveNode(n)} style={{ 
              padding: '20px', marginBottom: '12px', border: '1px solid #111', borderRadius: '12px', cursor: 'pointer',
              background: activeNode?.title === n.title ? '#080810' : 'transparent',
              borderColor: activeNode?.title === n.title ? '#0055ff' : '#111',
              transition: '0.3s all'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: activeNode?.title === n.title ? '#fff' : '#555' }}>{n.title}</div>
            </div>
          ))}
        </aside>

        <main style={{ flex: 1, position: 'relative', background: '#000' }}>
          {activeNode && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <iframe src={`https://www.youtube.com/embed?listType=search&list=${activeNode.title}&autoplay=1&mute=1&controls=0`} style={{ width: '100%', height: '100%', border: 'none', opacity: 0.15 }} />
              <div style={{ position: 'absolute', inset: 0, padding: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(to top, #000, transparent)' }}>
                <h2 style={{ fontSize: '52px', fontWeight: '900', marginBottom: '25px', letterSpacing: '-2px', textTransform: 'uppercase', color: '#fff' }}>{activeNode.title}</h2>
                <p style={{ color: '#888', fontSize: '18px', maxWidth: '750px', lineHeight: '1.7', fontStyle: 'italic' }}>{activeNode.analysis}</p>
              </div>
            </div>
          )}
        </main>

        <aside style={{ width: '320px', borderLeft: '1px solid #111', display: 'flex', flexDirection: 'column', background: '#010103' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #111', fontSize: '10px', color: '#222' }}><Terminal size={14} /> LOGS</div>
          <div style={{ flex: 1, padding: '25px', fontSize: '11px', overflowY: 'auto', lineHeight: '1.8' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ color: log.r === 'ai' ? '#0055ff' : '#fff', marginBottom: '12px' }}>
                <span style={{ opacity: 0.2 }}>{'>'}</span> {log.t}
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
        </aside>

      </div>
    </div>
  );
}
