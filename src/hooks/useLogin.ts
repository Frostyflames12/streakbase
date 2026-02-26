import { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { loginSchema, type LoginFormData } from '../schemas/userSchema'

type LoginState = {
  formData: LoginFormData
  error: string | null
  isLoading: boolean
}

const initialState: LoginState = {
  formData: { email: '', password: '' },
  error: null,
  isLoading: false,
}

type LoginAction =
  | { type: 'SET_FIELD'; field: keyof LoginFormData; value: string }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOADING_START' }
  | { type: 'LOADING_END' }
  | { type: 'RESET' }

function loginReducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value }
      }
    case 'SET_ERROR':
      return { ...state, error: action.message, isLoading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'LOADING_START':
      return { ...state, isLoading: true, error: null }
    case 'LOADING_END':
      return { ...state, isLoading: false }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export const useLogin = () => {
  const [state, dispatch] = useReducer(loginReducer, initialState)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (state.error) dispatch({ type: 'CLEAR_ERROR' })
    dispatch({ type: 'SET_FIELD', field: name as keyof LoginFormData, value })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate with Zod before hitting Supabase
    const result = loginSchema.safeParse(state.formData)
    if (!result.success) {
      dispatch({ type: 'SET_ERROR', message: result.error.issues[0].message })
      return
    }

    dispatch({ type: 'LOADING_START' })

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: state.formData.email,
        password: state.formData.password,
      })

      if (error) throw error

      // Success — AuthContext picks up the session via onAuthStateChange
      navigate('/')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      dispatch({ type: 'SET_ERROR', message })
    }
  }

  return {
    formData: state.formData,
    error: state.error,
    loading: state.isLoading,
    handleChange,
    handleLogin,
  }
}