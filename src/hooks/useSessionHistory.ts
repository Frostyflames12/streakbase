// src/hooks/useSessionHistory.ts
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import type { Session } from '../types/database'

const PAGE_SIZE = 10

type SessionWithActivity = Session & {
  activities: {
    name: string
  } | null
}

export function useSessionHistory() {
  const { user } = useAuth()
  const [page, setPage] = useState(0)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['sessionHistory', user?.id, page],
    queryFn: async () => {
      if (!user) throw new Error('No user')

      const from = 0
      const to = (page + 1) * PAGE_SIZE - 1

      const { data, error } = await supabase
        .from('sessions')
        .select('*, activities(name)')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      return data as SessionWithActivity[]
    },
    enabled: !!user,
  })

  const hasMore = (data?.length ?? 0) === (page + 1) * PAGE_SIZE

  const loadMore = () => {
    if (!isFetching && hasMore) setPage(prev => prev + 1)
  }

  return {
    sessions: data ?? [],
    isLoading,
    isFetching,
    hasMore,
    loadMore
  }
}