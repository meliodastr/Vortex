import React, { useState, useEffect, useRef } from 'react';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Radar, Activity, Cpu, Terminal } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([{ t: "VORTEX_v15: AI Çekirdeği Ateşlendi.", c: "#0055ff" }]);
  const chatEnd = useRef(null);

  // AI Sağlayıcı Tanımı
  const google = createGoogleGenerativeAI({ apiKey: API_KEY });

  const fetchVortexData = async () => {
    if (!API_KEY) {
      setLogs(p => [...p, { t: "KRİTİK: API Anahtarı Bulunamadı!", c: "#ff0000" }]);
      return;
    }

    setLoading(true);
    setLogs(p => [...p, { t: "Sinyal taranıyor (gemini-1.5-flash-latest)...", c: "#888" }]);

    try {
      const { text } = await generateText({
        model: google('gemini-1.5-flash-latest'),
        prompt: 'Dünyadan 5 önemli teknoloji gelişmesini JSON formatında ver: [{"t": "Başlık", "a": "Kısa Analiz"}]',
      });

      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        setNodes(JSON.parse(jsonMatch[0]));
        setLogs(p => [...p, { t: "Sinyal stabilize edildi. Veri akışı aktif.", c: "#00ff00" }]);
      }
    } catch (e) {
      setLogs(p => [...p, { t: `BAĞLANTI HATASI: ${e.message.slice(0, 40)}`, c: "#ffaa00" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVortexData(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ background: '#020205', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' }}>
      <header style={{ height: '70px', borderBottom: '1px solid #1a1a2e', display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'space-between', background: '#000' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radar size={22} color="#0055ff" style={{ opacity: loading ? 0.5 : 1 }} />
          <h1 style={{ letterSpacing: '6px', fontWeight: '900', fontSize: '18px' }}>VORTEX CORE</h1>
        </div>
        <div style={{ fontSize: '10px', color: '#444' }}>STATUS: {loading ? 'SCANNING' : 'ONLINE'} // SYN: ACTIVE</div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <main style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {nodes.map((n, i) => (
            <div key={i} style={{ padding: '25px', background: '#05050a', border: '1px solid #111', borderRadius: '12px', borderLeft: '3px solid #0055ff' }}>
              <div style={{ color: '#0055ff', fontSize: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Activity size={12} /> NEURAL_LINK_{i+1}
              </div>
              <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>{n.t}</h3>
              <p style={{ color: '#777', fontSize: '14px', lineHeight: '1.5' }}>{n.a}</p>
            </div>
          ))}
          {loading && <div style={{ color: '#0055ff' }}>Veri süzülüyor...</div>}
        </main>

        <aside style={{ width: '280px', borderLeft: '1px solid #111', background: '#010103', padding: '20px', overflowY: 'auto' }}>
          <div style={{ color: '#222', fontSize: '10px', marginBottom: '15px' }}>TERMINAL_LOGS</div>
          {logs.map((l, i) => (
            <div key={i} style={{ color: l.c, marginBottom: '8px', fontSize: '12px' }}>{'>'} {l.t}</div>
          ))}
          <div ref={chatEnd} />
        </aside>
      </div>
    </div>
  );
}
