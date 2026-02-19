const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const fetchVortex = async (tabId) => {
  // SİNYAL KONTROLÜ
  if (!API_KEY) {
    setLogs(prev => [...prev, { r: 'ai', t: "DURUM: Anahtar Vercel hattına henüz ulaşmadı. Bekleniyor..." }]);
    return;
  }
  
  setLoading(true);
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // ... geri kalan fetch işlemleri
  } catch (e) {
    // ... hata yönetimi
  }
};
