// src/App.jsx
import React, { useState, useMemo } from 'react';
import { Wand2, Zap, BarChart3, Copy, Trash2, Shield, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getSifterLogic } from './lib/ai/providers';

function App() {
  const [inputData, setInputData] = useState('');
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [currentConfig, setCurrentConfig] = useState({ label: 'Hazır', color: '#6b7280' });

  // Süzme İşlemi
  const handleVortexSift = () => {
    if (!inputData) return;
    const config = getSifterLogic(prompt);
    const matches = inputData.match(config.reg) || [];
    const uniqueMatches = [...new Set(matches)];
    
    setResults(uniqueMatches);
    setCurrentConfig(config);
  };

  // Grafik Verisi Hesaplama
  const chartData = useMemo(() => [
    { name: currentConfig.label, value: results.length },
    { name: 'Kalan Veri', value: Math.max(0, inputData.split(/\s+/).length - results.length) }
  ], [results, inputData, currentConfig]);

  const copyResults = () => {
    navigator.clipboard.writeText(results.join('\n'));
    alert('Vortex: Sonuçlar panoya kopyalandı!');
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#fafafa] p-4 lg:p-10 font-sans selection:bg-purple-500/40">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter bg-gradient-to-t from-gray-500 to-white bg-clip-text text-transparent">
            VORTEX
          </h1>
          <p className="text-[10px] font-mono text-purple-500 uppercase tracking-[0.3em] flex items-center gap-2 mt-2">
            <Activity size={12} /> Neural Sifting Station v2.0
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold">
            <Shield size={14} className="text-green-500" /> LOCAL ENGINE: OK
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Kontrol Merkezi (Sol) */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem] shadow-2xl">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap size={14} className="text-yellow-500" /> Command Input
            </h2>
            <div className="relative group">
              <input 
                className="w-full bg-[#111] border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-purple-500 transition-all text-lg placeholder:text-gray-800"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Örn: 'E-postaları ayıkla'..."
              />
              <button 
                onClick={handleVortexSift}
                className="absolute right-3 top-3 bg-white text-black p-3 rounded-xl hover:bg-purple-500 hover:text-white transition-all active:scale-90"
              >
                <Wand2 size={24} />
              </button>
            </div>
          </section>

          <section className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem]">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Raw Data Pool</h2>
            <textarea 
              className="w-full h-72 bg-transparent border border-white/5 rounded-2xl p-6 text-sm font-mono outline-none focus:border-white/20 resize-none scrollbar-hide"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="Analiz edilecek metni buraya dökün..."
            />
          </section>
        </div>

        {/* Analiz & Sonuçlar (Sağ) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2rem] h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={chartData} 
                    innerRadius={55} 
                    outerRadius={75} 
                    dataKey="value" 
                    stroke="none"
                  >
                    <Cell fill={currentConfig.color} />
                    <Cell fill="#1a1a1a" />
                  </Pie>
                  <Tooltip contentStyle={{background: '#000', border: 'none', borderRadius: '12px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gradient-to-br from-purple-900/10 to-transparent border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center">
              <div className="text-7xl font-black text-white mb-2">{results.length}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-purple-500">
                {currentConfig.label} Yakalandı
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <BarChart3 size={14} /> Output Stream
              </h3>
              <div className="flex gap-2">
                <button onClick={copyResults} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                  <Copy size={18} />
                </button>
                <button onClick={() => setResults([])} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="h-80 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {results.length > 0 ? results.map((res, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/5 p-4 rounded-xl font-mono text-sm hover:border-purple-500/30 transition-all">
                  <span className="text-purple-400 mr-2 opacity-50">#{(i+1).toString().padStart(2, '0')}</span>
                  {res}
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-sm">
                  Komut bekleniyor...
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
