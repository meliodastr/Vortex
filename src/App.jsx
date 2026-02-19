import React, { useState, useEffect } from 'react';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Radar, Terminal, Activity, Zap } from 'lucide-react';

// API ANAHTARI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState("VORTEX_v10: Beklemede...");

  // Google AI Sağlayıcısını Yapılandır
  const google = createGoogleGenerativeAI({
    apiKey: API_KEY,
  });

  const fetchVortex = async () => {
    if (!API_KEY) {
      setLog("HATA: VITE_GEMINI_API_KEY bulunamadı!");
      return;
    }
    
    setLoading(true);
    setLog("Sinyal taranıyor...");

    try {
      const { text } = await generateText({
        model: google('gemini-1.5-flash'),
        prompt: 'Dünya gündeminden 5 teknoloji haberi seç. Sadece şu formatta JSON döndür: [{"title": "Başlık", "desc": "Analiz"}]',
      });

      // Gelen metni JSON'a çevir
      const cleanJson = JSON.parse(text.match(/\[.*\]/s)[0]);
      setNodes(cleanJson);
      setLog("Sinyal stabilize edildi.");
    } catch (e) {
      console.error(e);
      setLog(`Sinyal Kesintisi: ${e.message.substring(0, 30)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVortex(); }, []);

  return (
    <div style={{ background: '#000', color: '#fff', height: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px 40px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Radar color="#0055ff" className={loading ? 'animate-pulse' : ''} />
          <h1 style={{ letterSpacing: '5px', fontSize: '20px' }}>VORTEX SDK</h1>
        </div>
        <div style={{ fontSize: '10px', color: '#444' }}>{log}</div>
      </header>

      <main style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ padding: '20px', border: '1px solid #111', borderRadius: '12px', background: '#050505' }}>
            <div style={{ color: '#0055ff', fontSize: '10px', marginBottom: '10px' }}> <Zap size={10} /> LIVE_FEED</div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{n.title}</h3>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>{n.desc}</p>
          </div>
        ))}
        {loading && <div style={{ color: '#0055ff' }}>Veri süzülüyor...</div>}
      </main>
    </div>
  );
}
