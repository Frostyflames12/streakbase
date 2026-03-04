// src/pages/ActivityDetailsPage.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivityDetails } from "../hooks/useActivityDetails";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import BottomNav from "../components/BottomNav";

// --- Icons ---
const PlayIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5V19L19 12L8 5Z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v5h5" />
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

// --- Helpers ---
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

export default function ActivityDetailsPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activity, sessions, isLoading } = useActivityDetails(activityId);

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editedNotes, setEditedNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleEditClick(sessionId: string, currentNotes: string | null) {
    setEditingSessionId(sessionId);
    setEditedNotes(currentNotes ?? "");
  }

  function handleCancel() {
    setEditingSessionId(null);
    setEditedNotes("");
  }

  async function handleSave(sessionId: string) {
    setIsSaving(true);
    const { error } = await supabase
      .from("sessions")
      .update({ notes: editedNotes || null })
      .eq("id", sessionId);

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["activityDetails"] });
      queryClient.invalidateQueries({ queryKey: ["sessionHistory"] });
      setEditingSessionId(null);
      setEditedNotes("");
    }
    setIsSaving(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-orange-500 animate-spin" />
      </div>
    );
  }

  const totalSessions = sessions?.length ?? 0;
  const personalBest = sessions && sessions.length > 0
    ? Math.max(...sessions.map((s) => s.duration_seconds ?? 0))
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100 font-sans selection:bg-orange-500/30">

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]" />
        <div className="absolute top-[20%] right-[-20%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative max-w-md mx-auto px-5 pt-8 animate-in slide-in-from-bottom-5 duration-700 fade-in">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all hover:scale-105"
          >
            <ArrowLeftIcon />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              <p className="text-[10px] text-orange-500/80 font-bold uppercase tracking-widest">
                {activity?.categories?.name || "Category"}
              </p>
            </div>
            <h1 className="text-3xl font-black tracking-tight truncate">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                {activity?.name}
              </span>
            </h1>
          </div>
        </div>

        {/* Hero Card: Start Session */}
        <div className="relative group mb-8 cursor-pointer" onClick={() => navigate(`/session/${activityId}`)}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2rem] opacity-30 blur group-hover:opacity-50 transition duration-500"></div>
          <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-[1.8rem] p-8 border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-4 group-hover:-translate-y-1 transition-transform duration-300">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 bg-orange-500/10 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="relative z-10 w-20 h-20 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-900/40 group-hover:scale-110 transition-transform duration-300">
              <PlayIcon className="w-8 h-8 ml-1" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-1">Start Session</h2>
              <p className="text-slate-400 text-sm">Ready to crush it?</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <ClockIcon />
            </div>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Sessions</span>
            <span className="text-3xl font-black text-white">{totalSessions}</span>
          </div>
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity text-amber-500">
              <TrophyIcon />
            </div>
            <span className="text-amber-500/80 text-[10px] font-bold uppercase tracking-wider">Personal Best</span>
            <span className="text-3xl font-black text-white">
              {personalBest > 0 ? formatDuration(personalBest) : "—"}
            </span>
          </div>
        </div>

        {/* Session History */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-[0.2em] pl-2">
            <HistoryIcon /> History
          </h2>

          {totalSessions === 0 ? (
            <div className="bg-slate-900/30 rounded-2xl p-8 border border-dashed border-slate-700 text-center">
              <p className="text-slate-500 text-sm">No sessions yet.</p>
              <p className="text-slate-600 text-xs mt-1">Start your first session above!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {sessions?.map((session, index) => {
                const isEditing = editingSessionId === session.id;

                return (
                  <div
                    key={session.id}
                    className="group relative bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-md rounded-2xl p-1 border border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                    <div className="relative z-10 p-4">
                      {/* Top row: date, duration, edit button */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {formatDate(session.date)}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-slate-950/50 px-2.5 py-1 rounded-md border border-slate-700/50">
                            <ClockIcon />
                            <span className="text-sm font-bold text-orange-400 font-mono">
                              {formatDuration(session.duration_seconds ?? 0)}
                            </span>
                          </div>
                          {!isEditing && (
                            <button
                              onClick={() => handleEditClick(session.id, session.notes)}
                              className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 flex items-center justify-center text-slate-400 hover:text-orange-400 hover:border-orange-500/40 transition-all"
                            >
                              <EditIcon />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Notes: view mode or edit mode */}
                      {isEditing ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={editedNotes}
                            onChange={(e) => setEditedNotes(e.target.value)}
                            placeholder="Add a note..."
                            className="w-full bg-slate-900/60 border border-slate-600/50 focus:border-orange-500/50 rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500/30 resize-none h-24 transition-all"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(session.id)}
                              disabled={isSaving}
                              className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                            >
                              {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={handleCancel}
                              disabled={isSaving}
                              className="flex-1 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        session.notes && (
                          <div className="mt-2 text-sm text-slate-300 pl-3 border-l-2 border-slate-700/50 italic">
                            "{session.notes}"
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}