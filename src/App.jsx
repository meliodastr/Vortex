import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Radar, Terminal, AlertTriangle, Search, Activity, Cpu } from 'lucide-react';

const API_KEY = import.meta.env.GEMINI_API_KEY || "";

export default function App() {
  const [logs, setLogs] = useState([{ t: "VORTEX_DIAGNOSTIC: Sistem otopsisi başlatıldı.", c: "#0055ff" }]);
  const [diagnosis, setDiagnosis] = useState("Sinyal taranıyor...");
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);

  const runDiagnostic = async () => {
    setLoading(true);
    setLogs(prev => [...prev, { t: "ADIM 1: API Anahtarı varlığı kontrol ediliyor...", c: "#888" }]);

    if (!API_KEY || API_KEY.length < 10) {
      setDiagnosis("HATA: API Anahtarı (VITE_GEMINI_API_KEY) Vercel'de bulunamadı veya çok kısa.");
      setLogs(prev => [...prev, { t: "KRİTİK: Anahtar eksik!", c: "#ff0000" }]);
      setLoading(false);
      return;
    }

    setLogs(prev => [...prev, { t: "ADIM 2: Google servislerine el sıkışma isteği gönderiliyor...", c: "#888" }]);
    
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      
      // TÜM MODELLERİ TEST ETME DÖNGÜSÜ
      const testModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
      let success = false;

      for (const modelName of testModels) {
        setLogs(prev => [...prev, { t: `DENE: ${modelName} test ediliyor...`, c: "#555" }]);
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent("test");
          if (result) {
            setDiagnosis(`BAŞARI: ${modelName} yanıt verdi! Sistem bu modelle çalışabilir.`);
            setLogs(prev => [...prev, { t: `BULUNDU: ${modelName} aktif!`, c: "#00ff00" }]);
            success = true;
            break;
          }
        } catch (err) {
          setLogs(prev => [...prev, { t: `${modelName} başarısız: ${err.message.substring(0, 40)}`, c: "#333" }]);
        }
      }

      if (!success) {
        throw new Error("Tüm modeller 404 veya 403 döndürdü.");
      }

    } catch (e) {
      console.error(e);
      let advice = "ÖNERİ: ";
      if (e.message.includes("404")) advice += "Model ismi uyumsuz. Google Cloud panelinden 'Generative Language API' etkin mi kontrol et.";
      if (e.message.includes("403")) advice += "API Anahtarı kısıtlanmış veya geçersiz. AI Studio'dan yeni bir anahtar al.";
      if (e.message.includes("429")) advice += "Kota doldu. Birkaç dakika bekle.";
      
      setDiagnosis(`TEŞHİS: ${e.message}`);
      setLogs(prev => [...prev, { t: advice, c: "#ffaa00" }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { runDiagnostic(); }, []);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs]);

  return (
    <div style={{ backgroundColor: '#020205', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'monospace' }}>
      
      <header style={{ padding: '20px 40px', borderBottom: '1px solid #222', background: '#000', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Radar color={loading ? "#00ff00" : "#0055ff"} className={loading ? "animate-pulse" : ""} />
          <h1 style={{ letterSpacing: '5px', fontWeight: '900', fontSize: '18px' }}>VORTEX_OtoTanı</h1>
        </div>
        <button onClick={runDiagnostic} style={{ background: '#0055ff', color: '#fff', border: 'none', padding: '5px 15px', cursor: 'pointer', borderRadius: '4px', fontSize: '10px' }}>YENİDEN TARA</button>
      </header>

      <main style={{ flex: 1, display: 'flex', padding: '40px', gap: '40px' }}>
        
        {/* SOL: TANILAMA EKRANI */}
        <div style={{ flex: 1, background: '#050508', border: '1px solid #111', borderRadius: '12px', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', color: '#ffaa00' }}>
            <AlertTriangle size={30} />
            <span style={{ fontWeight: 'bold', fontSize: '20px' }}>SİSTEM DURUMU</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: diagnosis.includes('BAŞARI') ? '#00ff00' : '#fff', lineHeight: '1.4' }}>
            {diagnosis}
          </div>
          <div style={{ marginTop: '40px', padding: '20px', background: '#000', borderRadius: '8px', border: '1px solid #222', color: '#666', fontSize: '13px' }}>
            <Search size={14} /> <b>Analiz:</b> Sistem şu an Google'ın API uç noktalarını tek tek deniyor. Eğer 404 alıyorsan, bu modelin senin bölgen veya anahtarın için henüz aktif olmadığını gösterir.
          </div>
        </div>

        {/* SAĞ: CANLI LOGLAR */}
        <aside style={{ width: '450px', background: '#000', border: '1px solid #111', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '15px', borderBottom: '1px solid #111', fontSize: '10px', color: '#333' }}>
            <Terminal size={14} /> RAW_DEBUG_STREAM
          </div>
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', fontSize: '12px' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ color: log.c, marginBottom: '8px' }}>
                <span style={{ opacity: 0.2 }}>[{i}]</span> {log.t}
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
        </aside>

      </main>

      <footer style={{ padding: '10px 40px', borderTop: '1px solid #111', fontSize: '9px', color: '#222', textAlign: 'center' }}>
        SYN_AUTHORITY_DEBUG_MODE_v8.0
      </footer>
    </div>
  );
}
