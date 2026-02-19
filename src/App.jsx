import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Radar, Cpu, Zap, Activity, Globe, Terminal, TrendingUp, ShieldCheck, Play, Info } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// AI GELMEDİĞİNDE SİTEYİ DOLDURACAK YEDEK VERİ MATRİSİ
const FALLBACK_DATA = [
  { title: "NÖRAL AĞ SENKRONİZASYONU", vid: "9bZkp7q19f0", analysis: "AI hattı bekleniyor. Küresel veri süzgeci standby modunda." },
  { title: "KRİPTO VARLIK VOLATİLİTESİ", vid: "0f-jL_mNn_A", analysis: "Piyasa sinyalleri rasyonel sınırda izleniyor." },
  { title: "DERİN UZAY RADARI", vid: "GoW8Tf7h978", analysis: "Yörünge verileri SYN yetkisiyle filtreleniyor." }
];

export default function App() {
  const [dataNodes, setDataNodes] = useState(FALLBACK_DATA);
  const [activeNode, setActiveNode] = useState(FALLBACK_DATA[0]);
  const [logs, setLogs] = useState([{ r: 'ai', t: "VORTEX_v5: Sistem stabilize edildi. SYN yetkisi aktif." }]);
  const [isSyncing, setIsSyncing] = useState(false);
  const chatEnd = useRef(null);

  const syncVortex = async () => {
    if (!API_KEY) {
      setLogs(prev => [...prev, { r: 'ai', t: "UYARI: API_KEY bulunamadı. Yedek veri katmanı aktif." }]);
      return;
    }
    setIsSyncing(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Dünyadaki en popüler 20 teknoloji haberini [{title, vid, analysis}] formatında ver.`;
      const result = await model.generateContent(prompt);
      const data = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
      setDataNodes(data);
      setActiveNode(data[0]);
      setLogs(prev => [...prev, { r: 'ai', t: "BAŞARI: Küresel süzgeçten taze veri enjekte edildi." }]);
    } catch (e) {
      setLogs(prev => [...prev, { r: 'ai', t: "HATA: Sinyal paraziti. Yedekler korunuyor." }]);
    } finally { setIsSyncing(false); }
  };

  useEffect(() => { syncVortex(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ backgroundColor: '#020204', color: '#888', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'monospace', overflow: 'hidden' }}>
      
      {/* HEADER: DAHA AGRESİF VE MODERN */}
      <header style={{ height: '70px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', background: 'linear-gradient(to right, #000, #050510)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <Radar size={24} style={{ color: '#0055ff' }} />
            <div style={{ position: 'absolute', inset: -5, border: '1px solid #0055ff', borderRadius: '50%', opacity: 0.2 }} className="animate-ping"></div>
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: '18px', fontWeight: '900', letterSpacing: '6px', margin: 0 }}>VORTEX <span style={{ color: '#0055ff' }}>NEXUS</span></h1>
            <div style={{ fontSize: '8px', color: '#444' }}>AUTONOMOUS_FILTER_SYSTEM_v5.0</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '40px', fontSize: '10px', letterSpacing: '2px' }}>
          <span style={{ color: '#222' }}>LATENCY: <b style={{ color: '#fff' }}>24MS</b></span>
          <span style={{ color: '#222' }}>STATUS: <b style={{ color: '#00ff00' }}>AUTHORIZED</b></span>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* SOL: TREND LİSTESİ */}
        <nav style={{ width: '350px', borderRight: '1px solid #111', background: '#010103', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #111', fontSize: '10px', color: '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><TrendingUp size={12} /> GLOBAL_TREND_FEED</span>
            <Activity size={12} style={{ color: '#0055ff' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
            {dataNodes.map((node, i) => (
              <div key={i} onClick={() => setActiveNode(node)} style={{ 
                padding: '18px', marginBottom: '10px', border: '1px solid #111', borderRadius: '8px', cursor: 'pointer',
                background: activeNode?.title === node.title ? 'rgba(0,85,255,0.05)' : 'transparent',
                borderLeft: activeNode?.title === node.title ? '4px solid #0055ff' : '1px solid #111',
                transition: '0.3s all'
              }}>
                <div style={{ fontSize: '12px', color: activeNode?.title === node.title ? '#fff' : '#444', fontWeight: 'bold' }}>{node.title}</div>
                <div style={{ fontSize: '9px', color: '#222', marginTop: '5px' }}>{i + 1} / {dataNodes.length} NODE</div>
              </div>
            ))}
          </div>
        </nav>

        {/* MERKEZ: VİZÜALİZASYON KATMANI */}
        <main style={{ flex: 1, position: 'relative', background: '#000' }}>
          {activeNode && (
            <>
              <iframe src={`https://www.youtube.com/embed/${activeNode.vid}?autoplay=1&mute=1&controls=0`} style={{ width: '100%', height: '100%', border: 'none', opacity: 0.15 }} />
              <div style={{ position: 'absolute', inset: 0, padding: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', pointerEvents: 'none' }}>
                <div style={{ maxWidth: '700px', pointerEvents: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0055ff', marginBottom: '20px' }}>
                    <ShieldCheck size={20} />
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>RASYONEL_VERİ_SÜZGECİ</span>
                  </div>
                  <h2 style={{ color: '#fff', fontSize: '48px', fontWeight: '900', marginBottom: '25px', letterSpacing: '-2px', textTransform: 'uppercase' }}>{activeNode.title}</h2>
                  <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.8', fontStyle: 'italic', borderLeft: '2px solid #111', paddingLeft: '20px' }}>{activeNode.analysis}</p>
                </div>
              </div>
            </>
          )}
          <div style={{ position: 'absolute', bottom: 30, right: 30, display: 'flex', gap: '10px' }}>
             <div style={{ background: '#0055ff', color: '#fff', padding: '10px 20px', borderRadius: '30px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}><Play size={12}/> LIVE_FEED</div>
          </div>
        </main>

        {/* SAĞ: TERMİNAL LOG */}
        <aside style={{ width: '320px', borderLeft: '1px solid #111', display: 'flex', flexDirection: 'column', background: '#010103' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #111', fontSize: '10px', color: '#222', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={14} /> SYSTEM_CORE_LOGS
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', fontSize: '11px', lineHeight: '1.6' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ marginBottom: '15px', color: log.r === 'ai' ? '#0055ff' : '#fff' }}>
                <span style={{ opacity: 0.3 }}>[{new Date().toLocaleTimeString()}]</span> {log.t}
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
          <div style={{ padding: '20px', borderTop: '1px solid #111', background: '#000' }}>
            <div style={{ fontSize: '9px', color: '#333', marginBottom: '10px' }}>AI_NEURAL_LINK</div>
            <div style={{ height: '4px', width: '100%', background: '#111', borderRadius: '10px' }}>
              <div style={{ height: '100%', width: API_KEY ? '100%' : '5%', background: '#0055ff', borderRadius: '10px', transition: '1s all' }}></div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
