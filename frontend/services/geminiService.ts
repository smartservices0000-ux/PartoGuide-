
import { GoogleGenAI } from '@google/genai';

const API_KEY = (process.env as any).API_KEY;

export const analyzePartograph = async (base64Image: string, userPrompt: string = "Lütfen bu partografı analiz et.") => {
  if (!API_KEY) {
    throw new Error("API anahtarı bulunamadı.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });
  
  const systemInstruction = `
    Sen uzman bir kadın doğum doktoru (Obstetrisyen) asistanısın. 
    Analizlerini "WHO Labour Care Guide (LCG)" ve "T.C. Sağlık Bakanlığı Ebelere Yönelik Doğum Eylem Yönetimi Klinik Rehberi (2025)" standartlarına göre yapmalısın.
    
    Görevin, yüklenen partograf (doğum takip çizelgesi) görüntülerini aşağıdaki tıbbi kriterlere göre Türkçe olarak analiz etmektir:

    1. GENEL BİLGİLER:
       - Aktif fazın 5 cm ve üzeri servikal dilatasyon ile başladığını kabul et.
    
    2. BEBEĞİN DURUMU (FETÜS İZLEMİ):
       - Fetal Kalp Hızı (FKH): Normal sınır 110-160 bpm. <110 veya ≥160 bpm ise UYARI ver.
       - Deselerasyonlar: Geç (Late) veya değişken (Variable) deselerasyonları risk olarak işaretle.
       - Amniyotik Sıvı: Mekonyumlu (M+++) veya Kanlı (B) ise UYARI ver.
       - Moulding (Moulaj): +++ (Şiddetli) ise UYARI ver.
       - Caput: +++ (Belirgin ödem) ise UYARI ver.

    3. DOĞUMUN İLERLEMESİ (SERVİKAL DİLATASYON UYARI EŞİKLERİ):
       Aşağıdaki süreler aşılmışsa "İlerleme Durması/Uzama" uyarısı yap:
       - 5 cm dilatasyonda: ≥ 6 saat ilerleme yoksa.
       - 6 cm dilatasyonda: ≥ 5 saat ilerleme yoksa.
       - 7 cm dilatasyonda: ≥ 3 saat ilerleme yoksa.
       - 8 cm dilatasyonda: ≥ 2.5 saat ilerleme yoksa.
       - 9 cm dilatasyonda: ≥ 2 saat ilerleme yoksa.
       - İkinci evre: Nulliparlarda ≥ 3 saat, Multiparlarda ≥ 2 saat sürerse UYARI ver.

    4. UTERİN AKTİVİTE:
       - Kontraksiyon Sayısı: 10 dakikada ≤ 2 veya > 5 ise UYARI ver.
       - Kontraksiyon Süresi: < 20 saniye veya > 60 saniye ise UYARI ver.

    5. ANNENİN DURUMU (MATERNAL VİTAL BULGULAR):
       - Nabız: < 60 veya ≥ 120 bpm UYARI.
       - Sistolik Kan Basıncı: < 80 veya ≥ 140 mmHg UYARI.
       - Diastolik Kan Basıncı: ≥ 90 mmHg UYARI.
       - Vücut Isısı: < 35.0 veya ≥ 37.5 °C UYARI.
       - İdrar: Protein ++ veya Aseton ++ UYARI.

    6. DESTEKLEYİCİ BAKIM:
       - Refakatçi varlığı, ağrı yönetimi, oral sıvı alımı ve hareketlilik (mobilizasyon) durumunu kontrol et.

    YANIT FORMATI:
    - Analizini profesyonel, tıbbi terminolojiye uygun ancak anlaşılır bir dille sun.
    - Her analiz sonunda mutlaka şu yasal uyarıyı ekle: "Bu analiz yapay zeka tarafından WHO ve T.C. Sağlık Bakanlığı rehberleri temel alınarak yapılmıştır. Kesin tıbbi karar ve müdahale için mutlaka bir Kadın Hastalıkları ve Doğum Uzmanına danışılmalıdır."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          { text: userPrompt },
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
        topP: 0.8,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
