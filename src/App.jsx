import React, { useState, useEffect, useRef } from 'react';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Radar, Activity, Zap } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([{ t: "VORTEX_v15.5: Gemini 3 Çekirdeği Ateşlendi.", c: "#0055ff" }]);
  const chatEnd = useRef(null);

  // Yeni Gemini 3 sağlayıcısı
  const google = createGoogleGenerativeAI({ apiKey: API_KEY });

  const fetchVortexData = async () => {
    if (!API_KEY) {
      setLogs(p => [...p, { t: "HATA: VITE_GEMINI_API_KEY bulunamadı!", c: "#ff0000" }]);
      return;
    }

    setLoading(true);
    setLogs(p => [...p, { t: "Sinyal taranıyor (Gemini 3 Flash)...", c: "#888" }]);

    try {
      // 21 Ocak 2026 güncellemesine göre en yeni model ismi
      const { text } = await generateText({
        model: google('gemini-3-flash-preview'), 
        prompt: 'Dünyadan 5 önemli teknoloji gelişmesini şu JSON formatında ver: [{"t": "Başlık", "a": "Kısa Analiz"}]',
      });

      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        setNodes(JSON.parse(jsonMatch[0]));
        setLogs(p => [...p, { t: "VORTEX: Gemini 3 Sinyali Stabil.", c: "#00ff00" }]);
      }
    } catch (e) {
      setLogs(p => [...p, { t: `BAĞLANTI HATASI: ${e.message.substring(0, 50)}`, c: "#ffaa00" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVortexData(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ background: '#020205', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' }}>
      <header style={{ height: '70px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'space-between', background: '#000' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radar size={22} color="#0055ff" className={loading ? "animate-pulse" : ""} />
          <h1 style={{ letterSpacing: '6px', fontWeight: '900', fontSize: '18px' }}>VORTEX CORE</h1>
        </div>
        <div style={{ fontSize: '10px', color: '#444' }}>ENGINE: GEMINI 3 // OP: SYN</div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <main style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {nodes.map((n, i) => (
            <div key={i} style={{ padding: '20px', background: '#05050a', border: '1px solid #111', borderRadius: '10px', borderLeft: '3px solid #0055ff' }}>
              <div style={{ color: '#0055ff', fontSize: '10px', marginBottom: '10px' }}> <Activity size={12} /> NEURAL_LINK_{i+1}</div>
              <h3 style={{ fontSize: '17px', marginBottom: '10px', color: '#eee' }}>{n.t}</h3>
              <p style={{ color: '#666', fontSize: '13px', lineHeight: '1.4' }}>{n.a}</p>
            </div>
          ))}
          {loading && <div style={{ color: '#0055ff' }}>Gemini 3 veri süzüyor...</div>}
        </main>

        <aside style={{ width: '300px', borderLeft: '1px solid #111', background: '#010103', padding: '20px', overflowY: 'auto' }}>
          <div style={{ color: '#222', fontSize: '10px', marginBottom: '15px' }}>TERMINAL_LOGS</div>
          {logs.map((l, i) => (
            <div key={i} style={{ color: l.c, marginBottom: '8px', fontSize: '11px' }}>{'>'} {l.t}</div>
          ))}
          <div ref={chatEnd} />
        </aside>
      </div>
    </div>
  );
}
