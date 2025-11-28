import { GoogleGenAI } from "@google/genai";
import { NewsResponse, NewsItem, GroundingMetadata } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const fetchCryptoNews = async (): Promise<NewsResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const prompt = `
    Find the latest and most important cryptocurrency news for today, ${today}.
    I need you to act as a news aggregator. 
    Identify the top 6 most significant stories happening right now in the crypto world.
    
    CRITICAL: You MUST output the stories in a specific format so I can parse them programmatically.
    Use the separator "|||" between each story.
    
    For each story, follow this pattern strictly:
    TITLE: [Insert Headline Here]
    TAG: [Bitcoin, Ethereum, Regulation, DeFi, or NFT]
    SENTIMENT: [Positive, Negative, or Neutral]
    SUMMARY: [Write a concise 2-3 sentence summary of the event.]
    
    Do not add any preamble or conclusion text outside of this format. Just the list of stories separated by |||.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as GroundingMetadata | undefined;

    // Parse the structured text
    const rawItems = text.split('|||').map(item => item.trim()).filter(item => item.length > 0);
    
    const items: NewsItem[] = rawItems.map((rawItem, index) => {
      const titleMatch = rawItem.match(/TITLE:\s*(.+)/);
      const tagMatch = rawItem.match(/TAG:\s*(.+)/);
      const sentimentMatch = rawItem.match(/SENTIMENT:\s*(.+)/);
      const summaryMatch = rawItem.match(/SUMMARY:\s*(.+)/s); // s flag for dotAll usually, but JS uses [\s\S] or logic

      // Simple extraction fallback
      const title = titleMatch ? titleMatch[1].trim() : 'Crypto Update';
      const tag = tagMatch ? tagMatch[1].trim() : 'General';
      let sentiment = (sentimentMatch ? sentimentMatch[1].trim() : 'Neutral') as 'Positive' | 'Negative' | 'Neutral';
      
      // Normalize sentiment
      if (!['Positive', 'Negative', 'Neutral'].includes(sentiment)) {
          if (sentiment.toLowerCase().includes('positive')) sentiment = 'Positive';
          else if (sentiment.toLowerCase().includes('negative')) sentiment = 'Negative';
          else sentiment = 'Neutral';
      }

      // Summary extraction might be multi-line
      let summary = '';
      if (summaryMatch) {
         summary = summaryMatch[1].trim();
      } else {
         // Fallback if regex fails, just take the part after SUMMARY:
         const parts = rawItem.split('SUMMARY:');
         if (parts.length > 1) summary = parts[1].trim();
      }

      return {
        id: `news-${index}-${Date.now()}`,
        title,
        tag,
        sentiment,
        summary,
        // We pass the global grounding metadata to each item so we can resolve citations if they appear in the text
        groundingMetadata 
      };
    });

    return {
      items,
      rawContent: text,
      groundingMetadata
    };

  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
};
