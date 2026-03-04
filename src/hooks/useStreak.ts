// src/hooks/useStreak.ts
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import type { Profile } from "../types/database";

export function useStreak() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  function getStreakUpdate(
    lastActiveDateStr: string | null,
    currentStreak: number,
    freezeTokens: number,
  ) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!lastActiveDateStr) {
      return {
        streak_count: 1,
        last_active_date: today.toLocaleDateString("en-CA"),
        freeze_tokens: freezeTokens,
      };
    }

    const lastActive = new Date(lastActiveDateStr);
    lastActive.setHours(0, 0, 0, 0);

    const daysDiff = Math.round(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff === 0) {
      return null;
    }

    if (daysDiff === 1) {
      const newStreak = currentStreak + 1;
      const newTokens =
        (newStreak === 7 || newStreak === 30) && freezeTokens < 2
          ? freezeTokens + 1
          : freezeTokens;

      return {
        streak_count: newStreak,
        last_active_date: today.toLocaleDateString("en-CA"),
        freeze_tokens: newTokens,
      };
    }

    if (freezeTokens > 0) {
      return {
        streak_count: currentStreak,
        last_active_date: today.toLocaleDateString("en-CA"),
        freeze_tokens: freezeTokens - 1,
      };
    }

    return {
      streak_count: 1,
      last_active_date: today.toLocaleDateString("en-CA"),
      freeze_tokens: 0,
    };
  }

  async function updateStreakAfterSession() {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("streak_count, last_active_date, freeze_tokens")
      .eq("id", user!.id)
      .single();

    if (profileError) throw profileError;

    const update = getStreakUpdate(
      profile.last_active_date,
      profile.streak_count,
      profile.freeze_tokens,
    );

    if (update) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(update)
        .eq("id", user!.id);

      if (updateError) throw updateError;
    }
  }

  function checkMissedDay(profile: Profile) {
    if (!profile || !profile.last_active_date) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActive = new Date(profile.last_active_date);
    lastActive.setHours(0, 0, 0, 0);

    const daysDiff = Math.round(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff < 2) return;

    const update =
      profile.freeze_tokens > 0
        ? {
            freeze_tokens: profile.freeze_tokens - 1,
            last_active_date: new Date(
              today.getTime() - 86400000,
            ).toLocaleDateString("en-CA"),
          }
        : {
            streak_count: 0,
            last_active_date: profile.last_active_date,
          };

    supabase
      .from("profiles")
      .update(update)
      .eq("id", user!.id)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      });
  }

  return { updateStreakAfterSession, checkMissedDay };
}