// src/pages/HistoryPage.tsx
import { useNavigate } from "react-router-dom";
import { useSessionHistory } from "../hooks/useSessionHistory";
import BottomNav from "../components/BottomNav";

const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { sessions, isLoading, isFetching, hasMore, loadMore } = useSessionHistory();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100 font-sans selection:bg-orange-500/30">

      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]" />
        <div className="absolute top-[20%] right-[-20%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative max-w-md mx-auto px-5 pt-8 animate-in slide-in-from-bottom-5 duration-700 fade-in">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all hover:scale-105"
          >
            <ArrowLeftIcon />
          </button>
          <div>
            <p className="text-[10px] text-orange-500/80 font-bold uppercase tracking-widest mb-1">All Activity</p>
            <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Session History
            </h1>
          </div>
        </div>

        {/* Session Count */}
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-1 mb-4">
          {sessions.length} sessions loaded
        </p>

        {/* Session List */}
        {sessions.length === 0 ? (
          <div className="bg-slate-900/30 rounded-2xl p-8 border border-dashed border-slate-700 text-center">
            <p className="text-slate-500 text-sm">No sessions yet.</p>
            <p className="text-slate-600 text-xs mt-1">Complete your first session to see it here.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {sessions.map((session, index) => (
              <div
                key={session.id}
                className="group relative bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-md rounded-2xl p-1 border border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                <div className="relative z-10 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {formatDate(session.date)}
                    </span>
                    <div className="flex items-center gap-1.5 bg-slate-950/50 px-2.5 py-1 rounded-md border border-slate-700/50">
                      <ClockIcon />
                      <span className="text-sm font-bold text-orange-400 font-mono">
                        {formatDuration(session.duration_seconds ?? 0)}
                      </span>
                    </div>
                  </div>

                  {/* Activity Name */}
                  <p className="text-sm font-semibold text-slate-300 mb-1">
                    {session.activities?.name ?? "Unknown Activity"}
                  </p>

                  {session.notes && (
                    <div className="mt-2 text-sm text-slate-400 pl-3 border-l-2 border-slate-700/50 italic">
                      "{session.notes}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={loadMore}
              disabled={isFetching}
              className="px-6 py-3 rounded-xl bg-slate-800/60 border border-white/5 text-slate-300 text-sm font-bold hover:bg-slate-700/60 hover:text-white hover:border-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetching ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {!hasMore && sessions.length > 0 && (
          <p className="text-center text-slate-600 text-xs mt-6 pb-4">You've reached the beginning.</p>
        )}

      </div>
      <BottomNav />
    </div>
  );
}