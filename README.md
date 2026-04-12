# AI Mock Interview Coach

A React + Vite + Tailwind CSS web application that offers students free, AI-powered mock interviews.

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in Firebase keys (`VITE_FIREBASE_*`).
3. For local Gemini testing, set `VITE_GEMINI_API_KEY` (optional fallback).
4. Install dependencies:

   ```bash
   npm install
   ```

5. Run locally:

   ```bash
   npm run dev
   ```

## Secure Production Deployment (Vercel)

1. Import this repository in Vercel.
2. Use:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. In Vercel Environment Variables, set:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `GEMINI_API_KEY` (server-only, no `VITE_` prefix)
4. Redeploy.

## Stack
- React 18
- Vite
- Tailwind CSS
- Firebase Auth + Firestore
- Gemini API via Vercel Serverless Function

- Deployed:https://ai-mock-interview-coach-eta.vercel.app/
