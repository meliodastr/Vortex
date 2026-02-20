import React, { useState, useEffect, useRef } from 'react';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Radar, Activity, Cpu } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([{ t: "VORTEX_v15: Sistem Başlatıldı.", c: "#0055ff" }]);
  const chatEnd = useRef(null);

  const google = createGoogleGenerativeAI({ apiKey: API_KEY });

  const fetchVortexData = async () => {
    if (!API_KEY) {
      setLogs(p => [...p, { t: "HATA: API_KEY Bulunamadı!", c: "#ff0000" }]);
      return;
    }
    setLoading(true);
    try {
      const { text } = await generateText({
        model: google('gemini-1.5-flash'),
        prompt: 'Dünyadan 5 önemli teknoloji haberi sağla. JSON formatında: [{"t": "Başlık", "a": "Analiz"}]',
      });
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        setNodes(JSON.parse(jsonMatch[0]));
        setLogs(p => [...p, { t: "Sinyal stabilize edildi.", c: "#00ff00" }]);
      }
    } catch (e) {
      setLogs(p => [...p, { t: `KOPMA: ${e.message.substring(0, 20)}`, c: "#ffaa00" }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchVortexData(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView(); }, [logs]);

  return (
    <div style={{ background: '#020205', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' }}>
      <header style={{ height: '70px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radar size={24} color="#0055ff" />
          <h1 style={{ letterSpacing: '5px', fontWeight: '900' }}>VORTEX CORE</h1>
        </div>
        <div style={{ fontSize: '10px', color: '#444' }}>OP: SINAN // STATUS: ONLINE</div>
      </header>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <main style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {nodes.map((n, i) => (
            <div key={i} style={{ padding: '20px', background: '#05050a', border: '1px solid #111', borderRadius: '10px' }}>
              <div style={{ color: '#0055ff', fontSize: '10px', marginBottom: '10px' }}><Activity size={10} /> NODE_{i+1}</div>
              <h3 style={{ marginBottom: '10px' }}>{n.t}</h3>
              <p style={{ color: '#666', fontSize: '13px' }}>{n.a}</p>
            </div>
          ))}
        </main>
        <aside style={{ width: '280px', borderLeft: '1px solid #111', background: '#010103', padding: '15px', fontSize: '11px', overflowY: 'auto' }}>
          {logs.map((l, i) => <div key={i} style={{ color: l.c, marginBottom: '8px' }}>{'>'} {l.t}</div>)}
          <div ref={chatEnd} />
        </aside>
      </div>
    </div>
  );
}
