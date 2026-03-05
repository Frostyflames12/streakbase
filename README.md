# 🔥 StreakBase

**StreakBase** is a personal productivity app built around streak-based motivation. Unlike passive habit trackers that use checkboxes, StreakBase requires *proof of work* — you run a timer, do the actual work, and the app tracks it.

> Built by [@Frostyflames12](https://github.com/Frostyflames12)

---

## 🌐 Live Demo

> **[streakbase.vercel.app](https://streakbase-fawn.vercel.app/)** 

---

## 💡 Why I Built This

I have ADHD and streak systems genuinely motivate me — I have a 900+ day Duolingo streak as proof. I wanted a version of that for everything else: coding practice, studying, working out, creative projects. So I built one.

---

## ✨ Features

- **Timer-based sessions** — you actually do the work, the app knows it
- **Streak tracking** — daily streaks with missed day detection
- **Freeze tokens** — awarded at 7 and 30 day milestones, protect your streak when life happens
- **Activity heatmap** — visualize your consistency over the past 6 months
- **Session history** — paginated log of every session across all activities
- **Session notes** — log thoughts during or after a session, edit them later
- **Categories & activities** — organize your work however makes sense to you
- **Quick Start** — jump back into your most recent activities from the dashboard
- **Level system** — gamified progression based on total sessions completed

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend & Database | Supabase (Auth + PostgreSQL) |
| Data Fetching | TanStack React Query |
| Routing | React Router v6 |
| Validation | Zod |
| Heatmap | react-calendar-heatmap |

---

## 🗄️ Database Schema

```
profiles       → user account + streak data + freeze tokens
categories     → user-defined groupings (e.g. "Work", "Fitness")
activities     → individual trackable items within a category
sessions       → completed timer sessions with duration, notes, and date
```

Row Level Security (RLS) is enabled on all tables — users can only access their own data.

---

## 🚀 Running Locally

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

```bash
# Clone the repo
git clone https://github.com/Frostyflames12/streakbase.git
cd streakbase

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key in .env

# Start the dev server
npm run dev
```

### Environment Variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Structure

```
src/
├── context/        # Auth context (session management)
├── hooks/          # All data fetching and business logic
├── pages/          # Route-level page components
├── components/     # Shared UI components (BottomNav, Icons, PageBackground, ConfirmModal)
├── lib/            # Supabase client + shared utilities
├── schemas/        # Zod validation schemas
└── types/          # TypeScript database types
```

---

## 🎨 Design System

Dark-themed "Cinematic Glass" aesthetic:
- **Background**: `bg-slate-950` with animated orange/blue ambient blobs and noise texture overlay
- **Cards**: Glassmorphism — `bg-slate-900/60 backdrop-blur-xl border border-white/10`
- **Accent**: Orange-500 / Amber-400 gradient
- **Typography**: `font-black tracking-tight` headers, `font-mono tabular-nums` for data
- **Animations**: Page entry via `animate-in slide-in-from-bottom-5 fade-in`, staggered list delays

---

## 📄 License

MIT
