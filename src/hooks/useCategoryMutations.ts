// src/hooks/useCategoryMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useCategoryMutations() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['categories', user?.id] })
  }

  // --- CATEGORY MUTATIONS ---

  const createCategory = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase
        .from('categories')
        .insert({ name, user_id: user!.id })

      if (error) throw error
    },
    onSuccess: invalidateCategories,
  })

  const deleteCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error
    },
    onSuccess: invalidateCategories,
  })

  // --- ACTIVITY MUTATIONS ---

  const createActivity = useMutation({
    mutationFn: async ({ name, categoryId }: { name: string; categoryId: string }) => {
      const { error } = await supabase
        .from('activities')
        .insert({ name, category_id: categoryId, user_id: user!.id })

      if (error) throw error
    },
    onSuccess: invalidateCategories,
  })

  const deleteActivity = useMutation({
    mutationFn: async (activityId: string) => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)

      if (error) throw error
    },
    onSuccess: invalidateCategories,
  })

  return { createCategory, deleteCategory, createActivity, deleteActivity }
}