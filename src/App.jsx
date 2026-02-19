import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  Radar, Cpu, Zap, Activity, Globe, Terminal, 
  TrendingUp, BarChart3, Layers, Monitor, PlayCircle 
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const TABS = [
  { id: 'AI', label: 'NEURAL NET', icon: <Cpu size={16}/>, prompt: "Kritik yapay zeka ve LLM haberleri" },
  { id: 'KRIPTO', label: 'ASSET MATRIX', icon: <Activity size={16}/>, prompt: "Kripto piyasası ve blockchain analizleri" },
  { id: 'UZAY', label: 'ORBITAL RADAR', icon: <Globe size={16}/>, prompt: "Uzay keşfi ve havacılık gelişmeleri" },
  { id: 'TEKNOLOJI', label: 'CORE TECH', icon: <Layers size={16}/>, prompt: "Donanım, yarı iletken ve kuantum haberleri" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('AI');
  const [nodes, setNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [logs, setLogs] = useState([{ r: 'ai', t: "VORTEX_SYSTEM: Runway v6.0 Protokolü Aktif." }]);
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);

  // --- SEKMEYE GÖRE CANLI VERİ SÜZÜCÜ ---
  const fetchContent = async (tabId) => {
    if (!API_KEY) return;
    setLoading(true);
    const targetTab = TABS.find(t => t.id === tabId);
    
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Şu an dünyadaki en popüler ${targetTab.prompt} konularını analiz et. 
      JSON formatında 15-20 tane ver: [{"title": "...", "vid": "...", "analysis": "...", "trend": "+%85"}]`;

      const result = await model.generateContent(prompt);
      const data = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
      
      setNodes(data);
      setActiveNode(data[0]);
      setLogs(prev => [...prev, { r: 'ai', t: `${targetTab.label} senkronizasyonu tamamlandı.` }]);
    } catch (e) {
      setLogs(prev => [...prev, { r: 'ai', t: "Sinyal hatası: Veri çekilemedi." }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchContent(activeTab); }, [activeTab]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div className="vortex-container" style={{ backgroundColor: '#020203', color: '#f0f0f0', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
      
      {/* RUNWAY STYLE HEADER */}
      <header style={{ height: '80px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', padding: '0 40px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Radar size={28} color="#0055ff" />
          <div style={{ letterSpacing: '8px', fontWeight: '900', fontSize: '20px' }}>VORTEX</div>
        </div>
        <nav style={{ display: 'flex', gap: '5px', background: '#0a0a0a', padding: '5px', borderRadius: '12px' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ 
              padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: '0.3s',
              background: activeTab === tab.id ? '#151515' : 'transparent',
              color: activeTab === tab.id ? '#0055ff' : '#444',
              display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', fontWeight: '700'
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div style={{ fontSize: '10px', color: '#222' }}>AUTHORIZED_ACCESS // <span style={{ color: '#00ff00' }}>SYN</span></div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* SIDEBAR: TRENDS */}
        <aside style={{ width: '380px', borderRight: '1px solid #111', display: 'flex', flexDirection: 'column', background: '#010102' }}>
          <div style={{ padding: '25px', fontSize: '10px', color: '#333', borderBottom: '1px solid #080808', display: 'flex', justifyContent: 'space-between' }}>
            <span>LIVE_Sifting_REPORT</span>
            <Activity size={12} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
            {loading ? (
              <div style={{ padding: '20px', color: '#111', fontSize: '11px' }} className="animate-pulse">Sinyal taranıyor...</div>
            ) : nodes.map((node, i) => (
              <div key={i} onClick={() => setActiveNode(node)} style={{ 
                padding: '20px', marginBottom: '10px', borderRadius: '12px', border: '1px solid #111', cursor: 'pointer',
                background: activeNode?.title === node.title ? '#08080c' : 'transparent',
                transition: '0.2s', position: 'relative'
              }}>
                <div style={{ fontSize: '9px', color: '#0055ff', marginBottom: '8px' }}>{node.trend} GROWTH</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: activeNode?.title === node.title ? '#fff' : '#555' }}>{node.title}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <main style={{ flex: 1, position: 'relative', background: '#000' }}>
          {activeNode && (
            <>
              <iframe 
                src={`https://www.youtube.com/embed/${activeNode.vid}?autoplay=1&mute=1&controls=0`} 
                style={{ width: '100%', height: '100%', border: 'none', opacity: 0.1 }}
              />
              <div style={{ position: 'absolute', inset: 0, padding: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ maxWidth: '900px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(30px)', padding: '50px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h2 style={{ fontSize: '56px', fontWeight: '900', color: '#fff', marginBottom: '30px', letterSpacing: '-2px', lineHeight: '1' }}>{activeNode.title}</h2>
                  <p style={{ fontSize: '18px', color: '#888', lineHeight: '1.8', maxWidth: '80%' }}>{activeNode.analysis}</p>
                </div>
              </div>
            </>
          )}
        </main>

        {/* TERMINAL: LOGS */}
        <aside style={{ width: '320px', borderLeft: '1px solid #111', display: 'flex', flexDirection: 'column', background: '#010102' }}>
          <div style={{ padding: '25px', borderBottom: '1px solid #080808', fontSize: '10px', color: '#222' }}>COMMAND_CENTER</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '25px', fontSize: '11px', lineHeight: '2' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ color: log.r === 'ai' ? '#0055ff' : '#fff', marginBottom: '10px' }}>
                <span style={{ opacity: 0.2 }}>{'> '}</span>{log.t}
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
          <div style={{ padding: '25px', borderTop: '1px solid #080808' }}>
            <div style={{ height: '2px', width: '100%', background: '#111' }}>
              <div style={{ height: '100%', width: loading ? '100%' : '20%', background: '#0055ff', transition: '2s' }}></div>
            </div>
          </div>
        </aside>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #111; border-radius: 10px; }
        .animate-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
