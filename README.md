# Run Hi Tech Solar — Website Redesign (Frontend)

Modern React + Tailwind rebuild of the client's static site, with real
content pulled from their old site/socials (services, coverage areas,
subsidy figures, HPCL/industrial stats, contact details).

## Stack
- **React 19** + **Vite** — fast dev/build, easy to hand off
- **Tailwind CSS v4** — CSS-first config via `@theme` in `src/index.css` (no `tailwind.config.js` needed)
- Plain SVG icons (no icon library dependency yet — swap for `lucide-react` if you want more icons)

## Run locally
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build -> dist/
```

## Structure
```
src/
  components/
    Navbar.jsx        sticky nav, mobile menu
    Hero.jsx           headline + animated "yield ring" signature visual
    Services.jsx        6 service cards (residential, HPCL/commercial, industrial EPC, battery, EV, water heater)
    Subsidy.jsx         PM Surya Ghar ₹78,000 subsidy CTA banner
    Areas.jsx           service area chips (Namakkal, Karur, Salem, Erode, Tirupur, Coimbatore)
    Testimonials.jsx    ⚠️ placeholder quotes — replace with real reviews before launch
    QuoteForm.jsx        lead capture form, frontend-only (see Backend Integration)
    Footer.jsx          contact details + embeds QuoteForm
  index.css            Tailwind import + design tokens (colors, fonts)
  App.jsx / main.jsx
```

## Design direction
Deep navy (`#0A1220`) ground with a warm solar-gold accent (`#F2A93B`) and
a teal secondary — evokes sunrise/energy without falling back on the
generic cream+terracotta AI-template look. Display type is Space Grotesk,
body is Inter. Signature element: the animated radial "yield ring" in the
hero, standing in for system efficiency/generation.

## Backend integration (next step)
The site is currently **frontend-only**. `QuoteForm.jsx` has a `handleSubmit`
stub — wire it to a real endpoint, e.g.:

- **Simple**: a serverless function (Cloudflare Worker / Vercel function) that
  emails the lead or writes to a spreadsheet/CRM.
- **Fuller stack**: Node/Express or Fastify API + a database (Postgres/
  Supabase) for lead storage, plus WhatsApp/SMS notification on submit.

Suggested `.env` values once a backend exists — see `.env.example`.

## Content still needed from client
- Real customer testimonials (3+) to replace placeholders in `Testimonials.jsx`
- Logo file (currently a simple dot mark in the navbar)
- Project/installation photos for a future gallery section
- Confirmed service area list / any additional certifications (MNRE, ISO, etc.)
