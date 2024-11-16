// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getDestinationInfo(location: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `${location} şehri hakkında turizmle ilgili aşağıdaki bilgileri Türkçe olarak ver:

  1. Tarihçe ve Genel Bilgi (2-3 cümle)
  2. En İyi Ziyaret Zamanı (1 cümle)
  3. Önemli Turistik Yerler (en önemli 3 yer)
  4. Yerel Mutfak (2-3 önemli yemek)
  5. Ulaşım ve Konaklama Tavsiyeleri (2 madde)
  6. Önemli Festivaller veya Etkinlikler (varsa 1-2 tane)

  Lütfen yanıtı düzenli, maddeler halinde ve turistik açıdan ilgi çekici şekilde formatla.
  Her bilgiyi yeni paragrafta ver ve emoji kullan.
  Bilgileri kısa ve öz tut ama ilgi çekici detayları ekle.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return `${location} için şu anda detaylı bilgi sağlanamıyor. Lütfen daha sonra tekrar deneyin.`;
  }
}