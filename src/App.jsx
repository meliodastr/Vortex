import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  Radar, Cpu, Zap, Activity, Globe, 
  Terminal, Search, Filter, ShieldAlert 
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [dataNodes, setDataNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [logs, setLogs] = useState([{ r: 'ai', t: "Vortex Süzgeç Aktif. Küresel tarama başlatılıyor..." }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEnd = useRef(null);

  // OTONOM SÜZGEÇ MOTORU (15-35 Konu Tarama)
  const runGlobalSifting = async () => {
    if (!API_KEY) return;
    setIsProcessing(true);
    setLogs(prev => [...prev, { r: 'ai', t: "Gemini Üst Akıl dünyayı tarıyor (15-35 kritik nokta)..." }]);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Şu an dünyadaki en kritik teknolojik, bilimsel ve jeopolitik 20 konuyu analiz et. 
      Her biri için bir başlık, ilgili bir YouTube video ID (genel konu araması) ve rasyonel bir analiz özeti oluştur.
      Format: [{"title": "...", "vid": "...", "analysis": "..."}]`;

      const result = await model.generateContent(prompt);
      const cleanedText = result.response.text().replace(/```json|```/g, "").trim();
      const rawData = JSON.parse(cleanedText);
      
      setDataNodes(rawData);
      setActiveNode(rawData[0]);
      setLogs(prev => [...prev, { r: 'ai', t: `${rawData.length} kritik veri noktası süzüldü ve senkronize edildi.` }]);
    } catch (err) {
      setLogs(prev => [...prev, { r: 'ai', t: "Süzgeç paraziti: Veri çekilemedi. Döngü korunuyor." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    runGlobalSifting();
    const interval = setInterval(runGlobalSifting, 900000); // 15 dakikada bir tam tarama
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ backgroundColor: '#020205', color: '#444', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
      
      {/* ÜST RADAR PANELİ */}
      <header style={{ height: '70px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', background: '#000', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Radar size={24} style={{ color: isProcessing ? '#00ff00' : '#0055ff' }} className={isProcessing ? 'animate-pulse' : ''} />
          <div>
            <h1 style={{ color: '#fff', fontSize: '16px', letterSpacing: '5px', margin: 0, fontWeight: 900 }}>VORTEX <span style={{ color: '#0055ff' }}>SIFTER</span></h1>
            <div style={{ fontSize: '8px', color: '#333' }}>GLOBAL_INTELLIGENCE_FILTER_v3.0</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '30px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '9px', color: '#222' }}>ACTIVE_NODES</div>
            <div style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>{dataNodes.length} / 35</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '9px', color: '#222' }}>SYN_STATUS</div>
            <div style={{ fontSize: '12px', color: '#00ff00' }}>AUTHORIZED</div>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* SOL: VERİ MATRİSİ (15-35 NOKTA) */}
        <aside style={{ width: '380px', borderRight: '1px solid #111', background: '#010103', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', fontSize: '10px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between' }}>
            <span><Filter size={10} /> SÜZÜLMÜŞ_VERİ_AKIŞI</span>
            <Activity size={10} color="#0055ff" />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }} className="custom-scrollbar">
            {dataNodes.map((node, i) => (
              <div 
                key={i} 
                onClick={() => setActiveNode(node)}
                style={{ 
                  padding: '15px', marginBottom: '8px', borderRadius: '8px', cursor: 'pointer',
                  border: '1px solid #111', background: activeNode?.title === node.title ? '#050515' : 'transparent',
                  transition: '0.2s all'
                }}
              >
                <div style={{ fontSize: '10px', color: activeNode?.title === node.title ? '#0055ff' : '#222', marginBottom: '5px' }}>NODE_0{i+1}</div>
                <div style={{ color: activeNode?.title === node.title ? '#fff' : '#555', fontSize: '12px', fontWeight: 'bold' }}>{node.title}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* ORTA: RASYONEL ANALİZ MERKEZİ */}
        <main style={{ flex: 1, position: 'relative', background: '#000', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <iframe 
              src={`https://www.youtube.com/embed/${activeNode?.vid}?autoplay=1&mute=1&controls=0`} 
              style={{ width: '100%', height: '100%', border: 'none', opacity: 0.1 }}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
              <div style={{ maxWidth: '800px', textAlign: 'center' }}>
                <h2 style={{ color: '#fff', fontSize: '42px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-2px', marginBottom: '20px' }}>{activeNode?.title}</h2>
                <div style={{ height: '2px', width: '100px', background: '#0055ff', margin: '0 auto 30px auto' }}></div>
                <p style={{ color: '#888', fontSize: '16px', lineHeight: '1.8', fontStyle: 'italic' }}>{activeNode?.analysis}</p>
              </div>
            </div>
          </div>
          
          {/* ALT TERMİNAL LOGLARI */}
          <div style={{ height: '200px', borderTop: '1px solid #111', background: '#010103', padding: '20px', overflowY: 'auto' }} className="custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} style={{ fontSize: '10px', color: log.r === 'ai' ? '#0055ff' : '#fff', marginBottom: '8px', fontFamily: 'monospace' }}>
                <span style={{ opacity: 0.3 }}>[{new Date().toLocaleTimeString()}]</span> {log.r === 'ai' ? '>> VRTX_CORE: ' : '>> SYN_USER: '} {log.t}
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #111; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0055ff; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        .animate-pulse { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
}
