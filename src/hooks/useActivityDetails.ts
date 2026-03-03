// src/hooks/useActivityDetails.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Activity, Session } from '../types/database'

type ActivityWithCategoryName = Activity & {
  categories: {
    name: string
  } | null 
}

export function useActivityDetails(activityId: string | undefined) {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['activityDetails', activityId, user?.id],
    queryFn: async () => {
      if (!activityId || !user) throw new Error('Missing ID or User')


      const { data: activityData, error: activityError } = await supabase
        .from('activities')
        .select('*, categories(name)')
        .eq('id', activityId)
        .eq('user_id', user.id)
        .single()

      if (activityError) throw activityError

     
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('activity_id', activityId)
        .eq('user_id', user.id)
        .order('started_at', { ascending: false }) 

      if (sessionError) throw sessionError

      return {
        activity: activityData as unknown as ActivityWithCategoryName,
        sessions: sessionData as Session[]
      }
    },
    enabled: !!user && !!activityId,
  })

  return { 
    activity: data?.activity, 
    sessions: data?.sessions, 
    isLoading, 
    error 
  }
}