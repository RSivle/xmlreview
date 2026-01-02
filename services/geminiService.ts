
import { GoogleGenAI } from "@google/genai";

export const getAISummary = async (headline: string, story: string): Promise<string> => {
  // Always use this pattern for initialization as per @google/genai guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Summarize the following news item content into a concise, professional summary of about 3 sentences.
    
    HEADLINE: ${headline}
    STORY: ${story}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional news editor. Provide concise, factual summaries without editorial bias.",
        temperature: 0.7,
      },
    });

    // Use .text property directly (not a method)
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI summary. Please check your connection or try again later.";
  }
};
