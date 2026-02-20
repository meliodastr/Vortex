import React, { useState, useEffect, useRef } from 'react';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { MessageSquare, Send, Cpu, Zap, ShieldCheck } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function App() {
  const [chat, setChat] = useState([{ role: 'ai', text: 'VORTEX Çift Çekirdek (3.1 Pro & 2 Flash) aktif. Sinan, komutlarını bekliyorum.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeModel, setActiveModel] = useState('3.1 Pro'); // Hangi modelin cevap verdiğini izlemek için
  const chatEnd = useRef(null);

  const google = createGoogleGenerativeAI({ apiKey: API_KEY });

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input || loading) return;

    const userMsg = input;
    setChat(p => [...p, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // 1. DENEME: Gemini 3.1 Pro (Ana Hat)
      try {
        const { text } = await generateText({
          model: google('gemini-3.1-pro-preview'),
          prompt: userMsg,
          system: "Sen VORTEX'sin. Sinan'a asistanlık yapan fütüristik bir yapay zekasın.",
        });
        setChat(p => [...p, { role: 'ai', text }]);
        setActiveModel('3.1 Pro');
      } catch (err) {
        // 2. DENEME: Gemini 2 Flash (Yedek Hat - 3.1 Pro hata verirse burası çalışır)
        console.warn("Ana hat koptu, Gemini 2 Flash'a geçiliyor...");
        const { text } = await generateText({
          model: google('gemini-2.0-flash'),
          prompt: userMsg,
          system: "Sen VORTEX'sin. Ana hat (3.1) koptuğu için yedek hattan (2.0 Flash) cevap veriyorsun.",
        });
        setChat(p => [...p, { role: 'ai', text: `(Yedek Hat) ${text}` }]);
        setActiveModel('2 Flash');
      }
    } catch (finalError) {
      setChat(p => [...p, { role: 'ai', text: "KRİTİK HATA: İki hat da sinyal alamıyor. API Key kontrolü gerekli." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat]);

  return (
    <div style={{ background: '#020205', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' }}>
      <header style={{ height: '60px', borderBottom: '1px solid #111', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', background: '#000' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cpu size={20} color="#0055ff" />
          <h1 style={{ letterSpacing: '3px' }}>VORTEX CORE v3.1</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '10px' }}>
          <div style={{ color: activeModel === '3.1 Pro' ? '#00ff00' : '#444' }}>● 3.1 PRO</div>
          <div style={{ color: activeModel === '2 Flash' ? '#00ff00' : '#444' }}>● 2 FLASH</div>
          <ShieldCheck size={14} color="#0055ff" title="Failover Protection Active" />
        </div>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {chat.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <div style={{ padding: '12px', borderRadius: '8px', background: m.role === 'user' ? '#0055ff' : '#0a0a15', border: '1px solid #111', fontSize: '14px' }}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={chatEnd} />
      </div>

      <form onSubmit={handleChat} style={{ padding: '20px', borderTop: '1px solid #111', display: 'flex', gap: '10px' }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Merkeze mesaj gönder..." style={{ flex: 1, background: '#000', border: '1px solid #222', color: '#fff', padding: '12px', outline: 'none' }} />
        <button disabled={loading} style={{ background: '#0055ff', border: 'none', padding: '0 20px', cursor: 'pointer' }}>
          {loading ? <Zap size={18} className="animate-pulse" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}
