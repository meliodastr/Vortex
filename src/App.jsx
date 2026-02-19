import React, { useState, useEffect, useRef } from 'react';
import { Radar, Cpu, Rocket, DollarSign, Send, Zap, BarChart3 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const CATEGORIES = [
  { id: 'ai', name: 'Artificial Intelligence', icon: <Cpu size={18}/>, color: 'from-blue-600', vid: '9bZkp7q19f0', text: 'SYN için rasyonel veri akışı stabilize edildi.' },
  { id: 'crypto', name: 'Crypto Assets', icon: <DollarSign size={18}/>, color: 'from-orange-600', vid: '0f-jL_mNn_A', text: 'Piyasa volatilitesi izleniyor.' },
  { id: 'space', name: 'Space Exploration', icon: <Rocket size={18}/>, color: 'from-purple-600', vid: 'GoW8Tf7h978', text: 'Yörünge verileri aktarılıyor.' }
];

export default function App() {
  const [active, setActive] = useState('ai');
  const [messages, setMessages] = useState([{ role: 'ai', text: "Vortex Nexus çevrimiçi. SYN protokolü hazır." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading || !API_KEY) return;
    const msg = input;
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Sen Vortex'sin. Kullanıcın SYN. Kısa ve rasyonel cevap ver: ${msg}`);
      setMessages(prev => [...prev, { role: 'ai', text: result.response.text() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sinyal hatası." }]);
    } finally { setLoading(false); }
  };

  const current = CATEGORIES.find(c => c.id === active) || CATEGORIES[0];

  return (
    <div style={{ backgroundColor: '#050508', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radar style={{ color: '#3b82f6' }} />
          <b style={{ letterSpacing: '2px' }}>VORTEX NEXUS</b>
        </div>
        <div style={{ fontSize: '10px', color: '#3b82f6', border: '1px solid #3b82f6', padding: '4px 10px', borderRadius: '20px' }}>SYN_AUTHORIZED</div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '20px', gap: '20px' }}>
        <nav style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)} style={{ padding: '15px', background: active === c.id ? '#1e3a8a' : '#111', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {c.icon} {c.name}
            </button>
          ))}
        </nav>

        <main style={{ flex: 1, background: '#000', borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
          <iframe src={`https://www.youtube.com/embed/${current.vid}?autoplay=1&mute=1&controls=0`} style={{ width: '100%', height: '100%', border: 'none', opacity: 0.4 }} />
          <div style={{ position: 'absolute', bottom: '30px', left: '30px', background: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '15px', borderLeft: '4px solid #3b82f6' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>{current.name}</h2>
            <p style={{ fontSize: '12px', color: '#aaa' }}>{current.text}</p>
          </div>
        </main>

        <aside style={{ width: '300px', background: '#0a0a0c', borderRadius: '20px', display: 'flex', flexDirection: 'column', border: '1px solid #111' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #111', fontSize: '10px', color: '#555' }}>TERMINAL_LOG_SYN</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '15px', fontSize: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: '15px', color: m.role === 'user' ? '#fff' : '#3b82f6' }}>
                <b>{m.role === 'user' ? '> SYN: ' : '> VRTX: '}</b>{m.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleChat} style={{ padding: '15px', borderTop: '1px solid #111' }}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Mesaj..." style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
          </form>
        </aside>
      </div>
    </div>
  );
}
