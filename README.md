# ScopeGuard

Frontend-only B2B SaaS application for web agencies, AI studios, and freelancers to automate client onboarding and prevent scope creep with AI-assisted change order workflows.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4**
- **React Router** (`react-router-dom`)
- **Lucide React** icons & **Motion** (`motion/react`)
- Local mock data (`/src/data/mockData.ts`) and async Mock AI service (`/src/lib/mockAI.js`) with 1–2 second simulated latency.

## Project Structure

```text
src/
├── config/
│   └── appConfig.ts         # Central brand name ("ScopeGuard") & default config
├── context/
│   └── AppContext.tsx        # Reactive global state persisted in localStorage
├── data/
│   └── mockData.ts          # 4 demo projects, 7 client requests, milestones, assets & change orders
├── lib/
│   ├── mockAI.js            # analyzeContract() & checkRequest() async mock AI service
│   └── mockAI.d.ts          # TypeScript declarations for mockAI.js
├── components/
│   ├── AgencyLayout.tsx     # Responsive agency sidebar + mobile drawer + header
│   ├── BrandMark.tsx        # ScopeGuard logo & white-label agency logo mark
│   ├── CopyLinkButton.tsx   # One-click magic link copy button
│   └── StatusBadge.tsx      # Semantic status badges (In Scope, Out of Scope, Unclear, Pending)
├── pages/
│   ├── LandingPage.tsx      # Marketing landing page with interactive Scope Guard preview
│   ├── AuthPages.tsx        # UI-only Login & Signup pages
│   ├── DashboardPage.tsx    # Agency KPI cards, project filters, and pending requests queue
│   ├── NewProjectPage.tsx   # 3-step contract upload -> AI extraction -> magic link wizard
│   ├── ProjectDetailPage.tsx# 5-tab workspace (Overview, Deliverables, Assets, Requests, Change Orders)
│   ├── RequestDetailPage.tsx# AI Scope Guard panel, editable estimates, and Change Order modal
│   ├── SettingsPage.tsx     # White-label agency name, logo, brand color, hourly rate & payment link
│   └── ClientPortalPage.tsx # White-label client portal (/portal/:projectId, no login)
├── types/
│   └── index.ts             # TypeScript domain interfaces
├── App.tsx                  # Route definitions
├── index.css                # Tailwind CSS & typography configuration
└── main.tsx                 # React entry point
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server on port 3000:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Type-check with TypeScript:
   ```bash
   npm run lint
   ```

## Demo Walkthrough

- **Landing Page (`/`)**: Explore the product overview, interactive Scope Guard alert preview, and placeholder pricing.
- **Agency Dashboard (`/dashboard`)**: View active projects, pending out-of-scope counts, and recovered revenue.
- **New Project Wizard (`/projects/new`)**: Load the sample contract or drop a file, run `analyzeContract()`, edit milestones/deliverables/assets, and generate a client magic link.
- **Scope Guard Review (`/projects/veloce-ai-support/requests/req-v1`)**: Inspect the AI verdict for *"Can we also add Stripe subscriptions and a dark mode?"*, adjust hours/price, and send a Change Order.
- **White-Label Client Portal (`/portal/veloce-ai-support`)**: View the portal branded with your agency settings, upload onboarding assets with live progress bars, submit a new client request, and pay an issued Change Order.
