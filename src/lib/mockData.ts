// Mock datasets for HealthAI Guardian

export interface VitalSigns {
  heartRate: number;
  steps: number;
  stressLevel: number;
  sleepHours: number;
  calories: number;
  bloodPressure: { systolic: number; diastolic: number };
}

export interface DiabetesRecord {
  age: number;
  bmi: number;
  glucose: number;
  bp: number;
  insulin: number;
  diabetes: number;
}

export interface StressRecord {
  age: number;
  heart_rate: number;
  sleep_hours: number;
  steps: number;
  mood_score: number;
  stress_score: number;
}

export const diabetesData: DiabetesRecord[] = [
  { age: 45, bmi: 28, glucose: 140, bp: 90, insulin: 120, diabetes: 1 },
  { age: 25, bmi: 22, glucose: 85, bp: 70, insulin: 80, diabetes: 0 },
  { age: 50, bmi: 32, glucose: 160, bp: 95, insulin: 130, diabetes: 1 },
  { age: 30, bmi: 24, glucose: 95, bp: 75, insulin: 85, diabetes: 0 },
  { age: 55, bmi: 30, glucose: 150, bp: 88, insulin: 115, diabetes: 1 },
];

export const stressData: StressRecord[] = [
  { age: 26, heart_rate: 71, sleep_hours: 3.1, steps: 11373, mood_score: 3, stress_score: 4 },
  { age: 43, heart_rate: 66, sleep_hours: 8.3, steps: 10249, mood_score: 3, stress_score: 4 },
  { age: 57, heart_rate: 110, sleep_hours: 5.1, steps: 3235, mood_score: 3, stress_score: 4 },
  { age: 19, heart_rate: 105, sleep_hours: 5.9, steps: 7279, mood_score: 4, stress_score: 4 },
  { age: 47, heart_rate: 65, sleep_hours: 8.7, steps: 6931, mood_score: 1, stress_score: 2 },
];

export const mriLabels = ['NonDemented', 'MildDemented', 'VeryMildDemented', 'ModerateDemented'];

export const symptomDatabase = [
  {
    keywords: ['headache', 'head pain', 'migraine'],
    condition: 'Tension Headache / Migraine',
    severity: 'Medium',
    advice: 'Rest in a dark, quiet room. Stay hydrated and consider over-the-counter pain relief. If persistent, consult a doctor.',
  },
  {
    keywords: ['fever', 'high temperature', 'chills'],
    condition: 'Viral Infection / Flu',
    severity: 'Medium',
    advice: 'Rest, stay hydrated, and monitor temperature. Seek medical attention if fever exceeds 103°F (39.4°C).',
  },
  {
    keywords: ['fatigue', 'tired', 'exhaustion', 'low energy'],
    condition: 'Chronic Fatigue / Stress',
    severity: 'Low',
    advice: 'Ensure 7-9 hours of sleep, manage stress, and maintain a balanced diet. Consider iron supplements if deficient.',
  },
  {
    keywords: ['chest pain', 'heart pain', 'palpitations'],
    condition: 'Possible Cardiac Issue',
    severity: 'High',
    advice: 'Seek immediate medical attention. Do not ignore chest pain, especially with shortness of breath.',
  },
  {
    keywords: ['nausea', 'vomiting', 'stomach upset'],
    condition: 'Gastric Distress',
    severity: 'Low',
    advice: 'Avoid solid foods temporarily. Sip clear fluids. If vomiting persists over 24 hours, see a doctor.',
  },
  {
    keywords: ['anxiety', 'panic', 'nervous', 'worried'],
    condition: 'Anxiety Disorder',
    severity: 'Medium',
    advice: 'Practice deep breathing exercises. Consider meditation apps. If persistent, consult a mental health professional.',
  },
  {
    keywords: ['cough', 'sore throat', 'cold'],
    condition: 'Common Cold / Upper Respiratory Infection',
    severity: 'Low',
    advice: 'Rest, drink warm fluids, and use throat lozenges. See a doctor if symptoms last more than 10 days.',
  },
  {
    keywords: ['dizzy', 'lightheaded', 'vertigo'],
    condition: 'Vertigo / Low Blood Pressure',
    severity: 'Medium',
    advice: 'Sit or lie down immediately. Stay hydrated. If frequent, check blood pressure and consult a doctor.',
  },
  {
    keywords: ['thirsty', 'frequent urination', 'blurred vision'],
    condition: 'Possible Diabetes Symptoms',
    severity: 'High',
    advice: 'Get blood glucose levels tested immediately. This could indicate diabetes or pre-diabetes.',
  },
  {
    keywords: ['stress', 'overwhelmed', 'burnout'],
    condition: 'Chronic Stress / Burnout',
    severity: 'Medium',
    advice: 'High stress levels detected – recommend meditation, regular exercise, and adequate sleep.',
  },
];

export const dietPlans = {
  lowRisk: [
    { meal: 'Breakfast', items: ['Oatmeal with berries', 'Greek yogurt', 'Green tea'], calories: 350 },
    { meal: 'Lunch', items: ['Grilled chicken salad', 'Quinoa', 'Fresh fruits'], calories: 450 },
    { meal: 'Dinner', items: ['Baked salmon', 'Steamed vegetables', 'Brown rice'], calories: 500 },
    { meal: 'Snacks', items: ['Almonds', 'Apple slices', 'Hummus with carrots'], calories: 200 },
  ],
  mediumRisk: [
    { meal: 'Breakfast', items: ['Whole grain toast', 'Scrambled eggs', 'Spinach smoothie'], calories: 300 },
    { meal: 'Lunch', items: ['Lentil soup', 'Mixed greens', 'Whole grain bread'], calories: 400 },
    { meal: 'Dinner', items: ['Grilled tofu', 'Stir-fried vegetables', 'Millet'], calories: 450 },
    { meal: 'Snacks', items: ['Walnuts', 'Berries', 'Low-fat cheese'], calories: 150 },
  ],
  highRisk: [
    { meal: 'Breakfast', items: ['Chia pudding', 'Unsweetened almond milk', 'Cinnamon'], calories: 250 },
    { meal: 'Lunch', items: ['Vegetable soup', 'Grilled fish', 'Leafy greens'], calories: 350 },
    { meal: 'Dinner', items: ['Lean turkey breast', 'Steamed broccoli', 'Cauliflower rice'], calories: 400 },
    { meal: 'Snacks', items: ['Cucumber', 'Celery with peanut butter', 'Boiled eggs'], calories: 100 },
  ],
};

export const exerciseRoutines = [
  { day: 'Monday', exercise: 'Morning Walk', duration: '30 min', intensity: 'Low', dormFriendly: true },
  { day: 'Tuesday', exercise: 'Dorm Room HIIT', duration: '20 min', intensity: 'High', dormFriendly: true },
  { day: 'Wednesday', exercise: 'Yoga & Stretching', duration: '25 min', intensity: 'Low', dormFriendly: true },
  { day: 'Thursday', exercise: 'Bodyweight Training', duration: '30 min', intensity: 'Medium', dormFriendly: true },
  { day: 'Friday', exercise: 'Jump Rope / Dancing', duration: '20 min', intensity: 'Medium', dormFriendly: true },
  { day: 'Saturday', exercise: 'Outdoor Jogging', duration: '40 min', intensity: 'Medium', dormFriendly: false },
  { day: 'Sunday', exercise: 'Rest / Light Stretching', duration: '15 min', intensity: 'Low', dormFriendly: true },
];

export const chatbotResponses = [
  { keywords: ['hello', 'hi', 'hey'], response: "Hello! I'm Dr. AI 🤖 How can I help you today with your health concerns?" },
  { keywords: ['headache', 'head hurts'], response: "I'm sorry to hear about your headache. Have you been drinking enough water? Dehydration is a common cause. Try resting in a quiet room and consider taking a pain reliever if needed." },
  { keywords: ['stress', 'stressed', 'anxious'], response: "Stress can really affect your health. I recommend trying some deep breathing exercises - breathe in for 4 counts, hold for 4, and exhale for 4. Would you like me to guide you through a quick meditation?" },
  { keywords: ['sleep', 'insomnia', 'tired'], response: "Quality sleep is crucial for your health. Try maintaining a consistent sleep schedule, avoid screens 1 hour before bed, and keep your room cool and dark. Shall I create a sleep improvement plan for you?" },
  { keywords: ['diet', 'eating', 'nutrition'], response: "Good nutrition is the foundation of good health! Focus on whole foods, plenty of vegetables, lean proteins, and stay hydrated. Would you like me to suggest a personalized meal plan?" },
  { keywords: ['exercise', 'workout', 'fitness'], response: "Regular exercise is wonderful for both physical and mental health! Even 20-30 minutes of moderate activity daily can make a big difference. Want me to suggest some dorm-friendly exercises?" },
  { keywords: ['doctor', 'appointment', 'consult'], response: "I can help you connect with a healthcare professional. Based on your symptoms, would you like me to schedule a virtual consultation or find a nearby clinic?" },
  { keywords: ['diabetes', 'blood sugar'], response: "Managing blood sugar is important. Key steps include regular monitoring, balanced meals, regular exercise, and taking medications as prescribed. Would you like to check your diabetes risk score?" },
  { keywords: ['thank', 'thanks'], response: "You're welcome! Remember, I'm here 24/7 to help with your health questions. Take care of yourself! 💚" },
];

export function generateVitalSigns(): VitalSigns {
  return {
    heartRate: Math.floor(Math.random() * 40) + 60, // 60-100 bpm
    steps: Math.floor(Math.random() * 5000) + 2000,
    stressLevel: Math.floor(Math.random() * 100),
    sleepHours: Math.random() * 4 + 5, // 5-9 hours
    calories: Math.floor(Math.random() * 800) + 1200,
    bloodPressure: {
      systolic: Math.floor(Math.random() * 30) + 110,
      diastolic: Math.floor(Math.random() * 20) + 70,
    },
  };
}

export function calculateDiabetesRisk(bmi: number, sleepHours: number, activityLevel: number): number {
  let risk = 0;
  
  // BMI scoring
  if (bmi < 18.5) risk += 10;
  else if (bmi < 25) risk += 5;
  else if (bmi < 30) risk += 25;
  else risk += 45;
  
  // Sleep scoring
  if (sleepHours < 5) risk += 25;
  else if (sleepHours < 7) risk += 15;
  else if (sleepHours <= 9) risk += 5;
  else risk += 10;
  
  // Activity scoring (1-5 scale)
  risk += (5 - activityLevel) * 10;
  
  return Math.min(100, Math.max(0, risk));
}

export function calculateStressRisk(sleepHours: number, activityLevel: number, moodScore: number): number {
  let risk = 0;
  
  // Sleep scoring
  if (sleepHours < 5) risk += 30;
  else if (sleepHours < 7) risk += 20;
  else if (sleepHours <= 9) risk += 5;
  else risk += 15;
  
  // Activity scoring
  risk += (5 - activityLevel) * 10;
  
  // Mood scoring (1-5 scale, 5 is best)
  risk += (5 - moodScore) * 10;
  
  return Math.min(100, Math.max(0, risk));
}

export function analyzeSymptoms(input: string): typeof symptomDatabase[0] | null {
  const lowerInput = input.toLowerCase();
  
  for (const symptom of symptomDatabase) {
    if (symptom.keywords.some(keyword => lowerInput.includes(keyword))) {
      return symptom;
    }
  }
  
  return null;
}

export function getChatbotResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  for (const response of chatbotResponses) {
    if (response.keywords.some(keyword => lowerInput.includes(keyword))) {
      return response.response;
    }
  }
  
  return "I understand your concern. While I can provide general guidance, please remember to consult a healthcare professional for personalized medical advice. Is there anything specific I can help you with?";
}
