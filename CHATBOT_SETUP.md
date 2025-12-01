# 🤖 MediBot AI Chatbot - Setup Guide

## ✅ Integration Complete!

The advanced MediBot AI chatbot has been successfully integrated into your HealthAI Guardian application with all features from the prebuilt chatbot.

## 🎯 Features Included

### Core Features
✅ **Speech-to-Speech** - Voice input & AI voice responses via Gemini TTS
✅ **Medical Knowledge Base** - Context-aware responses with medical definitions
✅ **Emergency Detection** - Automatic detection of emergency keywords
✅ **Smart Tools** - Generate symptom reports, meal plans, and symptom analysis
✅ **Audio Player** - Play/pause controls for AI voice responses
✅ **Voice Recording** - Record and send voice messages
✅ **Markdown Support** - Rich text formatting in responses
✅ **Theme Integration** - Fully integrated with your black/light blue theme

### UI Features
- Beautiful chat bubbles with avatars
- Medical context cards showing related terms
- Loading states with animated indicators
- Audio recording with timer
- Typing indicators
- Audio toggle button
- Downloadable reports/meal plans

## 🚀 Setup Instructions

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variable

Open the `.env` file in the project root and replace the placeholder:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Important:** Never commit your actual API key to version control!

### 3. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:8082` (or another port if 8082 is in use).

### 4. Navigate to ChatBot

1. Login to the application
2. Click "ChatBot" in the sidebar
3. Start chatting!

## 🎤 How to Use

### Text Chat
1. Type your health question in the input box
2. Press Enter or click Send button
3. Wait for AI response (with optional voice)

### Voice Chat
1. Click the microphone button
2. Speak your question
3. Click stop button when done
4. AI will process and respond with voice

### Smart Tools (Requires conversation history)
- **Symptom Report** - Generate a medical report for doctors
- **Symptom Checker** - AI analysis of reported symptoms
- **Meal Planner** - Get personalized meal recommendations

### Audio Controls
- Toggle voice responses on/off with speaker button in header
- Play/pause AI voice responses using controls in chat bubbles

## 📁 New Files Added

```
src/
├── components/
│   └── chatbot/
│       ├── ChatBubble.tsx       # Chat message component
│       ├── InputControls.tsx    # Input with voice recording
│       ├── SmartTools.tsx       # Smart tool buttons
│       └── Modal.tsx            # Report/plan viewer
├── services/
│   └── gemini.ts                # Gemini AI integration
├── utils/
│   └── audio.ts                 # Audio utility functions
├── data/
│   └── medicalKnowledge.ts      # Medical knowledge base
├── types/
│   └── chatbot.ts               # TypeScript types
└── pages/
    └── ChatBot.tsx              # ✅ Updated with new features
.env                             # Environment variables
```

## 🔧 Troubleshooting

### "API Key is missing" Error
- Make sure you've added your Gemini API key to `.env`
- Restart the dev server after adding the key
- Check that the env variable is prefixed with `VITE_`

### Voice Recording Not Working
- Allow microphone permissions in your browser
- Check browser console for errors
- Ensure you're using HTTPS in production

### TTS (Voice Responses) Not Working
- This is optional and will silently fail if there's an issue
- Check your API quota/limits in Google AI Studio
- Text responses will still work normally

### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Customization

### Change Voice
Edit `src/services/gemini.ts` line ~168:
```typescript
voiceName: 'Kore'  // Options: Kore, Puck, Charon, Aoede
```

### Adjust Medical Knowledge
Add more conditions to `src/data/medicalKnowledge.ts`:
```typescript
"condition_name": {
  definition: "...",
  causes: ["..."],
  symptoms: ["..."],
  precautions: ["..."]
}
```

### Modify Emergency Keywords
Edit `src/data/medicalKnowledge.ts` EMERGENCY_KEYWORDS array

## 🔐 Security Notes

- ✅ API key is client-side (free tier is okay)
- ✅ For production, use server-side API calls
- ✅ Add `.env` to `.gitignore`
- ✅ Never expose your API key publicly

## 📊 API Usage

Gemini API free tier includes:
- 15 requests per minute
- 1500 requests per day
- 1 million tokens per day

Perfect for testing and small applications!

## 🎉 You're All Set!

Your advanced AI health chatbot is ready to use. Test all features:

1. ✅ Text chat
2. ✅ Voice recording
3. ✅ Voice responses
4. ✅ Emergency detection
5. ✅ Medical context cards
6. ✅ Symptom reports
7. ✅ Meal plans
8. ✅ Symptom checker

Enjoy your enhanced HealthAI Guardian application! 🏥✨
