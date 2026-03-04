// src/pages/DashboardPage.tsx
import BottomNav from "../components/BottomNav";
import { useWeeklyActivity } from "../hooks/useWeeklyActivity";
import { useProfile } from "../hooks/useProfile";
import { useCategories } from "../hooks/useCategories";
import { useStreak } from "../hooks/useStreak";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type {
  CategoryWithActivities,
  ActivityWithSessions,
} from "../types/database";

// --- Icons ---
const FlameIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-8 h-8 ${className}`}
  >
    <path
      d="M8.5 14.5C7.5 13 7 11.5 7 9.5C7 6 9.5 3 12 2C14.5 3 17 6 17 9.5C17 11.5 16.5 13 15.5 14.5C17 15.5 18 17.5 18 19.5C18 21.5 16 23 14 23C13 23 11.5 22 12 20C12.5 18 14 16.5 14.5 15.5C13.5 15 12 14 10.5 15.5C9 17 8.5 18.5 8 20C7.5 21.5 6 23 4 23C2 23 0 21.5 0 19.5C0 17.5 1 15.5 2.5 14.5C1.5 13 1 11.5 1 9.5C1 4 6 0 12 0C18 0 23 4 23 9.5C23 11.5 22.5 13 21.5 14.5C23 15.5 24 17.5 24 19.5C24 22.5 21 24 18 24C15.5 24 14 22.5 14 21.5C14 22.5 12.5 24 10 24C7 24 4 22.5 4 19.5C4 17.5 5 15.5 6.5 14.5C5.5 13 5 11.5 5 9.5C5 6.5 7 4.5 8.5 3.5C7.5 5.5 7 7.5 7 9.5C7 11.5 7.5 13 8.5 14.5Z"
      fill="url(#flameGradient_dashboard)"
    />
    <defs>
      <linearGradient
        id="flameGradient_dashboard"
        x1="12"
        y1="0"
        x2="12"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#f97316" />
        <stop offset="1" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
  </svg>
);

const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5V19L19 12L8 5Z" />
  </svg>
);

const TrophyIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const BoltIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

export default function DashboardPage() {
  const { profile, isLoading: profileLoading } = useProfile();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { checkMissedDay } = useStreak();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { weeklyActivity } = useWeeklyActivity();

  const isLoading = profileLoading || categoriesLoading;

  // --- Logic: Weekly Dots ---
  const todayStr = new Date().toLocaleDateString("en-CA");
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    return date.toLocaleDateString("en-CA");
  });
  const activeDates = new Set(weeklyActivity?.map((s) => s.date));

  // --- Logic: Quick Start (Most Recent) ---
  const recentActivities = categories
    ? categories
        .flatMap((cat) => cat.activities || [])
        .filter((act) => act.sessions && act.sessions.length > 0)
        .sort((a, b) => {
          const lastA = new Date(
            a.sessions[a.sessions.length - 1].date,
          ).getTime();
          const lastB = new Date(
            b.sessions[b.sessions.length - 1].date,
          ).getTime();
          return lastB - lastA;
        })
        .slice(0, 2)
    : [];

  useEffect(() => {
    if (!profile) return;
    checkMissedDay(profile);
  }, [profile]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col gap-4 items-center justify-center">
        <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-orange-500/20 blur-sm" />
        </div>
      </div>
    );
  }

  function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100 font-sans selection:bg-orange-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]" />
        <div className="absolute top-[20%] right-[-20%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen" />
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div
        className={`relative max-w-md mx-auto px-5 pt-8 transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-orange-500/20 blur-md rounded-full group-hover:bg-orange-500/40 transition-colors" />
              <FlameIcon className="relative drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight italic">
              STREAK
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">
                BASE
              </span>
            </h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
              Welcome back
            </span>
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
              <span className="text-xs font-bold text-white max-w-[100px] truncate">
                 {profile?.username}
              </span>
              <span className="animate-wave text-sm">👋</span>
            </div>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative group mb-8 perspective-1000">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2rem] opacity-30 blur group-hover:opacity-50 transition duration-500"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-[1.8rem] p-8 border border-white/10 shadow-2xl overflow-hidden group-hover:-translate-y-1 transition-transform duration-300">
             {/* Dynamic background shine */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              {/* Streak Count */}
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                 Current Streak
                 <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              </p>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 leading-none tracking-tighter drop-shadow-2xl">
                  {profile?.streak_count ?? 0}
                </span>
                <div className="pb-4 animate-[bounce_2s_infinite]">
                  <span className="text-5xl filter drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]">
                    🔥
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-sm font-medium">
                {profile?.streak_count === 1 ? "Day" : "Days"} on fire
              </p>

              {/* Weekly Dots */}
              <div className="mt-8 flex justify-between w-full px-2 border-t border-white/5 pt-6">
                {last7Days.map((day) => {
                  const isToday = day === todayStr;
                  return (
                    <div key={day} className="flex flex-col items-center gap-2 group/day">
                      <span
                        className={`text-[9px] font-bold uppercase transition-colors ${isToday ? "text-orange-400" : "text-slate-600 group-hover/day:text-slate-400"}`}
                      >
                        {new Date(day + "T12:00:00")
                          .toLocaleDateString("en-US", { weekday: "short" })
                          .charAt(0)}
                      </span>
                      <div
                        className={`
                          relative flex items-center justify-center w-3.5 h-3.5 rounded-full transition-all duration-500
                          ${isToday ? "ring-2 ring-orange-500/50 ring-offset-2 ring-offset-slate-900" : ""}
                          ${activeDates.has(day) 
                            ? "bg-gradient-to-tr from-orange-600 to-amber-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] scale-110" 
                            : "bg-slate-800 group-hover/day:bg-slate-700"}
                        `}
                      >
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Freeze Tokens */}
              <div className="mt-6 w-full bg-slate-950/40 rounded-xl p-3 border border-white/5 flex items-center justify-between px-4 hover:border-blue-500/20 transition-colors">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                   <span className="text-blue-400">●</span> Freeze Tokens
                </span>
                <div className="flex gap-1.5">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-sm border transition-all duration-300 ${i < (profile?.freeze_tokens ?? 0) ? "bg-blue-500/20 border-blue-400/30 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.2)]" : "bg-slate-800/30 border-slate-800 text-slate-700 grayscale"}`}
                    >
                      🧊
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Quick Start Section --- */}
        {recentActivities.length > 0 && (
          <div className="mb-8 animate-in slide-in-from-bottom-3 duration-500 delay-100">
            <h2 className="flex items-center gap-2 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 pl-2 opacity-80">
              <BoltIcon /> Quick Start
            </h2>
            <div className="grid gap-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => navigate(`/activity/${activity.id}`)}
                  className="group relative bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-md rounded-2xl p-1 border border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-1 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                  <div className="flex items-center justify-between p-4 relative z-10">
                    <div className="flex-1 min-w-0 mr-4">
                      <span className="text-orange-500/70 text-[9px] font-bold uppercase tracking-widest mb-1 block">
                        Recent Activity
                      </span>
                      <h3 className="text-white font-bold text-lg truncate group-hover:text-orange-100 transition-colors">
                        {activity.name}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/session/${activity.id}`);
                      }}
                      className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-full text-white shadow-lg shadow-orange-900/20 group-hover:shadow-orange-500/40 group-hover:scale-110 transition-all duration-300 active:scale-95"
                    >
                      <PlayIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Categories & Activities --- */}
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700 delay-200">
          {!categories || categories.length === 0 ? (
            <div className="bg-slate-900/30 backdrop-blur-sm rounded-[2rem] p-10 border-2 border-dashed border-slate-800 text-center flex flex-col items-center gap-4 group hover:border-slate-700 transition-colors">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                📂
              </div>
              <div>
                <p className="text-slate-300 font-bold mb-1">Your dashboard is empty.</p>
                <p className="text-slate-500 text-xs">Start building your streak today.</p>
              </div>
              <button
                onClick={() => navigate("/categories")}
                className="mt-2 bg-slate-800 hover:bg-white hover:text-slate-950 text-white border border-slate-700 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2"
              >
                <PlusIcon />
                Create First Category
              </button>
            </div>
          ) : (
            categories.map((category: CategoryWithActivities) => (
              <div
                key={category.id}
                className="relative"
              >
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                   <h2 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {category.name}
                  </h2>
                  <div className="h-[1px] flex-1 bg-slate-800/50"></div>
                </div>

                <div className="grid gap-3">
                  {category.activities?.length === 0 ? (
                    <div className="bg-slate-900/20 rounded-xl p-4 border border-dashed border-slate-800/50 text-center">
                      <p className="text-slate-600 text-xs italic">
                        No activities in this category.
                      </p>
                    </div>
                  ) : (
                    category.activities?.map(
                      (activity: ActivityWithSessions) => (
                        <div
                          key={activity.id}
                          onClick={() => navigate(`/activity/${activity.id}`)}
                          className="group relative bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-md rounded-2xl p-1 border border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                          <div className="flex items-center justify-between p-4 relative z-10">
                            <div className="flex-1 min-w-0 mr-4">
                              <h3 className="text-white font-bold text-lg truncate group-hover:text-orange-100 transition-colors">
                                {activity.name}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {activity.sessions.length > 0 ? (
                                  <>
                                    <div className="flex items-center gap-1.5 bg-slate-950/50 px-2.5 py-1 rounded-md border border-slate-700/50">
                                      <ClockIcon />
                                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                                        Last
                                      </span>
                                      <span className="text-[10px] font-bold text-slate-300 font-mono">
                                        {formatDuration(
                                          activity.sessions[
                                            activity.sessions.length - 1
                                          ].duration_seconds ?? 0,
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-slate-950/50 px-2.5 py-1 rounded-md border border-slate-700/50">
                                      <TrophyIcon />
                                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                                        Best
                                      </span>
                                      <span className="text-[10px] font-bold text-amber-400 font-mono">
                                        {formatDuration(
                                          Math.max(
                                            ...activity.sessions.map(
                                              (s) => s.duration_seconds ?? 0,
                                            ),
                                          ),
                                        )}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-xs text-slate-600 font-medium">
                                    No sessions yet
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/session/${activity.id}`);
                              }}
                              className="relative flex items-center justify-center w-10 h-10 bg-slate-800 hover:bg-orange-500 rounded-full text-slate-400 hover:text-white border border-slate-700 hover:border-orange-400 transition-all duration-300 active:scale-90"
                            >
                              <PlayIcon />
                            </button>
                          </div>
                        </div>
                      ),
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}