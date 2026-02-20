import { createGoogleGenerativeAI } from '@ai-sdk/google';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export const googleProvider = createGoogleGenerativeAI({
  apiKey: API_KEY,
});

export const vortexModel = googleProvider('gemini-1.5-flash-latest');
