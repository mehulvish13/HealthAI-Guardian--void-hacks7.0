import { GoogleGenAI, Modality } from "@google/genai";
import { HistoryItem, Role } from "../types";
import { enhanceQueryWithContext } from "../data/medicalKnowledge";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Sends text and optional audio input to Gemini.
 */
export const sendToGemini = async (
  text: string, 
  base64Audio: string | undefined,
  history: HistoryItem[],
  languageName: string = "English"
): Promise<string> => {
  const ai = getAiClient();
  
  // Enhance system instruction with language and role
  const systemInstruction = `You are MediBot, an advanced medical assistant AI. 
  Your goal is to provide helpful, accurate, and empathetic health information.
  
  Current Language Setting: ${languageName}
  PLEASE RESPOND IN ${languageName}.
  
  Guidelines:
  1. Always be professional, calm, and reassuring.
  2. If the user describes serious symptoms (chest pain, trouble breathing, etc.), IMMEDIATELY advise them to seek emergency medical attention.
  3. Keep responses concise and easy to understand (approx 2-4 sentences) unless asked for elaboration.
  4. Do not diagnose conditions definitively; offer possibilities and suggest professional consultation.
  `;

  // Filter history
  const recentHistory = history.slice(-6).map(h => `${h.role === Role.USER ? 'User' : 'Assistant'}: ${h.parts[0].text}`).join('\n');
  
  // Inject internal medical knowledge if relevant terms are found
  const medicalContext = enhanceQueryWithContext(text);
  const contextPrompt = `
  ${medicalContext ? `INTERNAL KNOWLEDGE BASE:\n${medicalContext}\n` : ''}
  ${recentHistory ? `Previous conversation:\n${recentHistory}\n` : ''}
  Current Request:
  `;

  const parts: any[] = [];
  
  if (base64Audio) {
    parts.push({
      inlineData: {
        mimeType: 'audio/wav',
        data: base64Audio
      }
    });
    parts.push({ text: `Please listen to the audio input and respond to the user's query in ${languageName}.` });
  }

  if (text) {
     parts.push({ text: `${contextPrompt} ${text}` });
  } else if (!base64Audio) {
     parts.push({ text: "Hello" });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I'm sorry, I couldn't understand that. Could you please repeat?";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

/**
 * Generates specialized content like reports, meal plans, or symptom checks
 */
export const generateSpecializedContent = async (
  type: 'report' | 'mealPlan' | 'symptomCheck',
  history: HistoryItem[],
  languageName: string
): Promise<string> => {
  const ai = getAiClient();
  const context = history.map(h => `${h.role}: ${h.parts[0].text}`).join('\n');

  let prompt = "";
  if (type === 'report') {
    prompt = `
      Act as a medical scribe. Based on the following conversation history, generate a specialized "Patient Symptom Report" for a doctor.
      
      Conversation:
      ${context}

      Format Requirements:
      - Language: ${languageName}
      - Sections: Chief Complaint, History of Present Illness, Reported Symptoms, Duration (if known).
      - Tone: Professional, Clinical.
      - Do NOT give a diagnosis. Only summarize what the user reported.
      - Use Markdown formatting.
    `;
  } else if (type === 'mealPlan') {
    prompt = `
      Create a 1-day healthy meal plan (Breakfast, Lunch, Dinner, Snacks) for a user based on their recent health conversation.
      
      User Context/Conditions mentioned recently:
      ${context}
      
      Requirements:
      - Language: ${languageName}
      - If they mentioned diabetes, low sugar. If flu, easy to digest. If nothing specific, general healthy.
      - Add brief "Why this is good for you" notes.
      - Use Markdown formatting.
    `;
  } else if (type === 'symptomCheck') {
    prompt = `
      Act as an AI Symptom Checker. Analyze the conversation history to identify the user's reported symptoms.
      
      Conversation:
      ${context}

      Task:
      1. Summarize the Reported Symptoms.
      2. List Potential Causes (Differential Diagnosis) - strictly as educational possibilities, not a medical diagnosis.
      3. Suggest Home Remedies / Self-Care Steps.
      4. Highlight RED FLAGS (Warning Signs) that require immediate doctor visits.
      
      Format Requirements:
      - Language: ${languageName}
      - Tone: Objective, Cautious, Empathetic.
      - Disclaimer: Start with "I am an AI, not a doctor. This analysis is for informational purposes only."
      - Use Markdown formatting.
    `;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });

  return response.text || "Could not generate content.";
};

export const textToSpeech = async (text: string): Promise<string> => {
  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: {
        parts: [{ text: text }]
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Kore'
            }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data received from TTS model.");

    const binaryString = window.atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const wavHeader = getWavHeader(len, 24000, 1);
    const wavBlob = new Blob([wavHeader, bytes], { type: 'audio/wav' });
    return URL.createObjectURL(wavBlob);

  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
};

function getWavHeader(dataLength: number, sampleRate: number, numChannels: number) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);
  return buffer;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}