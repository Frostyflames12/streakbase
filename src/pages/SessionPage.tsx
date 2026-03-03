// src/pages/SessionPage.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useStreak } from "../hooks/useStreak";

// --- Icons ---
const StopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="2" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
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

  // Start Timer
  useEffect(() => {
    // Prevent accidental navigation away
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
      // Step 1: Save session
      const { error: sessionError } = await supabase.from("sessions").insert({
        activity_id: activityId,
        user_id: user!.id,
        started_at: startedAtRef.current.toISOString(),
        ended_at: endedAt.toISOString(),
        duration_seconds: elapsedSeconds,
        notes: notes,
        date: new Date().toLocaleDateString("en-CA"), // Uses local date
      });

      if (sessionError) throw sessionError;

      // Step 2: Update streak logic
      await updateStreakAfterSession();

      // Step 3: Refresh data
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["categories", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["weeklyActivity", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["yearlyActivity", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["activityDetails"] })
      
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSaving(false);
      // Restart timer if it failed? Optional. For now, we leave it stopped.
    }
  }

  function handleCancel() {
    // Safety check: Don't let them delete > 10 seconds of work without asking
    if (elapsedSeconds > 10) {
      const confirm = window.confirm("Are you sure you want to discard this session? It will not be saved.");
      if (!confirm) return;
    }
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* --- Ambient Pulse Background --- */}
      {/* The 'animate-pulse' gives it a breathing effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none animate-pulse duration-[3000ms]" />
      
      <div className="relative w-full max-w-sm z-10 flex flex-col items-center">
        
        {/* Status Pill */}
        <div className="mb-10 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">
          • Focus Mode Active
        </div>

        {/* --- Main Timer --- */}
        <div className="mb-12 relative">
            {/* Glowing blur behind numbers */}
            <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full opacity-50"></div>
            <span className="relative z-10 text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tabular-nums tracking-tight font-mono drop-shadow-2xl">
                {formatTime(elapsedSeconds)}
            </span>
        </div>

        {/* --- Notes Input --- */}
        <div className="w-full mb-8 group">
          <div className="relative">
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note about this session..."
              className="w-full bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all resize-none h-32 text-sm leading-relaxed"
            />
            {/* Subtle corner accent */}
            <div className="absolute bottom-3 right-3 pointer-events-none">
                 <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-slate-700">
                    <path d="M10 10L0 10L10 0V10Z" fill="currentColor"/>
                 </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* --- Controls --- */}
        <div className="w-full flex flex-col gap-3">
          {/* Main Action: Stop & Save */}
          <button
            onClick={handleStop}
            disabled={isSaving}
            className="group relative w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden flex items-center justify-center gap-2"
          >
            {isSaving ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <StopIcon />
                    <span>Finish Session</span>
                </>
            )}
          </button>

          {/* Secondary Action: Discard */}
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-colors text-sm font-medium"
          >
            <TrashIcon />
            Discard
          </button>
        </div>

      </div>
    </div>
  );
}