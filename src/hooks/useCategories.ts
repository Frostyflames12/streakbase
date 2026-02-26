// src/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useCategories() {
  const { user } = useAuth()

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*, activities(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  return { categories, isLoading, error }
}