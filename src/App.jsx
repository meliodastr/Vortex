import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Sinyal Hattı
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export default function App() {
  const [trends, setTrends] = useState([
    { name: "SİNYAL ARANIYOR", vid: "9bZkp7q19f0", opinion: "Vortex küresel veri yollarını kontrol ediyor. SYN yetkisi onaylandı..." }
  ]);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("Sistem Başlatılıyor...");

  // OTONOM GÜNCELLEME MOTORU (Sitenin Kalbi)
  const syncVortex = async () => {
    if (!API_KEY) {
      setStatus("HATA: VITE_ anahtarı bulunamadı.");
      return;
    }
    try {
      setStatus("Küresel trendler taranıyor...");
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Şu an dünyada teknolojiyi etkileyen en önemli 5 gelişmeyi bul. 
      Sadece bu formatta JSON döndür: [{"name": "BAŞLIK", "vid": "YOUTUBE_ID", "opinion": "YORUM"}]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().replace(/```json|```/g, "").trim();
      const data = JSON.parse(text);

      if (Array.isArray(data)) {
        setTrends(data);
        setStatus("Sistem Stabil. Her 10 dakikada bir güncelleniyor.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Sinyal paraziti oluştu. Yeniden deneniyor...");
    }
  };

  useEffect(() => {
    syncVortex();
    const timer = setInterval(syncVortex, 600000); // 10 Dakika döngüsü
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#020205', color: '#444', height: '100vh', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* HEADER: SİSTEM DURUMU */}
      <header style={{ padding: '15px 25px', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', background: '#0055ff', borderRadius: '50%', boxShadow: '0 0 10px #0055ff' }}></div>
          <b style={{ color: '#fff', fontSize: '14px', letterSpacing: '2px' }}>VORTEX_NEXUS // SYN</b>
        </div>
        <div style={{ fontSize: '9px', color: '#222', letterSpacing: '1px' }}>{status.toUpperCase()}</div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* SOL: OTONOM BAŞLIKLAR (AI TARAFINDAN DEĞİŞTİRİLEN) */}
        <nav style={{ width: '250px', borderRight: '1px solid #111', padding: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '8px', color: '#222', marginBottom: '10px' }}>GLOBAL_RADAR_NODES</span>
          {trends.map((t, i) => (
            <div 
              key={i} 
              onClick={() => setActive(i)} 
              style={{ 
                padding: '12px', fontSize: '10px', cursor: 'pointer', border: '1px solid #111', borderRadius: '4px',
                color: active === i ? '#fff' : '#333', 
                background: active === i ? '#0a0a0f' : 'transparent',
                borderLeft: active === i ? '3px solid #0055ff' : '1px solid #111',
                transition: '0.3s all'
              }}>
              {t.name}
            </div>
          ))}
        </nav>

        {/* ORTA: VİDEO VE RASYONEL ANALİZ */}
        <main style={{ flex: 1, position: 'relative', background: '#000' }}>
          <iframe 
            src={`https://www.youtube.com/embed/${trends[active]?.vid}?autoplay=1&mute=1&controls=0&modestbranding=1`} 
            style={{ width: '100%', height: '100%', border: 'none', opacity: 0.15 }}
          />
          <div style={{ position: 'absolute', bottom: '40px', left: '40px', right: '40px', background: 'rgba(0,0,0,0.85)', padding: '30px', border: '1px solid #111', backdropFilter: 'blur(10px)' }}>
            <div style={{ color: '#0055ff', fontSize: '9px', fontWeight: 'bold', marginBottom: '8px' }}>RASYONEL_ANALIZ_V0.1</div>
            <h1 style={{ color: '#fff', fontSize: '18px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>{trends[active]?.name}</h1>
            <p style={{ color: '#888', fontSize: '11px', lineHeight: '1.6', fontStyle: 'italic' }}>"{trends[active]?.opinion}"</p>
          </div>
        </main>

        {/* SAĞ: OPERATÖR TERMİNALİ */}
        <aside style={{ width: '280px', borderLeft: '1px solid #111', background: '#010103', display: 'flex', flexDirection: 'column', padding: '20px' }}>
           <div style={{ fontSize: '9px', color: '#111', borderBottom: '1px solid #111', paddingBottom: '10px', marginBottom: '15px' }}>AUTH_ID: SYN_OP_V0</div>
           <div style={{ flex: 1, color: '#0055ff', fontSize: '10px', lineHeight: '1.5' }}>
              {`> SİSTEM ÇALIŞIYOR... \n> KÜRESEL VERİ AKIŞI AKTİF. \n> HER 10 DAKİKADA BİR GEMİNİ ÜST AKLI KONULARI GÜNCELLEYECEK. \n\n> VORTEX: "Sıradan olanı değil, rasyonel olanı ara SYN."`}
           </div>
           <div style={{ borderTop: '1px solid #111', paddingTop: '10px', fontSize: '8px', color: API_KEY ? '#00ff00' : '#ff0000', opacity: 0.3 }}>
             SIGNAL_{API_KEY ? 'STABLE' : 'LOST'}
           </div>
        </aside>
      </div>

    </div>
  );
}
