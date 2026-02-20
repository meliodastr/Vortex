import React, { useState, useEffect, useRef } from 'react';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Radar, Activity } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([{ t: "VORTEX_CORE: Sinyal Hattı Açıldı.", c: "#0055ff" }]);
  const chatEnd = useRef(null);

  const google = createGoogleGenerativeAI({ apiKey: API_KEY });

  const fetchVortex = async () => {
    if (!API_KEY) {
      setLogs(p => [...p, { t: "HATA: API Anahtarı Tanımsız!", c: "#ff0000" }]);
      return;
    }

    setLoading(true);
    setLogs(p => [...p, { t: "AI SDK 4 Protokolü Başlatılıyor...", c: "#888" }]);

    try {
      const { text } = await generateText({
        model: google('models/gemini-1.5-flash'), // Kesin yol
        prompt: 'Teknoloji dünyasından 5 kısa haber ver. JSON: [{"t": "Başlık", "a": "Analiz"}]',
      });

      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        setNodes(JSON.parse(jsonMatch[0]));
        setLogs(p => [...p, { t: "VORTEX: Gemini Bağlantısı Başarılı!", c: "#00ff00" }]);
      }
    } catch (e) {
      setLogs(p => [...p, { t: `SİNYAL HATASI: ${e.message.substring(0, 45)}`, c: "#ffaa00" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVortex(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ background: '#020205', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' }}>
      <header style={{ height: '70px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radar size={22} color="#0055ff" className={loading ? "animate-pulse" : ""} />
          <h1 style={{ letterSpacing: '5px', fontWeight: '900' }}>VORTEX CORE</h1>
        </div>
        <div style={{ fontSize: '10px', color: '#444' }}>STATUS: ONLINE // OP: SINAN</div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <main style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {nodes.map((n, i) => (
            <div key={i} style={{ padding: '20px', background: '#05050a', border: '1px solid #111', borderRadius: '10px', borderLeft: '3px solid #0055ff' }}>
              <div style={{ color: '#0055ff', fontSize: '10px', marginBottom: '10px' }}> <Activity size={12} /> NEURAL_FEED_{i+1}</div>
              <h3 style={{ fontSize: '17px', marginBottom: '10px' }}>{n.t}</h3>
              <p style={{ color: '#666', fontSize: '13px' }}>{n.a}</p>
            </div>
          ))}
          {loading && <div style={{ color: '#0055ff' }}>Sinyal çözülüyor...</div>}
        </main>
        <aside style={{ width: '280px', borderLeft: '1px solid #111', background: '#010103', padding: '15px', overflowY: 'auto' }}>
          {logs.map((l, i) => <div key={i} style={{ color: l.c, marginBottom: '8px', fontSize: '11px' }}>{'>'} {l.t}</div>)}
          <div ref={chatEnd} />
        </aside>
      </div>
    </div>
  );
}
