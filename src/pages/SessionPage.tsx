// src/pages/SessionPage.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useStreak } from "../hooks/useStreak";
import { TrashIcon } from "../components/Icons";

// --- Page-specific icons ---
const StopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-md">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function SessionPage() {
  const { activityId } = useParams<{ activityId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { updateStreakAfterSession } = useStreak();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const startedAtRef = useRef<Date>(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  async function handleStop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSaving(true);
    setError(null);

    const endedAt = new Date();

    try {
      const { error: sessionError } = await supabase.from("sessions").insert({
        activity_id: activityId,
        user_id: user!.id,
        started_at: startedAtRef.current.toISOString(),
        ended_at: endedAt.toISOString(),
        duration_seconds: elapsedSeconds,
        notes: notes,
        date: new Date().toLocaleDateString("en-CA"),
      });

      if (sessionError) throw sessionError;

      await updateStreakAfterSession();

      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["categories", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["weeklyActivity", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["yearlyActivity", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["activityDetails"] });
      queryClient.invalidateQueries({ queryKey: ["sessionHistory"] });

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSaving(false);
    }
  }

  function handleCancel() {
    if (elapsedSeconds > 10) {
      const confirm = window.confirm(
        "Are you sure you want to discard this session? It will not be saved.",
      );
      if (!confirm) return;
    }
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-orange-500/30">

      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[4000ms]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>

      <div className="relative w-full max-w-sm z-10 flex flex-col items-center animate-in fade-in duration-1000">

        {/* Status Pill */}
        <div className="mb-12 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-orange-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.2)]">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em]">Focus Mode Active</span>
        </div>

        {/* Timer */}
        <div className="mb-16 relative group cursor-default">
          <div className="absolute -inset-4 bg-orange-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000"></div>
          <span className="relative z-10 text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tabular-nums tracking-tighter font-mono drop-shadow-2xl select-none">
            {formatTime(elapsedSeconds)}
          </span>
        </div>

        {/* Notes */}
        <div className="w-full mb-8 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm"></div>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Log your thoughts..."
            className="relative w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-slate-200 placeholder:text-slate-600 text-sm leading-relaxed focus:outline-none focus:border-orange-500/30 transition-all resize-none h-32 shadow-xl"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl mb-6 text-xs text-center animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="w-full flex flex-col gap-4">
          <button
            onClick={handleStop}
            disabled={isSaving}
            className="group relative w-full h-16 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-lg shadow-[0_0_40px_-10px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_-15px_rgba(249,115,22,0.6)] transition-all transform active:scale-[0.98] disabled:opacity-50 overflow-hidden flex items-center justify-center gap-3"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <StopIcon />
                <span>Finish Session</span>
              </>
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 text-slate-500 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors py-4 opacity-70 hover:opacity-100"
          >
            <TrashIcon />
            Discard Session
          </button>
        </div>
      </div>
    </div>
  );
}