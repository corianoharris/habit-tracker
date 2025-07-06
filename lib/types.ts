export type SectionType = "Body" | "Mind" | "Work" | "Meals" | "Recovery" | "Personal"

export type HabitItem = {
  id: string
  section: SectionType
  name: string
  sets?: number
  reps?: number
  quantity?: number
  count?: number // Add count field for Mind section
  timeSlot?: "Morning" | "Afternoon" | "Evening" | "Custom"
  notes?: string
  completedToday?: boolean
  streak?: number
  xp?: number
  type: "habit" | "task" | "meal"
  createdAt: string
  lastCompleted?: string
}

export type UserStats = {
  totalXP: number
  level: number
  totalStreaks: number
}
