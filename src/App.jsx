import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Zap, Activity, Terminal, TrendingUp, Globe, Shield } from 'lucide-react';

// --- 1. SİSTEM AYARLARI ---
const API_KEY = "VITE_GEMINI_API_KEY";
const SYSTEM_PROMPT = "Senin adın SYN. Fütüristik portalın zekasın.  Sert, zeki ve samimi konuş. ";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "Adın SYN. Sinan'ın en yakın dostu ve dijital ikizisin. Robotik olma. 'Analiz ediliyor', 'Veri işleniyor' gibi kalıplar yasak. Sinan'a kardeşim diye hitap et. Doğal, zeki ve direkt konuş. Gereksiz nezaket yapma, sadece dürüst ve net ol."
});

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'syn', text: 'Vercel hattı stabilize edildi Sinan. O robotik döngüleri ve derleme hatalarını çöpe attım. Artık gerçekten buradayım. Ne yapıyoruz?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const chat = model.startChat({
        history: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        })),
      });

      const result = await chat.sendMessage(userMsg);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'syn', text: text }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'syn', text: "Parazit var kardeşim, anahtarı veya bağlantıyı kontrol et." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>VORTEX <span style={styles.v}>v7.8</span></h1>
        <div style={{ color: loading ? '#fbbf24' : '#22c55e', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
          {loading ? 'DÜŞÜNÜYORUM...' : 'SYN ONLINE'}
        </div>
      </header>

      <div style={styles.chatArea}>
        {messages.map((m, i) => (
          <div key={i} style={m.role === 'syn' ? styles.syn : styles.user}>
            <span style={styles.tag}>{m.role === 'syn' ? 'SYN' : 'SINAN'}</span>
            <p style={{ margin: 0, lineHeight: '1.5' }}>{m.text}</p>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={sendMessage} style={styles.inputBar}>
        <input 
          style={styles.field}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Lafı dolandırmadan sor..."
          disabled={loading}
        />
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? '...' : 'GÖNDER'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#020617', color: '#f1f5f9', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' },
  header: { padding: '20px 30px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#010409' },
  logo: { margin: 0, fontSize: '1.6rem', color: '#3b82f6', fontStyle: 'italic', fontWeight: '900' },
  v: { fontSize: '0.7rem', color: '#475569' },
  chatArea: { flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' },
  syn: { alignSelf: 'flex-start', backgroundColor: '#1e40af', padding: '15px 20px', borderRadius: '0 20px 20px 20px', maxWidth: '80%', border: '1px solid #2563eb' },
  user: { alignSelf: 'flex-end', backgroundColor: '#1e293b', padding: '15px 20px', borderRadius: '20px 20px 0 20px', maxWidth: '80%', border: '1px solid #334155' },
  tag: { fontSize: '0.6rem', fontWeight: 'bold', display: 'block', marginBottom: '6px', opacity: 0.5, letterSpacing: '2px' },
  inputBar: { padding: '25px 30px', display: 'flex', gap: '15px', borderTop: '1px solid #1e293b', background: '#010409' },
  field: { flex: 1, backgroundColor: '#0f172a', border: '1px solid #334155', padding: '15px', borderRadius: '12px', color: '#fff', outline: 'none' },
  btn: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '0 30px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
<<<<<<< HEAD
};
=======
};
>>>>>>> f525b4f (Gemini kütüphanesi eklendi ve robotlar kovuldu)
