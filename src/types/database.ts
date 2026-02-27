export type Profile = {
  id: string
  username: string
  email: string
  streak_count: number
  last_active_date: string | null
  freeze_tokens: number
  birthdate: string | null
  created_at: string
}

export type Category = {
  id: string
  user_id: string
  name: string
  created_at: string
}

export type Activity = {
  id: string
  category_id: string
  user_id: string
  name: string
  created_at: string
}

export type Session = {
  id: string
  activity_id: string
  user_id: string
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
  notes: string | null
  date: string
  created_at: string
}

export type CategoryWithActivities = Category & {
  activities: ActivityWithSessions[]
}

export type ActivityWithSessions = Activity & {
  sessions: Session[]
}

