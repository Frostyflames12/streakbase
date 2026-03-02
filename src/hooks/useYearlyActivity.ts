// src/hooks/useYearlyActivity.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export function useYearlyActivity() {
  const { user } = useAuth();

  const { data: yearlyActivity, isLoading, error } = useQuery({
    queryKey: ["yearlyActivity", user?.id],
    queryFn: async () => {
      const oneYearAgo = new Date();
      oneYearAgo.setDate(oneYearAgo.getDate() - 365);
      const dateString = oneYearAgo.toLocaleDateString("en-CA");

      const { data, error } = await supabase
        .from("sessions")
        .select("date")
        .eq("user_id", user!.id)
        .gte("date", dateString)
        .order("date", { ascending: true });

      if (error) throw error;

      const counts: Record<string, number> = {};
      data.forEach((session) => {
        counts[session.date] = (counts[session.date] ?? 0) + 1;
      });

      return Object.entries(counts).map(([date, count]) => ({ date, count }));
    },
    enabled: !!user,
  });

  return { yearlyActivity, isLoading, error };
}