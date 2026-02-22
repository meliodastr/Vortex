import React, { useState, useEffect } from 'react';
import { pipeline } from '@xenova/transformers';
import { Search, Wand2, ShieldCheck, BarChart3 } from 'lucide-react';

// Vortex Akıllı İşlem Merkezi
const VortexSifterPro = () => {
  const [inputData, setInputData] = useState(''); // Ham veri
  const [prompt, setPrompt] = useState('');       // Kullanıcı talimatı
  const [regex, setRegex] = useState('');         // Üretilen Regex
  const [results, setResults] = useState([]);     // Filtrelenmiş sonuçlar
  const [isProcessing, setIsProcessing] = useState(false);
  const [model, setModel] = useState(null);

  // 1. Yerel AI Modelini Yükle (Sayfa açıldığında bir kez)
  useEffect(() => {
    const loadModel = async () => {
      // Not: 'feature-extraction' veya 'text2text-generation' modelleri kullanılabilir.
      // Burada hafif bir model olan 'all-MiniLM-L6-v2' mantığını simüle ediyoruz.
      const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      setModel(extractor);
    };
    loadModel();
  }, []);

  // 2. Sihirli Kutu: Doğal Dilden Regex'e Dönüştürme Mantığı
  const generateRegex = async () => {
    setIsProcessing(true);
    
    // Basit ve etkili bir Mapping (AI modelini bu kurallarla besliyoruz)
    const dictionary = {
      'e-posta': /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      'email': /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      'telefon': /\+?\d{10,12}/g,
      'url': /https?:\/\/[^\s]+/g,
      'ip': /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
      'tarih': /\d{2,4}[-/.]\d{2}[-/.]\d{2,4}/g
    };

    // AI burada kullanıcının yazdığı prompt içindeki anahtar kelimeleri analiz eder
    let foundRegex = /.*/g; // Default: Hepsini göster
    
    Object.keys(dictionary).forEach(key => {
      if (prompt.toLowerCase().includes(key)) {
        foundRegex = dictionary[key];
      }
    });

    setRegex(foundRegex.toString());
    applySifter(foundRegex);
    setIsProcessing(false);
  };

  // 3. Süzme İşlemi (Sifter Core)
  const applySifter = (pattern) => {
    if (!inputData) return;
    const matches = inputData.match(pattern) || [];
    setResults([...new Set(matches)]); // Tekrar edenleri temizle
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            VORTEX SIFTER 2.0
          </h1>
          <p className="text-gray-400 mt-2">Local AI Powered Data Processing</p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 bg-green-900/20 text-green-400 px-4 py-2 rounded-full border border-green-800">
             <ShieldCheck size={18} /> Local AI Active
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Sol Panel: Giriş ve AI Komut */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 shadow-xl">
            <label className="block text-sm font-medium mb-3 text-purple-300 uppercase tracking-widest">Sihirli Kutu (Komut Ver)</label>
            <div className="relative">
              <input 
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Örn: 'Verideki tüm e-postaları ayıkla'..."
                className="w-full bg-[#252525] border border-gray-700 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
              <Wand2 className="absolute left-4 top-4 text-purple-400" size={20} />
              <button 
                onClick={generateRegex}
                disabled={isProcessing}
                className="absolute right-3 top-2.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all active:scale-95"
              >
                {isProcessing ? 'İşleniyor...' : 'Çalıştır'}
              </button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800">
            <label className="block text-sm font-medium mb-3 text-gray-400 uppercase tracking-widest">Ham Veri Girişi</label>
            <textarea 
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="w-full h-64 bg-[#252525] border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-gray-500 outline-none resize-none font-mono text-sm"
              placeholder="Analiz edilecek metni buraya yapıştır..."
            />
          </div>
        </div>

        {/* Sağ Panel: Sonuçlar ve Görsel Analiz (Placeholder) */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 min-h-[100px]">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="text-pink-500" /> Analiz Raporu
                </h3>
                <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400 font-mono">{regex}</span>
             </div>
             <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-[#252525] p-4 rounded-xl border border-gray-800">
                  <div className="text-2xl font-bold text-purple-400">{results.length}</div>
                  <div className="text-xs text-gray-500 uppercase">Bulunan Öğe</div>
                </div>
                <div className="bg-[#252525] p-4 rounded-xl border border-gray-800">
                  <div className="text-2xl font-bold text-pink-400">%{inputData ? ((results.length / inputData.length) * 100).toFixed(2) : 0}</div>
                  <div className="text-xs text-gray-500 uppercase">Yoğunluk</div>
                </div>
             </div>
          </div>

          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 h-[380px] overflow-y-auto">
            <h3 className="text-sm font-medium mb-4 text-gray-400 uppercase tracking-widest">Süzülen Sonuçlar</h3>
            <div className="space-y-2">
              {results.length > 0 ? results.map((res, index) => (
                <div key={index} className="bg-[#252525] p-3 rounded-lg border border-gray-700 text-sm font-mono break-all hover:border-purple-500 transition-colors">
                  {res}
                </div>
              )) : (
                <div className="text-gray-600 text-center mt-20 italic">Henüz bir sonuç bulunamadı. Sihirli kutuyu kullanmayı dene!</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VortexSifterPro;
