# 🔑 API Key & Rate Limits Guide

## ⚠️ Current Issue: Rate Limit Exceeded

You're seeing this error because the **Gemini API free tier** has strict rate limits:
- **15 requests per minute** (RPM)
- **1 million tokens per day**
- **1500 requests per day**

## ✅ What I Fixed

1. **Switched to Stable Model**: Changed from `gemini-2.0-flash-exp` (experimental, stricter limits) to `gemini-1.5-flash` (stable, better limits)

2. **Disabled Audio by Default**: Voice responses use extra API calls. Now you need to manually enable audio (click speaker icon 🔊)

3. **Better Error Messages**: Now shows clear rate limit warnings instead of generic errors

4. **Added UI Warning**: Shows reminder to wait 15-30 seconds between Smart Tool requests

## 🔧 Solutions (Pick One)

### Option 1: Wait and Retry (Free)
**Best for testing:**
- Wait 15-30 seconds between requests
- The free tier resets every minute
- Use text-only chat (don't enable audio)
- Avoid using Smart Tools back-to-back

### Option 2: Get a New API Key (Free)
**If current key is exhausted for the day:**

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with a **different Google account**
3. Click "Create API key"
4. Copy the new key
5. Update `.env` file:
   ```env
   VITE_GEMINI_API_KEY=your_new_key_here
   ```
6. Restart dev server (Ctrl+C, then `npm run dev`)

### Option 3: Upgrade to Paid Tier (Recommended for Production)
**For unlimited usage:**

- Go to: https://ai.google.dev/pricing
- **Gemini 1.5 Flash**: $0.075 per 1M tokens (very affordable)
- No rate limits (500 RPM)
- Better for production apps

To upgrade:
1. Visit Google Cloud Console: https://console.cloud.google.com/
2. Enable billing
3. Create API key from paid project
4. Update `.env` with new key

### Option 4: Use Environment Variables per Feature
**Separate keys for different features:**

```env
# .env
VITE_GEMINI_API_KEY_CHAT=key_for_basic_chat
VITE_GEMINI_API_KEY_TOOLS=key_for_reports
VITE_GEMINI_API_KEY_VOICE=key_for_audio
```

This way you can distribute load across multiple free tier accounts.

## 📊 Understanding Rate Limits

### Free Tier Breakdown:
```
Chat Message = ~500 tokens (request) + ~500 tokens (response) = 1000 tokens
Voice Message = ~1500 tokens (audio processing) + ~500 tokens (response) = 2000 tokens
Smart Tool Report = ~2000 tokens (context) + ~1000 tokens (response) = 3000 tokens
```

### Daily Limits:
- With **1 million tokens/day** you can send approximately:
  - 1000 text messages
  - 500 voice messages
  - 333 Smart Tool reports

### Per-Minute Limits:
- **15 requests/minute** = 1 request every 4 seconds
- If you go faster, you'll hit the rate limit

## 🎯 Best Practices for Free Tier

### DO:
✅ Space out requests (4+ seconds between messages)  
✅ Use text chat instead of voice  
✅ Test Smart Tools one at a time  
✅ Keep messages concise  
✅ Disable audio responses (speaker icon off)  

### DON'T:
❌ Send multiple messages rapidly  
❌ Generate multiple reports back-to-back  
❌ Enable voice responses during testing  
❌ Use voice input for quick tests  
❌ Keep regenerating content  

## 🔍 Checking Your Usage

Monitor your API usage:
1. Visit: https://ai.dev/usage?tab=rate-limit
2. Sign in with your Google account
3. View daily token usage and RPM

## 🚀 Quick Fix Right Now

**To test immediately:**

1. Wait **30 seconds** ⏱️
2. Send a simple text message: "hello"
3. Wait for response
4. Continue normally (wait 5+ seconds between messages)

**Current Settings (Optimized for Free Tier):**
- ✅ Using stable `gemini-1.5-flash` model
- ✅ Audio disabled by default
- ✅ Rate limit warnings in UI
- ✅ Better error messages

## 📝 Current .env Configuration

Your API key is configured:
```env
VITE_GEMINI_API_KEY=AIzaSyCiljbcCpY7xOdI7s9mZz6gCyHndq-47dg
```

This key appears to have hit its quota. Consider getting a new key from a different Google account or waiting for the quota to reset.

## 🔄 Quota Reset Times

- **Per-minute quotas**: Reset every 60 seconds
- **Daily quotas**: Reset at midnight UTC
- **Current time**: Check https://time.is/UTC

## 💡 Alternative Free Options

If you keep hitting limits, consider:

1. **Hugging Face Inference API** (Free tier available)
2. **OpenAI** (Free $5 credit for new accounts)
3. **Anthropic Claude** (Limited free tier)
4. **Local LLM** (Ollama - completely free, runs locally)

---

**TL;DR**: Wait 30 seconds and try again. Your API key works, just hit the free tier rate limit. Consider getting a second free key or upgrading to paid tier for production.
