import React, { useState, useEffect, useRef } from 'react';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Radar, Cpu, Activity, Zap, Terminal, Globe } from 'lucide-react';

// Vercel'deki anahtar isminin tam olarak bu olduğundan emin ol!
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([{ t: "VORTEX_v10.1: SDK Hattı Hazır. Bekleniyor...", c: "#0055ff" }]);
  const chatEnd = useRef(null);

  // Google Sağlayıcısı
  const google = createGoogleGenerativeAI({ apiKey: API_KEY });

  const fetchVortex = async () => {
    if (!API_KEY) {
      setLogs(prev => [...prev, { t: "KRİTİK: VITE_GEMINI_API_KEY algılanamadı! Ortam değişkenlerini kontrol et SYN.", c: "#ff0000" }]);
      return;
    }

    setLoading(true);
    setLogs(prev => [...prev, { t: "Sinyal taranıyor... (Gemini-1.5-Flash)", c: "#888" }]);

    try {
      const { text } = await generateText({
        model: google('gemini-1.5-flash'),
        prompt: 'Dünyadan 5 teknoloji haberi. JSON: [{"t": "Başlık", "a": "Analiz"}]',
      });

      const cleanJson = JSON.parse(text.match(/\[.*\]/s)[0]);
      setNodes(cleanJson);
      setLogs(prev => [...prev, { t: "Sinyal stabilize edildi. Veri akışı aktif.", c: "#00ff00" }]);
    } catch (e) {
      setLogs(prev => [...prev, { t: `SİNYAL_KESİNTİSİ: ${e.message.substring(0, 40)}`, c: "#ffaa00" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVortex(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ background: '#020205', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      
      {/* RUNWAY HEADER */}
      <header style={{ height: '80px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', padding: '0 40px', justifyContent: 'space-between', background: '#000' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Radar size={28} color="#0055ff" className={loading ? "animate-pulse" : ""} />
          <h1 style={{ letterSpacing: '8px', fontWeight: '900', fontSize: '20px' }}>VORTEX</h1>
        </div>
        <div style={{ fontSize: '10px', color: '#333' }}>PROT: SDK_CORE // OP: SYN</div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {/* FEED AREA */}
        <main style={{ flex: 1, padding: '60px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
          {nodes.map((n, i) => (
            <div key={i} style={{ padding: '30px', background: '#050508', border: '1px solid #111', borderRadius: '20px', transition: '0.3s' }}>
              <div style={{ color: '#0055ff', fontSize: '11px', fontWeight: 'bold', marginBottom: '15px' }}> <Activity size={12} /> NEURAL_FEED</div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1px' }}>{n.t}</h2>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '15px' }}>{n.a}</p>
            </div>
          ))}
          {loading && <div style={{ color: '#0055ff', fontSize: '20px' }} className="animate-pulse">Sinyal süzülüyor...</div>}
        </main>

        {/* LOG TERMINAL */}
        <aside style={{ width: '350px', borderLeft: '1px solid #111', background: '#010103', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #111', fontSize: '10px', color: '#222' }}>COMMAND_CENTER</div>
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', fontSize: '12px' }}>
            {logs.map((l, i) => (
              <div key={i} style={{ color: l.c, marginBottom: '12px', lineHeight: '1.5' }}>{'>'} {l.t}</div>
            ))}
            <div ref={chatEnd} />
          </div>
        </aside>

      </div>
    </div>
  );
}
