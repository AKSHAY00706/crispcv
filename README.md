# 🔥 CrispCV — Roast Your Portfolio & Resume

> AI-powered portfolio and resume roaster. Crispy feedback, zero sugarcoating.

## Quick Start

```bash
# 1. Install Node dependencies
npm install

# 2. Set up Python venv (optional — for scraper helpers)
python -m venv venv
.\venv\Scripts\activate        # Windows
source venv/bin/activate       # Mac/Linux
pip install -r requirements.txt

# 3. Add your Gemini API key to .env.local
# GEMINI_API_KEY=your_key_here

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features
- Portfolio URL roasting via Gemini web scrape
- Resume PDF / text paste roasting
- 5 intensity levels: Light Roast → CHARCOAL
- Hellfire Kitchen (dark) & Burnt Parchment (light) themes
- Shareable roast score cards
- Rate limiting: 3 roasts/hour per IP
- Bot protection & input sanitisation
- Roast history (last 3 sessions)

## Deploy to Vercel
```bash
npx vercel --prod
```
Add `GEMINI_API_KEY` in Vercel environment variables.

## Stack
- Next.js 14 · TypeScript · Tailwind CSS · Framer Motion
- Google Gemini 1.5 Pro
