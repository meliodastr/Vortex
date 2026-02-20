import React, { useState, useEffect, useRef } from 'react';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Radar, Activity, MessageSquare, BarChart3, Send, Cpu } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [analysis, setAnalysis] = useState([]);
  const [chat, setChat] = useState([{ role: 'ai', text: 'VORTEX 3.1 Çekirdek bağlantısı aktif. Analiz ve sohbet modülleri hazır.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([{ t: "Sinyal Stabil: Gemini 3.1 Pro Online.", c: "#00ff00" }]);
  const chatEnd = useRef(null);

  const google = createGoogleGenerativeAI({ apiKey: API_KEY });

  // ANALİZ MODÜLÜ: Otomatik haber/veri çekme
  const fetchAnalysis = async () => {
    try {
      const { text } = await generateText({
        model: google('gemini-3.1-pro-preview'),
        prompt: 'Teknoloji dünyasından 3 kritik madde. JSON: [{"t": "Başlık", "a": "Analiz"}]',
      });
      const match = text.match(/\[.*\]/s);
      if (match) setAnalysis(JSON.parse(match[0]));
    } catch (e) { console.error(e); }
  };

  // SOHBET MODÜLÜ: Seninle konuşan AI
  const handleChat = async (e) => {
    e.preventDefault();
    if (!input || loading) return;

    const userMsg = input;
    setChat(p => [...p, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const { text } = await generateText({
        model: google('gemini-3.1-pro-preview'),
        prompt: userMsg,
      });
      setChat(p => [...p, { role: 'ai', text }]);
    } catch (e) {
      setChat(p => [...p, { role: 'ai', text: 'Sinyal kesintisi: ' + e.message }]);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAnalysis(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat]);

  return (
    <div style={{ background: '#020205', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' }}>
      {/* HEADER */}
      <header style={{ height: '60px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', padding: '0 25px', justifyContent: 'space-between', background: '#000' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Cpu size={20} color="#0055ff" />
          <h1 style={{ letterSpacing: '4px', fontWeight: '900' }}>VORTEX 3.1</h1>
        </div>
        <div style={{ fontSize: '10px', color: '#444' }}>MODEL: GEMINI 3.1 PRO // OP: SYN</div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* SOL: ANALİZ PENCERESİ */}
        <section style={{ flex: 1, borderRight: '1px solid #111', padding: '20px', overflowY: 'auto' }}>
          <div style={{ color: '#0055ff', fontSize: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} /> CANLI VERİ ANALİZİ
          </div>
          {analysis.map((n, i) => (
            <div key={i} style={{ padding: '15px', background: '#05050a', border: '1px solid #111', borderRadius: '8px', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '15px', color: '#00ff00', marginBottom: '8px' }}>{n.t}</h3>
              <p style={{ color: '#888', fontSize: '13px' }}>{n.a}</p>
            </div>
          ))}
        </section>

        {/* SAĞ: SOHBET PENCERESİ */}
        <section style={{ width: '450px', display: 'flex', flexDirection: 'column', background: '#010103' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #111', color: '#0055ff', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={16} /> CORE_COMMUNICATIONS
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {chat.map((m, i) => (
              <div key={i} style={{ marginBottom: '15px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                <div style={{ fontSize: '10px', color: '#333', marginBottom: '4px' }}>{m.role.toUpperCase()}</div>
                <div style={{ display: 'inline-block', padding: '10px', borderRadius: '8px', background: m.role === 'user' ? '#0055ff' : '#0a0a10', maxWidth: '85%', fontSize: '13px', border: m.role === 'ai' ? '1px solid #111' : 'none' }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
          <form onSubmit={handleChat} style={{ padding: '15px', borderTop: '1px solid #111', display: 'flex', gap: '10px' }}>
            <input 
              value={input} onChange={e => setInput(e.target.value)}
              placeholder="Sinyal gönder..." 
              style={{ flex: 1, background: '#000', border: '1px solid #222', color: '#fff', padding: '10px', outline: 'none', fontSize: '13px' }}
            />
            <button disabled={loading} style={{ background: '#0055ff', border: 'none', color: '#fff', padding: '10px 15px', cursor: 'pointer' }}>
              <Send size={16} />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
