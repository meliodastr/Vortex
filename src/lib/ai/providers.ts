import { VORTEX_PROMPTS } from './prompts';

export const getSifterLogic = (userPrompt: string) => {
  const p = userPrompt.toLowerCase();
  
  if (VORTEX_PROMPTS.EMAIL.some(k => p.includes(k))) {
    return { reg: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, label: 'E-posta', color: '#8b5cf6' };
  }
  if (VORTEX_PROMPTS.PHONE.some(k => p.includes(k))) {
    return { reg: /\+?\d{10,12}/g, label: 'Telefon', color: '#ec4899' };
  }
  if (VORTEX_PROMPTS.URL.some(k => p.includes(k))) {
    return { reg: /https?:\/\/[^\s]+/g, label: 'Linkler', color: '#3b82f6' };
  }
  if (VORTEX_PROMPTS.IP.some(k => p.includes(k))) {
    return { reg: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, label: 'IP', color: '#10b981' };
  }
  if (VORTEX_PROMPTS.ERROR.some(k => p.includes(k))) {
    return { reg: /(ERROR|FAILED|CRITICAL|500|404):?\s.+/gi, label: 'Hatalar', color: '#ef4444' };
  }
  
  return { reg: /.*/g, label: 'Genel Veri', color: '#6b7280' };
};
