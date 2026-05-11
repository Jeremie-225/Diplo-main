# Diplo FZE Limited — Website

A polished corporate website for **Diplo FZE Limited (DFL)** — a Ghana-based Free Zone Enterprise importing and distributing premium beverages and select foods across West Africa since 2003.

**Tagline:** *Your Gateway to Africa.*

**Coverage:** Togo, Benin, Nigeria, Côte d'Ivoire, Liberia, Burkina Faso (plus Ghana HQ).

Phase 1 is the public-facing site running on mock data; Phase 2 will wire it to Supabase with auth and an admin dashboard.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks via tsc -b then builds
npm run preview   # preview the production build
```

Requires Node 18+.

## Stack

- **Vite + React 18 + TypeScript (strict)**
- **Tailwind CSS v3** with a custom brand theme
- **React Router v6** with lazy-loaded routes + Suspense skeleton
- **framer-motion** for transitions and animations
- **react-hook-form + zod + @hookform/resolvers** for forms
- **lucide-react** for icons
- **react-hot-toast** for notifications
- **@fontsource/inter** for the typeface

## Folder structure

```
src/
├── components/
│   ├── ui/         Button, Input, Card, Container, Badge, SectionHeading
│   ├── layout/     Header, Footer, MobileMenu, PublicLayout
│   ├── sections/   Hero, Stats, WhyChooseUs, FeaturedProducts, Services,
│   │               Testimonials, Partners, LatestNews, NewsletterCTA,
│   │               DistributorBanner
│   └── forms/      ContactForm, NewsletterForm, QuoteForm (3-step)
├── pages/public/   Home, About, ProductsList, ProductDetail, Services,
│                   NewsList, NewsDetail, Contact, QuoteRequest, NotFound
├── hooks/          useScrollPosition, useIntersectionObserver
├── lib/            utils.ts (cn, formatCurrency USD, formatDate)
├── data/           Mock data — categories, products, news, testimonials,
│                   partners, site settings (USD prices)
├── types/          Domain interfaces matching the planned DB schema
├── styles/         global.css (Tailwind + CSS vars + animations)
├── App.tsx, main.tsx, router.tsx
```

## Brand tokens

| Token       | Hex       |
|-------------|-----------|
| primary     | `#1E3A8A` |
| primary-light | `#3B82F6` |
| accent      | `#FCD34D` |
| accent-warm | `#FBBF24` |
| neutral-50  | `#F8FAFC` |
| neutral-100 | `#F1F5F9` |
| neutral-700 | `#334155` |
| neutral-900 | `#0F172A` |
| success     | `#10B981` |
| error       | `#EF4444` |

All defined in `tailwind.config.js`.

## Phase 1 (this build)

- Public marketing pages: Home, About, Products list + detail, Services, News list + detail, Contact, Quote Request (3-step), 404
- Mock data only — no backend, no auth
- Forms validate with zod and show a toast on submit
- All prices in **USD**
- Mobile-first, accessible, animated

## Phase 2 (deferred)

See `TODO_PHASE_2.md`. Highlights:
- Supabase integration (DB, auth, storage)
- Admin dashboard / CMS
- i18n (EN / FR)
- Real chat widget
- Real Google Maps embed
- DOMPurify on news HTML
- Dark mode

## Decisions log

See `DECISIONS.md` for non-obvious choices made during Phase 1.
