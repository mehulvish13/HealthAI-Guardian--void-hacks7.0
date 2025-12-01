# HealthAI Guardian — Everything You Need To Know

A complete, end‑to‑end guide to the HealthAI Guardian project: what it does, how it is built, how to run it, how to deploy it, how to extend it, and how to discuss it in interviews.

---

## Table of Contents
- [1. Product Overview](#1-product-overview)
- [2. Core Features](#2-core-features)
- [3. Live UX Highlights](#3-live-ux-highlights)
- [4. Architecture](#4-architecture)
- [5. Tech Stack](#5-tech-stack)
- [6. Design System](#6-design-system)
- [7. Source Tree](#7-source-tree)
- [8. Setup & Run](#8-setup--run)
- [9. Environment Variables](#9-environment-variables)
- [10. Development Scripts](#10-development-scripts)
- [11. AI Integration (Gemini)](#11-ai-integration-gemini)
- [12. Medical Knowledge & Safety](#12-medical-knowledge--safety)
- [13. Chatbot Data Flow](#13-chatbot-data-flow)
- [14. Security & Privacy](#14-security--privacy)
- [15. Deployment Notes](#15-deployment-notes)
- [16. Testing Strategy](#16-testing-strategy)
- [17. Troubleshooting](#17-troubleshooting)
- [18. Performance & Scalability](#18-performance--scalability)
- [19. Roadmap](#19-roadmap)
- [20. FAQ](#20-faq)
- [21. Interview Q&A (Common → Hard)](#21-interview-qa-common--hard)
- [22. Quick Links](#22-quick-links)

---

## 1. Product Overview
HealthAI Guardian is a modern, AI‑powered healthcare web application. It combines:
- A dashboard for health metrics
- Predictive analytics (e.g., diabetes/stress risk)
- Imaging and face analysis pages
- Personalized health plans
- And a flagship AI chatbot (MediBot) with speech‑to‑speech capabilities powered by Google Gemini

Target outcomes: improve health literacy, assist triage, and provide always‑on guidance while clearly warning that the assistant is not a doctor.

---

## 2. Core Features
- Authentication (context‑based)
- Dashboard with vitals, charts, and progress rings
- Symptom Checker, Predictive Analytics, MRI & Face Analysis
- Health Plans, Cognitive & Stress Relief games
- AI ChatBot (MediBot):
  - Text + voice input
  - Voice responses (TTS)
  - Medical knowledge snippets
  - Emergency keyword detection
  - Smart Tools: Symptom Report, Symptom Checker, Meal Planner

---

## 3. Live UX Highlights
- Glassy black/light‑blue theme, light/dark modes
- Accessible components (shadcn/ui + Radix UI)
- Smooth animations, responsive layout
- Markdown support in chat responses
- Downloadable AI‑generated plans/reports

---

## 4. Architecture
Front‑end SPA built with React + TypeScript + Vite. Data/logic layers:
- UI components: `src/components` (including `chatbot/`)
- Pages: `src/pages`
- Contexts: `src/contexts`
- Services: `src/services` (Gemini integration)
- Data: `src/data` (CSV datasets + medical knowledge)
- Types & utils: `src/types`, `src/utils`

High‑level diagram:
```
User (Browser)
  ├─ React Router pages (Dashboard, ChatBot, ...)
  ├─ shadcn/ui components
  ├─ Chatbot components (UI + media)
  └─ Services/Gemini (SDK calls)
```

---

## 5. Tech Stack
- React 18 + TypeScript
- Vite (dev/build)
- Tailwind CSS, shadcn/ui, Radix UI, Lucide Icons
- TanStack Query (optional expansion)
- Recharts (charts)
- Google Gemini via `@google/genai`
- `react-markdown` for rich chat output

---

## 6. Design System
Theme: black + light blue.
- Light: very‑light blue background, near‑black text, light blue primary
- Dark: deep near‑black, off‑white text, vibrant light blue primary
- Implemented via CSS variables in `src/index.css`, mapped to Tailwind tokens in `tailwind.config.ts`.

---

## 7. Source Tree
```
src/
  components/
    chatbot/
      ChatBubble.tsx        # message bubble with markdown + audio
      InputControls.tsx     # text input + mic recording
      SmartTools.tsx        # report/checker/meal plan buttons
      Modal.tsx             # full‑screen dialog with markdown
    dashboard/
      ProgressRing.tsx
      VitalCard.tsx
    layout/
      AppLayout.tsx
    ui/ ...                # shadcn/ui components
  contexts/
    AuthContext.tsx
  data/
    medicalKnowledge.ts    # knowledge base + helpers
    *.csv                  # demo datasets
    index.ts               # re‑exports
  hooks/
  lib/
  pages/
    ChatBot.tsx            # integrated MediBot page
    Dashboard.tsx
    ... other pages ...
  services/
    gemini.ts              # Gemini chat, TTS, specialized content
  types/
    chatbot.ts             # roles, message, history types
  utils/
    audio.ts               # blob→base64, audio helpers
```

---

## 8. Setup & Run

Prereqs: Node.js 18+ and an API key from Google AI Studio.

1) Install dependencies
```bash
npm install
```

2) Configure environment
Create `.env` in project root:
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

3) Start dev server
```bash
npm run dev
```
Open the URL shown (e.g., http://localhost:8080 or another port).

4) Build production bundle
```bash
npm run build
```

5) Preview the production build
```bash
npm run preview
```

---

## 9. Environment Variables
| Name | Required | Description |
|------|----------|-------------|
| `VITE_GEMINI_API_KEY` | Yes | Google Gemini API key for chatbot & TTS |

Note: In production, prefer a backend proxy to avoid exposing API keys.

---

## 10. Development Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview built app |
| `npm run lint` | ESLint checks |

---

## 11. AI Integration (Gemini)
- SDK: `@google/genai`
- Models:
  - `gemini-2.5-flash` (chat/content)
  - `gemini-2.5-flash-preview-tts` (TTS)
- Implementation in `src/services/gemini.ts`:
  - `sendToGemini(text, audio?, history, language)`
  - `generateSpecializedContent(type, history, language)`
  - `textToSpeech(text)` returns a browser audio URL

Medical context from `medicalKnowledge.ts` is injected when relevant keywords are detected.

---

## 12. Medical Knowledge & Safety
`src/data/medicalKnowledge.ts` stores definitions, symptoms, tips, and escalation guidance for common conditions. Utilities:
- `getDefinitions(text)` → array of matched medical terms
- `enhanceQueryWithContext(text)` → formatted context block
- `detectEmergency(text)` → detects emergency keywords (e.g., "chest pain") and triggers visible warnings and immediate call‑for‑help guidance.

Disclaimer is shown below the input; the bot does not diagnose and encourages professional care for red flags.

---

## 13. Chatbot Data Flow
```
User text/voice → InputControls
  → (optional) MediaRecorder captures audio → base64 via audio.ts
  → sendToGemini(text, base64, history)
    → adds internal medical context + chat history
    → Gemini response text
  → (if enabled) textToSpeech(response) → audio URL
  → ChatBubble renders markdown + audio controls
  → SmartTools can generate report/meal plan/symptom check
```

---

## 14. Security & Privacy
- Dev/MVP: direct client calls using `VITE_GEMINI_API_KEY` (acceptable for demos)
- Production: move to a backend proxy to keep keys secret and add rate limiting
- Add CSP/Helmet if serving via Node; ensure HTTPS for mic access and TTS
- Do not store PHI; if you do, add encryption at rest, RBAC, and audit logging

Backend proxy (example idea):
```ts
// POST /api/chat { message, history }
// Server reads GEMINI_API_KEY from secure env; client never sees it.
```

---

## 15. Deployment Notes
SPA hosting options: Vercel, Netlify, Cloudflare Pages, Azure Static Web Apps.

Key items:
- Ensure SPA fallback to `index.html` (history API rewrites)
- Set environment variable `VITE_GEMINI_API_KEY` on the platform (only for demo). Prefer a server proxy for production.
- Enforce HTTPS for microphone permissions.

Example Netlify `_redirects`:
```
/* /index.html 200
```

---

## 16. Testing Strategy
- Unit tests for utilities (audio, knowledge helpers)
- Component tests for ChatBubble/InputControls behavior
- Integration tests for chatbot flow (mock Gemini)
- E2E tests (Cypress/Playwright) for full user journeys
- Accessibility checks with `jest-axe`/Lighthouse

---

## 17. Troubleshooting
- "Cannot find module '@/data/medicalKnowledge'": import from `@/data/index` (re‑export).
- Chatbot not responding: verify `.env` key, restart dev server.
- Mic not working: allow permissions; HTTPS required in production; use Chrome/Edge.
- Smart Tools disabled: have at least one exchange (welcome + your message + AI reply).

---

## 18. Performance & Scalability
- Vite HMR, code‑splitting on large pages, tree‑shaking
- Virtualize long chat histories if needed (react‑window/react‑virtual)
- For 10k+ users: add backend proxy, Redis caching, rate limiting, and DB for persistence; horizontally scale API workers.

---

## 19. Roadmap
- Backend proxy + secured API keys
- Persisted conversations and user profiles
- Multilingual support (UI + bot)
- Wearables integration (Fitbit/Apple/Google)
- Telemedicine hand‑off & scheduling
- PWA + offline history
- RAG with vetted medical sources

---

## 20. FAQ
- Is MediBot a doctor? No; it provides informational guidance only.
- Do I need an API key? Yes, for chatbot and TTS (see `.env`).
- Can I deploy without a backend? Yes for demo, but hide keys with a backend for production.
- Does voice work locally? Yes (HTTP OK in dev, HTTPS required in prod).

---

## 21. Interview Q&A (Common → Hard)

1) What problem does HealthAI Guardian solve?
- Accessibility, early detection, education, and triage support.

2) Why React + TypeScript + Vite?
- Type safety, fast DX, great production output.

3) How does the chatbot integrate with Gemini?
- `sendToGemini` builds a multimodal message (text + optional audio) with system instruction + recent history, injects medical context, and parses output. TTS converts text to audio for playback.

4) How do you detect emergencies?
- Keyword list in `medicalKnowledge.ts`; if matched, show high‑priority warning and instruct to call local emergency services.

5) How would you secure this for production?
- Backend proxy for Gemini calls, user auth tokens, per‑user rate limits, logging, and secret management; avoid storing PHI unless fully compliant.

6) How would you scale to 10k concurrent users?
- CDN for static, horizontally scale API workers behind a load balancer, Redis cache, queue long jobs, and shard DB or use Timescale for time‑series vitals.

7) Testing approach?
- Unit for helpers, RTL for components, integration for chatbot flow with mocks, E2E for critical journeys, plus a11y checks.

---

## 22. Quick Links
- README: `./README.md`
- Chatbot Setup: `./CHATBOT_SETUP.md`
- Gemini API Docs: https://ai.google.dev/docs
- Get API Key: https://aistudio.google.com/app/apikey
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com/docs

---

Built with ❤️ to make healthcare guidance more accessible.
