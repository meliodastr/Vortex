import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [nodes, setNodes] = useState([{ name: "VORTEX_INITIALIZING", vid: "9bZkp7q19f0", opinion: "Sinyal taranıyor..." }]);
  const [current, setCurrent] = useState(0);
  const [logs, setLogs] = useState([{ r: "vortex", t: "Sistem aktif. SYN yetkisi bekleniyor." }]);

  // OTONOM VERİ ÇEKİCİ (Sitenin Amacı: Canlı Bilgi)
  const sync = async () => {
    if (!API_KEY) return;
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Geleceği etkileyecek 5 az popüler bilim/teknoloji konusu seç. Format: [{"name": "KONU", "vid": "YOUTUBE_ID", "opinion": "RASYONEL_YORUM"}]`;
      const res = await model.generateContent(prompt);
      const data = JSON.parse(res.response.text().replace(/```json|```/g, "").trim());
      setNodes(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { sync(); setInterval(sync, 600000); }, []);

  return (
    <div style={{ backgroundColor: '#000', color: '#555', height: '100vh', fontFamily: 'monospace', display: 'flex', overflow: 'hidden' }}>
      
      {/* SOL: RADAR LİSTESİ */}
      <div style={{ width: '250px', borderRight: '1px solid #111', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px', marginBottom: '20px' }}>VORTEX_RADAR</div>
        {nodes.map((n, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{ padding: '12px', fontSize: '10px', border: '1px solid #111', cursor: 'pointer', color: current === i ? '#fff' : '#444', background: current === i ? '#0a0a0a' : 'transparent', borderLeft: current === i ? '3px solid #0055ff' : '1px solid #111' }}>
            {n.name}
          </div>
        ))}
      </div>

      {/* ORTA: VERİ ANALİZİ (VİDEO VE YORUM) */}
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe src={`https://www.youtube.com/embed/${nodes[current]?.vid}?autoplay=1&mute=1&controls=0`} style={{ width: '100%', height: '100%', opacity: 0.15, border: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ maxWidth: '600px', background: 'rgba(0,0,0,0.8)', padding: '30px', border: '1px solid #111' }}>
            <span style={{ color: '#0055ff', fontSize: '10px' }}>ANALYSIS_RESULT_#{current}</span>
            <h1 style={{ color: '#fff', margin: '10px 0' }}>{nodes[current]?.name}</h1>
            <p style={{ color: '#888', fontSize: '12px', lineHeight: '1.6', fontStyle: 'italic' }}>"{nodes[current]?.opinion}"</p>
          </div>
        </div>
      </div>

      {/* SAĞ: SYN TERMİNAL */}
      <div style={{ width: '300px', borderLeft: '1px solid #111', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '10px', color: '#333', marginBottom: '10px' }}>OPERATOR: SYN</div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {logs.map((l, i) => (
            <div key={i} style={{ fontSize: '10px', marginBottom: '10px', color: l.r === 'vortex' ? '#0055ff' : '#fff' }}>
              <b>{l.r.toUpperCase()}:</b> {l.t}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #111', paddingTop: '10px', fontSize: '9px', color: API_KEY ? '#0f0' : '#f00' }}>
          SIGNAL_{API_KEY ? 'READY' : 'OFFLINE'}
        </div>
      </div>
    </div>
  );
}
