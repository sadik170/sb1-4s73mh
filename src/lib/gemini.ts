import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getDestinationInfo(location: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `${location} hakkında aşağıdaki bilgileri Türkçe olarak ver:
  1. Kısa tarihçe (2-3 cümle)
  2. Ziyaret için en uygun zaman (1 cümle)
  3. Mutlaka görülmesi gereken 3 yer
  4. Denenmesi gereken 2-3 yerel yemek
  5. 2 önemli seyahat tavsiyesi
  
  Yanıtı kısa ve öz tut.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API hatası:', error);
    throw new Error('Destinasyon bilgileri alınamıyor');
  }
}