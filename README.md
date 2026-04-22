# Imperia By Partum

Starter architecture for an internal Intranet/ERP on Next.js + Supabase + Vercel.

## Quick start

1. Copy `.env.example` to `.env.local`.
2. Fill Supabase keys.
3. Run:
   - `npm install`
   - `npm run dev`

## Deploy

- Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in Vercel environment variables.
- Run `supabase/schema.sql` in Supabase SQL editor.
