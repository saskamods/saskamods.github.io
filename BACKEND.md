# SASKA AI backend scaffold

This repository now contains a serverless backend scaffold for the static GitHub Pages frontend.

## Important deployment detail

GitHub Pages serves HTML, CSS, and JavaScript only. It does **not** execute `api/*.js` server code. Deploy this same repository to Vercel (or move these functions to another serverless provider), then configure the frontend to use that API URL.

## Local setup

1. Install Node.js 18 or newer.
2. Install Vercel CLI: `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add an OpenAI API key. Never put this key in `index.html` or browser JavaScript.
5. Run `npm run dev`.
6. Verify `GET /api/health`.

## Endpoints

- `GET /api/health` — health check.
- `POST /api/chat` — body: `{ "message": "...", "history": [] }`.
- `POST /api/generate` — body: `{ "prompt": "...", "size": "1024x1024", "quality": "auto" }`.

Both AI endpoints validate input, generate a request ID, handle upstream errors, and optionally persist results to Supabase.

## Supabase persistence (optional)

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL Editor.
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the Vercel environment variables.
4. Keep the service-role key server-side only.

## Vercel deployment

1. Import `saskamods/saskamods.github.io` into Vercel.
2. Add `OPENAI_API_KEY`, `OPENAI_CHAT_MODEL`, `OPENAI_IMAGE_MODEL`, and `ALLOWED_ORIGIN` in Project Settings → Environment Variables.
3. Deploy.
4. Test `https://YOUR-VERCEL-DOMAIN/api/health`.

For production, add authentication, per-user quotas, billing, and durable rate limiting before exposing paid unlimited generation. The current scaffold intentionally does not include fake billing or claim that the static GitHub Pages site itself runs the backend.
