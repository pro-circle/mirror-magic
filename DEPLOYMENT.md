# Deployment guide

## 1. Local development

```bash
bun install
cp .env.example .env       # then fill in real keys
bun run dev                # http://localhost:8080
```

Required env vars (all `VITE_*` are exposed to the browser at build time):

| Var | Where to get it |
|---|---|
| `VITE_EMAILJS_SERVICE_ID`   | https://dashboard.emailjs.com |
| `VITE_EMAILJS_TEMPLATE_ID`  | same |
| `VITE_EMAILJS_PUBLIC_KEY`   | same |
| `VITE_SUPABASE_URL`         | Supabase → Project Settings → API |
| `VITE_SUPABASE_KEY`         | Supabase anon / publishable key |

Run `supabase/schema.sql` once in the Supabase SQL editor to create
visitor / analytics / contact / guestbook / likes tables.

## 2. Production build

```bash
bun run build
```

Output goes to `dist/` (static assets + `index.html`).

## 3. Firebase Hosting deploy

Pre-requisites: a Firebase project + Firebase CLI installed
(`npm i -g firebase-tools`).

```bash
# one-time
firebase login
# edit .firebaserc → replace "your-firebase-project-id" with your real project id

# every deploy
bun run build
firebase deploy --only hosting
```

`firebase.json` is already configured to:
- serve from `dist/`
- SPA fallback (`**` → `/index.html`) so deep links work
- long cache headers on JS/CSS/fonts/images, no-cache on `index.html`

### Environment variables on Firebase

Firebase Hosting serves *static files only* — there is no runtime env.
All `VITE_*` vars are baked into the JS bundle at `bun run build` time.

Two ways to set them:

**A. CI / shell before build** (recommended)
```bash
export VITE_EMAILJS_SERVICE_ID=...
export VITE_EMAILJS_TEMPLATE_ID=...
export VITE_EMAILJS_PUBLIC_KEY=...
export VITE_SUPABASE_URL=...
export VITE_SUPABASE_KEY=...
bun run build && firebase deploy --only hosting
```

**B. `.env.production`** committed only locally (NOT in git)
```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_KEY=...
```
Vite auto-loads it during `bun run build`.

> Only ship publishable/anon keys to the browser. The Supabase
> service-role key must never appear in any `VITE_*` variable.

## 4. Notes on SSR

This project is a TanStack Start app. The default sandbox preview runs
SSR. The Firebase Hosting setup above ships the **client bundle only**
(SPA mode) so it works on the Spark (free) plan. If you need true SSR
on Firebase you'd add Cloud Functions / App Hosting — out of scope here.
