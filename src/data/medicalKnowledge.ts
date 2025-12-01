import { KnowledgeItem } from "@/types/chatbot";

// Structured Medical Knowledge Base
export const MEDICAL_KNOWLEDGE: Record<string, any> = {
  "fever": {
    definition: "A temporary increase in your body's average temperature, often a sign of an illness or infection.",
    causes: ["viral infection", "bacterial infection", "dehydration", "flu"],
    symptoms: ["high temperature", "chills", "body pain", "weakness"],
    precautions: ["drink warm fluids", "rest well", "stay hydrated"],
    whenToSeeDoctor: "Seek help if fever stays above 102°F for more than 48 hours.",
  },
  "cough": {
    definition: "A reflex action to clear your airways of mucus and irritants.",
    causes: ["allergy", "asthma", "viral infection", "dust exposure"],
    symptoms: ["dry/wet cough", "sore throat", "irritation"],
    precautions: ["steam inhalation", "warm water", "avoid cold drinks"],
    whenToSeeDoctor: "See a doctor if cough lasts more than 2 weeks.",
  },
  "diabetes": {
    definition: "A disease that occurs when your blood glucose, also called blood sugar, is too high.",
    description: "A chronic metabolic disease affecting blood sugar regulation.",
    warningSigns: ["frequent urination", "excessive thirst", "fatigue"],
    tips: ["avoid sugar", "exercise regularly", "monitor blood glucose"],
  },
  "headache": {
    definition: "A painful sensation in any part of the head, ranging from sharp to dull, that may occur with other symptoms.",
    causes: ["stress", "migraine", "eye strain", "dehydration"],
    symptoms: ["temple pain", "pressure in head", "light sensitivity"],
    precautions: ["rest in quiet room", "drink water", "avoid bright screen"],
    whenToSeeDoctor: "If headaches are severe or frequent.",
  },
  "hypertension": {
    definition: "Abnormally high blood pressure.",
    causes: ["stress", "high salt intake", "genetics", "obesity"],
    symptoms: ["headache", "shortness of breath", "nosebleeds"],
    precautions: ["reduce salt", "exercise", "limit alcohol"],
    whenToSeeDoctor: "If BP readings are consistently high."
  },
  "flu": {
    definition: "Influenza is a viral infection that attacks your respiratory system.",
    causes: ["influenza virus"],
    symptoms: ["fever", "aching muscles", "chills", "sweats"],
    precautions: ["wash hands", "avoid close contact", "cover mouth"],
    whenToSeeDoctor: "If you have difficulty breathing."
  },
  "asthma": {
    definition: "A chronic condition in which the airways narrow and swell, making breathing difficult.",
    causes: ["allergens", "exercise", "cold air", "stress"],
    symptoms: ["wheezing", "shortness of breath", "chest tightness", "coughing"],
    precautions: ["use inhaler as prescribed", "avoid triggers", "regular checkups"],
    whenToSeeDoctor: "If symptoms worsen or inhaler doesn't help."
  },
  "anxiety": {
    definition: "A mental health disorder characterized by feelings of worry, anxiety, or fear.",
    causes: ["stress", "trauma", "genetics", "medical conditions"],
    symptoms: ["nervousness", "rapid heartbeat", "sweating", "difficulty concentrating"],
    precautions: ["deep breathing exercises", "regular exercise", "adequate sleep"],
    whenToSeeDoctor: "If anxiety interferes with daily activities."
  }
};

const EMERGENCY_KEYWORDS = [
  "chest pain", "bleeding heavily", "unconscious", "not breathing",
  "stroke", "heart attack", "heart pain", "severe headache", "blue lips",
  "suicide", "kill myself", "overdose", "can't breathe"
];

export const detectEmergency = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(word => lowerText.includes(word));
};

export const getDefinitions = (text: string): KnowledgeItem[] => {
  const found: KnowledgeItem[] = [];
  const lowerText = text.toLowerCase();
  
  Object.entries(MEDICAL_KNOWLEDGE).forEach(([term, info]) => {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lowerText)) {
      found.push({ 
        term: term.charAt(0).toUpperCase() + term.slice(1), 
        definition: info.definition,
        details: {
            causes: info.causes,
            symptoms: info.symptoms || info.warningSigns,
            precautions: info.precautions || info.tips,
            whenToSeeDoctor: info.whenToSeeDoctor
        }
      });
    }
  });

  return found.slice(0, 2);
};

export const enhanceQueryWithContext = (text: string): string => {
  const found = getDefinitions(text);
  if (found.length === 0) return "";

  return found.map(item => `
    Relevant Medical Data for "${item.term}":
    Definition: ${item.definition}
    ${item.details?.causes ? `Causes: ${item.details.causes.join(', ')}` : ''}
    ${item.details?.symptoms ? `Symptoms: ${item.details.symptoms.join(', ')}` : ''}
    ${item.details?.precautions ? `Precautions: ${item.details.precautions.join(', ')}` : ''}
    ${item.details?.whenToSeeDoctor ? `When to see doctor: ${item.details.whenToSeeDoctor}` : ''}
  `).join('\n');
};
