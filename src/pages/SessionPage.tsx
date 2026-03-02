// src/pages/SessionPage.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useStreak } from "../hooks/useStreak";

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

  const startedAtRef = useRef<Date>(new Date());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
        date: new Date().toLocaleDateString("en-CA"),
      });

      if (sessionError) throw sessionError;

      // Step 2: Update streak
      await updateStreakAfterSession();

      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["categories", user?.id] });
      queryClient.invalidateQueries({ queryKey: ['weeklyActivity', user?.id] })
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
            Session in Progress
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Stay focused. You've got this.
          </p>

          {/* Timer Display */}
          <div className="mb-10">
            <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-amber-500 tabular-nums">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Stop Button */}
          <button
            onClick={handleStop}
            disabled={isSaving}
            className="group relative w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold text-lg shadow-[0_10px_20px_-10px_rgba(249,115,22,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden"
          >
            <span className="relative z-10">
              {isSaving ? "Saving..." : "Stop Session"}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />
          </button>

          <button
            onClick={() => navigate("/")}
            className="mt-4 text-slate-500 hover:text-slate-300 text-sm transition-all"
          >
            Cancel (session won't be saved)
          </button>
        </div>
      </div>
    </div>
  );
}