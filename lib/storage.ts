import type { HabitItem, UserStats } from "./types"

const STORAGE_KEY = "trackerItems"
const STATS_KEY = "userStats"

export function saveItems(items: HabitItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
}

export function getItems(): HabitItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveStats(stats: UserStats) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  }
}

export function getStats(): UserStats {
  if (typeof window === "undefined") return { totalXP: 0, level: 1, totalStreaks: 0 }
  try {
    const stored = localStorage.getItem(STATS_KEY)
    return stored ? JSON.parse(stored) : { totalXP: 0, level: 1, totalStreaks: 0 }
  } catch {
    return { totalXP: 0, level: 1, totalStreaks: 0 }
  }
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1
}
