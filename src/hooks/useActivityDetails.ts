// src/hooks/useActivityDetails.ts
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Activity, Session } from '../types/database'

const PAGE_SIZE = 10

type ActivityWithCategoryName = Activity & {
  categories: {
    name: string
  } | null
}

export function useActivityDetails(activityId: string | undefined) {
  const { user } = useAuth()
  const [page, setPage] = useState(0)

  const { data: activity, isLoading: isActivityLoading } = useQuery({
    queryKey: ['activityDetails', 'activity', activityId, user?.id],
    queryFn: async () => {
      if (!activityId || !user) throw new Error('Missing ID or User')

      const { data, error } = await supabase
        .from('activities')
        .select('*, categories(name)')
        .eq('id', activityId)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      return data as unknown as ActivityWithCategoryName
    },
    enabled: !!user && !!activityId,
  })

  const { data: sessions, isLoading: isSessionsLoading, isFetching } = useQuery({
    queryKey: ['activityDetails', 'sessions', activityId, user?.id, page],
    queryFn: async () => {
      if (!activityId || !user) throw new Error('Missing ID or User')

      const from = 0
      const to = (page + 1) * PAGE_SIZE - 1

      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('activity_id', activityId)
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .range(from, to)

      if (error) throw error
      return data as Session[]
    },
    enabled: !!user && !!activityId,
  })

  const { data: totalCount } = useQuery({
  queryKey: ['activityDetails', 'count', activityId, user?.id],
  queryFn: async () => {
    if (!activityId || !user) throw new Error('Missing ID or User')

    const { count, error } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('activity_id', activityId)
      .eq('user_id', user.id)

    if (error) throw error
    return count ?? 0
  },
  enabled: !!user && !!activityId,
})

  const hasMore = (sessions?.length ?? 0) === (page + 1) * PAGE_SIZE

  const loadMore = () => {
    if (!isFetching && hasMore) setPage(prev => prev + 1)
  }

 return {
  activity,
  sessions: sessions ?? [],
  totalCount: totalCount ?? 0,
  isLoading: isActivityLoading || isSessionsLoading,
  isFetching,
  hasMore,
  loadMore,
}
}