// src/pages/HistoryPage.tsx
import { useNavigate } from "react-router-dom";
import { useSessionHistory } from "../hooks/useSessionHistory";
import BottomNav from "../components/BottomNav";
import PageBackground from "../components/PageBackground";
import { ArrowLeftIcon, ClockIcon, HistoryIcon } from "../components/Icons";
import { formatDuration, formatDate } from "../lib/utils";

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default function HistoryPage() {
  const navigate = useNavigate();
  const { sessions, isLoading, isFetching, hasMore, loadMore } = useSessionHistory();

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

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100 font-sans selection:bg-orange-500/30">
      <PageBackground />

      <div className="relative max-w-md mx-auto px-5 pt-8 animate-in slide-in-from-bottom-5 duration-700 fade-in">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all hover:scale-105"
          >
            <ArrowLeftIcon />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-orange-500 shadow-lg">
              <HistoryIcon size={24} />
            </div>
            <div>
              <p className="text-[10px] text-orange-500/80 font-bold uppercase tracking-widest mb-0.5">Global Log</p>
              <h1 className="text-2xl font-black tracking-tight text-white">Session History</h1>
            </div>
          </div>
        </div>

        {/* Session Count Badge */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Recent Entries</span>
          <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-900/50 border border-white/5 px-2 py-1 rounded-md">
            {sessions.length} Loaded
          </span>
        </div>

        {/* Session List */}
        {sessions.length === 0 ? (
          <div className="bg-slate-900/30 rounded-[2rem] p-10 border-2 border-dashed border-slate-800 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600 mb-3">
              <HistoryIcon size={24} />
            </div>
            <p className="text-slate-400 font-medium">No sessions recorded yet.</p>
            <p className="text-slate-600 text-xs mt-1">Complete your first session to see it here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <div
                key={session.id}
                className="group relative bg-slate-900/40 hover:bg-slate-800/60 backdrop-blur-md rounded-2xl p-1 border border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                <div className="relative z-10 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold text-base truncate pr-4 group-hover:text-orange-100 transition-colors">
                      {session.activities?.name ?? "Unknown Activity"}
                    </h3>
                    <div className="shrink-0 flex items-center gap-1.5 bg-slate-950/50 px-2.5 py-1 rounded-md border border-slate-700/50">
                      <ClockIcon size={14} />
                      <span className="text-xs font-bold text-orange-400 font-mono">
                        {formatDuration(session.duration_seconds ?? 0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <CalendarIcon />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {formatDate(session.date)}
                      </span>
                    </div>
                  </div>
                  {session.notes && (
                    <div className="mt-3 text-xs text-slate-400 pl-3 border-l-2 border-slate-700/50 italic bg-slate-950/20 py-2 pr-2 rounded-r-lg">
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
          <div className="mt-8 flex justify-center pb-4">
            <button
              onClick={loadMore}
              disabled={isFetching}
              className="px-8 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 hover:text-white hover:border-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isFetching ? "Loading..." : "Load More History"}
            </button>
          </div>
        )}

        {!hasMore && sessions.length > 0 && (
          <div className="mt-8 pb-4 flex items-center justify-center gap-2 opacity-50">
            <div className="h-[1px] w-12 bg-slate-800"></div>
            <p className="text-center text-slate-600 text-[10px] uppercase tracking-widest">End of Log</p>
            <div className="h-[1px] w-12 bg-slate-800"></div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}