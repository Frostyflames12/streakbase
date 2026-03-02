import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";



export function useWeeklyActivity() {

    const {user} = useAuth();
    

    const {data: weeklyActivity, isLoading, error} = useQuery({
        queryKey: ['weeklyActivity', user?.id],
        queryFn: async () => {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate()-7);
            const dateString = sevenDaysAgo.toLocaleDateString('en-CA')
            const {data, error} = await supabase
            .from('sessions')
            .select('date')
            .eq('user_id', user!.id)
            .gte('date', dateString)

              if (error) throw error
      return data
        },
        enabled: !!user,
    })

    return {weeklyActivity, isLoading, error}
}