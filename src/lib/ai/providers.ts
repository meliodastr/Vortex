// src/lib/ai/providers.ts

export interface SifterResult {
  reg: RegExp;
  label: string;
  color: string;
}

export const getSifterLogic = (prompt: string): SifterResult => {
  const dictionary: Record<string, SifterResult> = {
    'e-posta': { reg: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, label: 'E-posta', color: '#8b5cf6' },
    'email': { reg: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, label: 'E-posta', color: '#8b5cf6' },
    'telefon': { reg: /\+?\d{10,12}/g, label: 'Telefon No', color: '#ec4899' },
    'url': { reg: /https?:\/\/[^\s]+/g, label: 'URL / Link', color: '#3b82f6' },
    'ip': { reg: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, label: 'IP Adresi', color: '#10b981' },
    'hata': { reg: /(ERROR|FAILED|CRITICAL|404|500):?\s.+/gi, label: 'Hata Mesajı', color: '#ef4444' }
  };

  // Basit anahtar kelime eşleme (İleride transformers.js ile derinleştirilecek)
  let active = { reg: /.*/g, label: 'Genel Veri', color: '#6b7280' };
  
  Object.keys(dictionary).forEach(key => {
    if (prompt.toLowerCase().includes(key)) {
      active = dictionary[key];
    }
  });
  
  return active;
};
