// src/hooks/useRegister.ts
import { useState } from 'react'
import { supabase } from '../lib/supabase'

type RegisterData = {
  username: string
  email: string
  password: string
  birthdate: string
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function register(data: RegisterData) {
    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Create auth user — we use autoConfirm so session is NOT created yet
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: undefined,
        }
      })

      if (signUpError) throw signUpError
      if (!signUpData.user) throw new Error('No user returned from signUp')

      // Step 2: Insert profile BEFORE signing in
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: signUpData.user.id,
          username: data.username,
          email: data.email,
          birthdate: data.birthdate,
        })

      if (profileError) throw profileError

      // Step 3: Now sign in — SIGNED_IN fires AFTER profile exists
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) throw signInError
       return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading, error }
}