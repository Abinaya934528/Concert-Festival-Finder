# VYBE — Concert & Festival Finder

> **Find Your People. Feel The Music. Make The Moment.**

![VYBE Cover](https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1400&q=80)

---

## 🎵 Project Vision

**VYBE** is a next-generation concert, festival, and live music discovery platform that merges the sonic intimacy of Spotify, the electric visual aesthetic of premium music festivals, and the collaborative momentum of modern social discovery apps.

Built for deep music lovers, festival tribes, and night owls, VYBE eliminates the frustration of generic event listing sites. It provides interactive music personality profiling (**Vibe DNA**), collaborative planning (**Squad Sync**), comprehensive expense calculation (**Night-Out Budget Planner**), stage conflict resolution (**Festival Schedule Builder**), ground navigation (**Crowd Mood Map**), and keepsakes (**Digital Memory Capsule**).

---

## ✨ Core Features

### 1. 🔮 Vibe DNA Lab (`/vibe-dna`)
- **Interactive Multi-Vector Quiz**: Analyzes favorite genres, must-see artists, preferred concert atmosphere, budget ceiling, travel radius, indoor vs. outdoor venues, solo vs. group experiences, and festival vs. intimate club preferences.
- **Distinctive Archetypes**:
  - **Midnight Raver** (⚡ High BPM, warehouse raves, after-hours hypnosis)
  - **Indie Explorer** (🎸 Poetic songwriting, basement stages, raw indie rock)
  - **Festival Nomad** (🎪 Multi-day campouts, dusty sunset stages, wanderers)
  - **Acoustic Soul** (🕯️ Unplugged rooms, classical/folk ragas, pristine audio)
  - **Bass Hunter** (🔊 Sub-bass frequencies, Funktion-One sound systems, high-voltage)
  - **Pop Dreamer** (✨ Anthemic choruses, stadium spectacles, collective sing-alongs)
- **Transparent Algorithmic Vibe Match**: Displays an explainable **Vibe Match Score** (e.g. `94% Vibe Match`) for every event, clearly highlighting the contributing points without claiming opaque black-box AI.

### 2. 📡 Smart Event Discovery (`/discover`)
- **Multi-Faceted Search**: Filter by artist, city, venue, event type, setting (indoor/outdoor), price range, accessibility accommodations, or free RSVP.
- **Editorial Curated Collections**: "Sunset Sessions", "Hidden Gems", "Warehouse Underground", "Big Stage Energy", and "Budget Friendly".
- **Dynamic Sorting**: By Vibe Match %, Date (Soonest), Price (Low to High), or Price (High to Low).

### 3. 🎫 Deep Event Details (`/event/:id`)
- Immersive high-resolution hero banners with verified event metadata.
- **Tabs**:
  - **Overview**: Tagline, synopsis, atmosphere tags, and performing lineup with links to artist spotlights.
  - **Tickets & Passes**: Interactive ticket tier cards, status badges (`Available`, `Selling Fast`, `Sold Out`), and one-click budget pre-loader.
  - **Stages & Schedule**: Festival stages overview, performance schedules with stage names, times, and direct addition to personal schedule.
  - **Accessibility Comfort**: Verified vs. unconfirmed status for wheelchair access, step-free access, sensory quiet zones, sign language, and companion passes.
  - **Eco Footprint & Transit**: Reusable cup policies, free hydration refills, public transit shuttles, and carbon offset initiatives.

### 4. 👥 Squad Sync (`/squads`)
- **Collaborative Group Decision Engine**: Assemble your concert crew with customizable member profiles, budgets, and availability.
- **Squad Chemistry Score**: Example: **Squad Compatibility: 87%** with shared genre consensus (e.g., `Electronic: 100% agreement`).
- **Simulated Voting Matrix**: Group members cast votes on candidate events. Compare ticket costs across the whole crew and identify the group favorite.
- *Notice*: Uses local multi-profile simulation; no external backend sync required.

### 5. 💰 Night-Out Budget Planner (`/budget`)
- **Interactive Expense Allocator**: Calculates tickets, shared rides/fuel, shared hotel/stay, food, drinks, parking, official merch, and emergency cushion.
- **Visual Breakdown with Recharts**: Interactive donut chart and comparative bar charts displaying percentage allocations.
- **Budget Remaining & Warnings**: Alerts when per-person cost exceeds personal spending caps.
- **Actionable Money-Saving Suggestions**: Practical advice on carpooling, early bird presales, and festival transit shuttles.

### 6. 📅 Festival Schedule Builder (`/schedule`)
- **Timeline & Clash Detector**: Multi-day festival selector with artist set times and stage names.
- **Overlap Conflict Warning**: Highlights overlapping headliner sets automatically so you never get caught off guard.
- **Recharge Breaks**: Insert hydration and dinner break slots into your personal itinerary.
- **Print & Export**: Print-ready layout and downloadable JSON schedule format.

### 7. 🗺️ Crowd Mood & Grounds Map (`/festival-map`)
- **Interactive POI Map Canvas**: Locate Stages, Food Zones, Rest Lounges, Water Stations, Medical Assistance, Entry/Exit Gates, Accessibility Hubs, and Restrooms.
- **Clickable POI Flyout**: Displays estimated queue wait times, audio rig specs, and dining options.
- **Simulated Crowd Density Overlay**: Toggleable heatmaps labeled clearly as **Demo Simulation — Not Live Crowd Data**.

### 8. 💿 Artist Explorer & Spotlights (`/artists` & `/artist/:id`)
- Explore touring acts with genre filters and tour status.
- Dedicated artist pages with bios, origin, top tracks, and upcoming demo appearances.
- **Festival Prep Song Checklist**: Check off essential anthems, crowd chants, and deep cuts before the gig.
- **Historical Setlists**: Past tour setlists clearly labeled as historical reference data.

### 9. 🔔 Ticket Drop Radar (`/ticket-radar`)
- Track announced sale dates with live countdown timers.
- Configure local in-app reminders and browser notification alerts for general and presale ticket drops.

### 10. 🏆 Festival Quest (`/quests`)
- Gamified festival milestones with XP points and 5 progression levels (Level 1: Bedroom Listener → Level 5: Festival Legend).
- Specific challenges: *Complete Vibe DNA*, *Save First Festival*, *Build Schedule*, *Discover 5 Artists*, *Create a Squad*, *Explore 3 Genres*, *Zero Waste Wanderer*.
- Interactive celebration with confetti and personal moment note attachments.

### 11. 📸 Digital Memory Capsule (`/memories`)
- Visual digital concert scrapbook.
- Record attended events, 1-5 star ratings, best set highlights, and memorable quotes.
- Local photo upload with automatic HTML5 Canvas compression to optimize LocalStorage footprint.
- Export and print scrapbook memories.

### 12. 🎛️ Personal Music Dashboard (`/dashboard`)
- Welcoming personalized greeting based on time of day.
- Vibe DNA archetype card, quick stats summary, upcoming saved events watchlist, top algorithmic recommendations, active squad plans, budget summaries, and recent memories.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **Routing** | [React Router 7](https://reactrouter.com/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) (Custom Dark Neon Palette) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Analytics / Charts** | [Recharts 3](https://recharts.org/) |
| **Effects** | [Canvas Confetti](https://github.com/catdad/canvas-confetti) |
| **Persistence** | Browser `LocalStorage` via safe JSON service layer |

---

## 🎨 Design Direction

- **Dark Premium Background**: Deep charcoal canvas (`#0b0d14` / `#0f111a`)
- **Electric Accent Palette**: Neon Lime (`#ccff00`), Cyber Cyan (`#06b6d4`), Hot Pink (`#ec4899`), Electric Violet (`#a855f7`)
- **Editorial Typography**: Oversized bold headlines (`font-display font-black`)
- **Glassmorphism**: Selective frosted glass panels (`glass-panel`, `glass-card`) with neon rim glow (`shadow-glow-lime`, `shadow-glow-cyan`)
- **Music-Inspired Patterns**: Soundwave equalizer bars, concentric audio rings, and pulsing ambient light orbs

---

## 📂 Project Structure

```
concert-&-festival-finder/
├── public/
│   ├── _redirects             # Netlify SPA routing rules
│   └── favicon.svg
├── src/
│   ├── assets/                # Visual assets
│   ├── components/
│   │   ├── artists/           # Artist modals & spotlights
│   │   ├── common/            # Navbar, Footer, PageLoader
│   │   └── events/            # EventCard, EventDetailModal
│   ├── context/
│   │   └── AppContext.tsx     # Global application state
│   ├── data/
│   │   ├── mockArtists.ts     # Curated artists & setlists
│   │   ├── mockEvents.ts      # Curated festivals & club gigs
│   │   ├── mockQuests.ts      # Gamified quest milestones
│   │   ├── mockReviews.ts     # Sample community reviews
│   │   └── mockVenues.ts      # Ground maps & transit data
│   ├── features/
│   │   ├── access-guide/      # Accessibility Comfort Guide
│   │   ├── artist-detail/     # Standalone Artist Details page
│   │   ├── artist-explorer/   # Artist Explorer Catalog
│   │   ├── budget-planner/    # Night-Out Budget Calculator (Recharts)
│   │   ├── crowd-mood-map/    # Interactive Grounds & Density Map
│   │   ├── dashboard/         # Personal Music Dashboard
│   │   ├── discovery/         # Smart Event Discovery & Filters
│   │   ├── event-detail/      # Standalone Event Details page
│   │   ├── festival-quest/    # Quest Milestones & XP Badges
│   │   ├── festival-schedule/ # Schedule Builder & Clash Resolver
│   │   ├── home/              # Full-screen Hero Landing Page
│   │   ├── memory-capsule/    # Digital Concert Scrapbook
│   │   ├── preferences/       # User Settings & Backup Export
│   │   ├── reviews/           # Community Reviews
│   │   ├── saved-events/      # Saved Watchlist
│   │   ├── social-buddy/      # Event Buddies
│   │   ├── squad-sync/        # Collaborative Squad Sync
│   │   └── vibe-profile/      # Vibe DNA 8-Vector Quiz
│   ├── services/
│   │   ├── budgetCalculator.ts # Currency conversion & expense logic
│   │   ├── storageService.ts   # Safe LocalStorage persistence
│   │   └── vibeMatcher.ts      # Rule-based Vibe Match algorithm
│   ├── types/
│   │   └── index.ts           # TypeScript models & interfaces
│   ├── App.tsx                # App root, code-splitting & router
│   ├── index.css              # Custom Tailwind utilities & glow effects
│   └── main.tsx               # Entry point
├── vercel.json                # Vercel SPA rewrite configuration
├── package.json
└── README.md
```

---

## 🧭 Routes Map

| Route | Description |
|---|---|
| `/` | Full-Screen Hero Landing Page & Trending Experiences |
| `/discover` | Smart Event Discovery with Filters & Sorting |
| `/event/:id` | Deep-linkable Event Details, Tiers, Stages & Eco Info |
| `/artists` | Artist Explorer Catalog & Search |
| `/artist/:id` | Dedicated Artist Spotlight, Setlists & Prep Checklist |
| `/vibe-dna` | 8-Question Music Personality Discovery Quiz |
| `/dashboard` | Personal Music Dashboard & Saved Watchlist |
| `/squads` | Collaborative Squad Sync & Voting Matrix |
| `/budget` | Night-Out Budget Planner with Recharts Visualizations |
| `/schedule` | Festival Schedule Builder with Conflict Alerts |
| `/festival-map` | Interactive Grounds Map & Simulated Density Heatmap |
| `/ticket-radar` | Ticket On-Sale Early Warning Radar |
| `/quests` | Gamified Festival Quests & Level XP |
| `/memories` | Digital Concert Keepsake Scrapbook |
| `/accessibility-guide` | Inclusivity & Sensory Comfort Accommodations |
| `/profile` | User Preferences, Theme, Currency & Backup Export |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ or v20+ recommended.
- `npm` or `pnpm`

### Installation

```bash
git clone https://github.com/your-username/vybe-concert-finder.git
cd vybe-concert-finder
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

This compiles TypeScript and produces an optimized production build in `dist/` with automated route code-splitting.

### Previewing Production Build

```bash
npm run preview
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Set the Framework Preset to **Vite**.
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

> Note: The included `vercel.json` automatically configures single-page application (SPA) rewrites to prevent 404 errors on deep routes.

### Deploy to Netlify

1. Sign in to [Netlify](https://www.netlify.com/) and select **Add new site > Import an existing project**.
2. Select your GitHub repository.
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Click **Deploy Site**.

> Note: The included `public/_redirects` file automatically configures Netlify client-side routing.

---

## 🔒 Demo Data & Transparency Disclosure

- **Curated Demonstration Catalog**: All events, artists, venue specs, ticket tiers, and prices are curated demonstration data for portfolio evaluation.
- **Simulated Density Telemetry**: Displayed queue wait times and crowd heatmaps in the Crowd Mood Map illustrate simulated festival grounds scenarios.
- **Rule-Based Matching**: The **Vibe Match Score** uses a deterministic scoring model comparing user genre preferences, venue atmospheres, and budgets. It does not claim an opaque black-box AI model.
- **Local Simulation**: Squad Sync and Ticket Drop Radar operate locally within your browser session using `LocalStorage`.

---

## 📄 License

MIT License. Crafted with passion for live music culture.
