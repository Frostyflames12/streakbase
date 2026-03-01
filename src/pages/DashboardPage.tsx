// src/pages/DashboardPage.tsx
import BottomNav from "../components/BottomNav";
import { useProfile } from "../hooks/useProfile";
import { useCategories } from "../hooks/useCategories";
import { useStreak } from "../hooks/useStreak";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type {
  CategoryWithActivities,
  ActivityWithSessions,
} from "../types/database";

const FlameIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]"
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

export default function DashboardPage() {
  const { profile, isLoading: profileLoading } = useProfile();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { checkMissedDay } = useStreak();
  const navigate = useNavigate();

  const isLoading = profileLoading || categoriesLoading;

  useEffect(() => {
    if (!profile) return;
    checkMissedDay(profile);
  }, [profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen bg-[#0f172a] pb-24">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-md mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <FlameIcon />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Streak
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">
                Base
              </span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            Hey,{" "}
            <span className="text-white font-bold">{profile?.username}</span> 👋
          </p>
        </div>

        {/* Streak Hero Card */}
        <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-6 text-center">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
            Current Streak
          </p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-amber-500">
              {profile?.streak_count ?? 0}
            </span>
            <span className="text-4xl">🔥</span>
          </div>
          <p className="text-slate-400 text-sm">
            {profile?.streak_count === 1
              ? "1 day"
              : `${profile?.streak_count ?? 0} days`}{" "}
            and counting
          </p>

          {/* Freeze Tokens */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-2">
            <span className="text-slate-400 text-sm">Freeze tokens:</span>
            <div className="flex gap-1">
              {[...Array(2)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${i < (profile?.freeze_tokens ?? 0) ? "opacity-100" : "opacity-20"}`}
                >
                  🧊
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Categories + Activities */}
        <div className="flex flex-col gap-6">
          {!categories || categories.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 text-center">
              <p className="text-slate-400 mb-2">No categories yet.</p>
              <button
                onClick={() => navigate("/categories")}
                className="text-orange-400 hover:text-orange-300 font-bold text-sm transition-all"
              >
                Create your first one →
              </button>
            </div>
          ) : (
            categories.map((category: CategoryWithActivities) => (
              <div key={category.id}>
                <h2 className="text-slate-300 text-xs font-bold uppercase tracking-widest ml-1 mb-3">
                  {category.name}
                </h2>
                <div className="flex flex-col gap-3">
                  {category.activities?.length === 0 ? (
                    <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/10">
                      <p className="text-slate-500 text-sm">
                        No activities in this category.
                      </p>
                    </div>
                  ) : (
                    category.activities?.map(
                      (activity: ActivityWithSessions) => (
                        <div
                          key={activity.id}
                          className="bg-slate-800/40 backdrop-blur-2xl rounded-2xl p-5 border border-white/10 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-white font-semibold">
                              {activity.name}
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              {activity.sessions.length === 0 ? (
                                "No sessions yet"
                              ) : (
                                <>
                                  Last:{" "}
                                  {formatDuration(
                                    activity.sessions[
                                      activity.sessions.length - 1
                                    ].duration_seconds ?? 0,
                                  )}
                                  {" · "}
                                  Best:{" "}
                                  {formatDuration(
                                    Math.max(
                                      ...activity.sessions.map(
                                        (s) => s.duration_seconds ?? 0,
                                      ),
                                    ),
                                  )}
                                </>
                              )}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate(`/session/${activity.id}`)}
                            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold text-sm px-5 py-2 rounded-xl shadow-[0_5px_15px_-5px_rgba(249,115,22,0.5)] transition-all active:scale-[0.98]"
                          >
                            Start
                          </button>
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