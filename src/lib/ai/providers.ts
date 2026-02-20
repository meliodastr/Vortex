import { google } from '@ai-sdk/google';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

// Gemini Model Sağlayıcısı
export const googleProvider = google;

// Vortex'in ana düşünce modeli
export const DEFAULT_CHAT_MODEL = 'gemini-1.5-pro-latest';

export function getModel(modelId: string) {
  // Eğer modelId 'gemini' ile başlıyorsa veya varsayılan model ise Gemini'yi döndür
  return google(modelId || DEFAULT_CHAT_MODEL);
}

// Başlık oluşturma için daha hızlı olan model
export function getTitleModel() {
  return google('gemini-1.5-flash-latest');
}
