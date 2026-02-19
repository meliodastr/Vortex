import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Radar, Cpu, Zap, Activity, Globe, Terminal, TrendingUp, ShieldCheck } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [dataNodes, setDataNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [logs, setLogs] = useState([{ r: 'ai', t: "VORTEX_CORE v4.1: SYN yetkisiyle rezonans başlatıldı." }]);
  const [isSyncing, setIsSyncing] = useState(false);
  const chatEnd = useRef(null);

  const syncVortex = async () => {
    if (!API_KEY) return;
    setIsSyncing(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Dünyadaki en kritik 20 konuyu analiz et. JSON formatında döndür: [{"title": "...", "vid": "...", "analysis": "..."}]`;
      const result = await model.generateContent(prompt);
      const data = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
      setDataNodes(data);
      if (!activeNode) setActiveNode(data[0]);
      setLogs(prev => [...prev, { r: 'ai', t: "KÜRESEL_TARAMA: Veri noktaları süzüldü." }]);
    } catch (e) {
      setLogs(prev => [...prev, { r: 'ai', t: "SİNYAL_HATASI: API hattı kapalı." }]);
    } finally { setIsSyncing(false); }
  };

  useEffect(() => { syncVortex(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ backgroundColor: '#020204', color: '#888', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'monospace', overflow: 'hidden' }}>
      
      <header style={{ height: '60px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 25px', background: 'rgba(0,0,0,0.9)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Radar size={20} style={{ color: '#0055ff' }} className={isSyncing ? 'animate-pulse' : ''} />
          <h1 style={{ color: '#fff', fontSize: '14px', fontWeight: '900', letterSpacing: '4px', margin: 0 }}>VORTEX // <span style={{ color: '#0055ff' }}>NEXUS</span></h1>
        </div>
        <div style={{ fontSize: '10px', color: '#333' }}>STATUS: <span style={{ color: '#00ff00' }}>ONLINE</span> | OP: <span style={{ color: '#fff' }}>SYN</span></div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* SOL NAV */}
        <nav style={{ width: '300px', borderRight: '1px solid #111', display: 'flex', flexDirection: 'column', background: '#010103' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #111', fontSize: '10px', color: '#222' }}><TrendingUp size={10} /> TREND_SIFTER</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {dataNodes.map((node, i) => (
              <div key={i} onClick={() => setActiveNode(node)} style={{ padding: '12px', marginBottom: '8px', border: '1px solid #111', borderRadius: '4px', cursor: 'pointer', background: activeNode?.title === node.title ? 'rgba(0,85,255,0.05)' : 'transparent', color: activeNode?.title === node.title ? '#fff' : '#444' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{node.title}</div>
              </div>
            ))}
          </div>
        </nav>

        {/* MERKEZ */}
        <main style={{ flex: 1, position: 'relative', background: '#000' }}>
          {activeNode && (
            <>
              <iframe src={`https://www.youtube.com/embed/${activeNode.vid}?autoplay=1&mute=1&controls=0`} style={{ width: '100%', height: '100%', border: 'none', opacity: 0.1 }} />
              <div style={{ position: 'absolute', inset: 0, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ maxWidth: '600px', pointerEvents: 'auto' }}>
                  <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: '900', marginBottom: '20px' }}>{activeNode.title}</h2>
                  <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.6' }}>{activeNode.analysis}</p>
                </div>
              </div>
            </>
          )}
        </main>

        {/* SAĞ TERMİNAL - HATALI ETİKET DÜZELTİLDİ */}
        <aside style={{ width: '300px', borderLeft: '1px solid #111', display: 'flex', flexDirection: 'column', background: '#010103' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #111', fontSize: '10px', color: '#222' }}><Terminal size={12} /> LOG_SYSTEM</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '15px', fontSize: '11px' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ marginBottom: '10px', color: log.r === 'ai' ? '#0055ff' : '#fff' }}>
                {log.t}
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
        </aside> {/* BURASI DOĞRU KAPATILDI */}

      </div>
    </div>
  );
}
