"use client"

import { useState, useEffect, useCallback, useId } from "react"
import type { HabitItem, SectionType, UserStats } from "@/lib/types"
import { getItems, saveItems, getStats, saveStats, calculateLevel } from "@/lib/storage"
import SectionAccordion from "@/components/section-accordion"
import StatsBanner from "@/components/stats-banner"
import { Button } from "@/components/ui/button"
import { BookOpen, Trophy, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

const sections: SectionType[] = ["Body", "Mind", "Work", "Meals", "Recovery", "Personal"]

// Default items for each section
const defaultItems: Record<SectionType, Omit<HabitItem, "id" | "createdAt" | "section">[]> = {
  Body: [
    {
      name: "Stretch 10 minutes",
      type: "habit",
      timeSlot: "Morning",
      notes: "When wake up and before bed",
      xp: 15,
      completedToday: false,
      streak: 0,
    },
    {
      name: "Abs hold",
      type: "habit",
      sets: 1,
      reps: 4,
      timeSlot: "Morning",
      notes: "4 minutes morning and before bed",
      xp: 20,
      completedToday: false,
      streak: 0,
    },
    {
      name: "Full body routine",
      type: "habit",
      sets: 3,
      reps: 8,
      timeSlot: "Morning",
      xp: 25,
      completedToday: false,
      streak: 0,
    },
    {
      name: "Yoga retreat workout",
      type: "habit",
      timeSlot: "Afternoon",
      xp: 30,
      completedToday: false,
      streak: 0,
    },
    {
      name: "Sauna session",
      type: "habit",
      timeSlot: "Evening",
      xp: 15,
      completedToday: false,
      streak: 0,
    },
    {
      name: "Swimming",
      type: "habit",
      timeSlot: "Afternoon",
      xp: 25,
      completedToday: false,
      streak: 0,
    },
    {
      name: "Daily steps",
      type: "habit",
      timeSlot: "Custom",
      notes: "Track throughout the day",
      xp: 15,
      completedToday: false,
      streak: 0,
    },
    {
      name: "Incline walk/speed walk",
      type: "habit",
      timeSlot: "Morning",
      xp: 20,
      completedToday: false,
      streak: 0,
    },
  ],
  Mind: [
    {
      name: "Meditation 5 minutes",
      type: "habit",
      timeSlot: "Morning",
      notes: "When wake up and before bed",
      xp: 15,
      completedToday: false,
      streak: 0,
    },
    {
      name: "Pomodoro 5 minute breaks",
      type: "habit",
      count: 8,
      timeSlot: "Custom",
      notes: "Every 25 minutes - count breaks taken",
      xp: 10,
      completedToday: false,
      streak: 0,
    },
  ],
  Work: [
    {
      name: "UX research practice",
      type: "task",
      timeSlot: "Morning",
      notes: "10 minutes daily practice",
      xp: 15,
      completedToday: false,
      streak: 0,
    },
    {
      name: "UI Design practice",
      type: "task",
      timeSlot: "Morning",
      notes: "10 minutes daily practice",
      xp: 15,
      completedToday: false,
      streak: 0,
    },
    {
      name: "JavaScript code challenge",
      type: "task",
      timeSlot: "Morning",
      notes: "10 minutes daily practice",
      xp: 20,
      completedToday: false,
      streak: 0,
    },
  ],
  Meals: [
    {
      name: "Water intake",
      type: "meal",
      quantity: 1.5,
      timeSlot: "Custom",
      notes: "1.5 liters throughout the day",
      xp: 15,
      completedToday: false,
      streak: 0,
    },
  ],
  Recovery: [
    {
      name: "Sleep 7 hours",
      type: "habit",
      timeSlot: "Evening",
      notes: "Quality sleep for recovery",
      xp: 25,
      completedToday: false,
      streak: 0,
    },
  ],
  Personal: [
    {
      name: "Journal writing",
      type: "habit",
      timeSlot: "Evening",
      notes: "Reflect on the day and set intentions",
      xp: 15,
      completedToday: false,
      streak: 0,
    },
    {
      name: "Call family/friends",
      type: "task",
      timeSlot: "Afternoon",
      notes: "Stay connected with loved ones",
      xp: 20,
      completedToday: false,
      streak: 0,
    },
    {
      name: "Read for pleasure",
      type: "habit",
      timeSlot: "Evening",
      notes: "30 minutes of personal reading",
      xp: 15,
      completedToday: false,
      streak: 0,
    },
    {
      name: "Practice gratitude",
      type: "habit",
      timeSlot: "Morning",
      notes: "List 3 things you're grateful for",
      xp: 10,
      completedToday: false,
      streak: 0,
    },
  ],
}

export default function Home() {
  const [items, setItems] = useState<HabitItem[]>([])
  const [stats, setStats] = useState<UserStats>({ totalXP: 0, level: 1, totalStreaks: 0 })
  const [hasInitialized, setHasInitialized] = useState(false)

    const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);


  useEffect(() => {
    // Remove dark mode class if it exists
    document.documentElement.classList.remove("dark")

    const existingItems = getItems()
    const existingStats = getStats()

    // If no items exist, add default items
    if (existingItems.length === 0 && !hasInitialized) {
      const defaultHabitItems: HabitItem[] = []

      sections.forEach((section) => {
        defaultItems[section].forEach((item) => {
          defaultHabitItems.push({
            ...item,
            id: generateId(),
            section,
            createdAt: new Date().toISOString(),
          })
        })
      })

      setItems(defaultHabitItems)
      saveItems(defaultHabitItems)
      setHasInitialized(true)
    } else {
      setItems(existingItems)
    }

    setStats(existingStats)
  }, [hasInitialized])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.key) {
        case "r":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            window.location.href = "/resources"
          }
          break
        case "?":
          event.preventDefault()
          // Show keyboard shortcuts help
          alert(`Keyboard Shortcuts:
• Ctrl/Cmd + R: Open Resources
• Tab: Navigate between elements
• Enter/Space: Activate buttons
• Arrow keys: Navigate within sections`)
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])





  const updateStats = useCallback((newItems: HabitItem[]) => {
    const totalXP = newItems.reduce((sum, item) => sum + (item.xp || 0), 0)
    const totalStreaks = newItems.reduce((sum, item) => sum + (item.streak || 0), 0)
    const level = calculateLevel(totalXP)

    const newStats = { totalXP, level, totalStreaks }
    setStats(newStats)
    saveStats(newStats)
  }, [])

  const handleAddItem = useCallback(
    (itemData: Omit<HabitItem, "id" | "createdAt">) => {
      const newItem: HabitItem = {
        ...itemData,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }
      const newItems = [...items, newItem]
      setItems(newItems)
      saveItems(newItems)
      updateStats(newItems)
    },
    [items, updateStats],
  )

  const handleEditItem = useCallback(
    (updatedItem: HabitItem) => {
      const newItems = items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      setItems(newItems)
      saveItems(newItems)
      updateStats(newItems)
    },
    [items, updateStats],
  )

  const handleDeleteItem = useCallback(
    (id: string) => {
      const newItems = items.filter((item) => item.id !== id)
      setItems(newItems)
      saveItems(newItems)
      updateStats(newItems)
    },
    [items, updateStats],
  )

  const handleBulkDeleteItems = useCallback(
    (ids: string[]) => {
      const newItems = items.filter((item) => !ids.includes(item.id))
      setItems(newItems)
      saveItems(newItems)
      updateStats(newItems)
    },
    [items, updateStats],
  )

  const handleToggleComplete = useCallback(
    (id: string) => {
      const newItems = items.map((item) => {
        if (item.id === id) {
          const wasCompleted = item.completedToday
          const now = new Date().toISOString()

          return {
            ...item,
            completedToday: !wasCompleted,
            streak: !wasCompleted ? (item.streak || 0) + 1 : Math.max((item.streak || 0) - 1, 0),
            lastCompleted: !wasCompleted ? now : item.lastCompleted,
          }
        }
        return item
      })

      setItems(newItems)
      saveItems(newItems)
      updateStats(newItems)
    },
    [items, updateStats],
  )

  const todayCompletedCount = items.filter((item) => item.completedToday).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-2 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Habit Tracker
          </h1>
          <p className="text-gray-600 text-center">Track your daily habits and build consistency</p>
          <div className="sr-only">
            <p>
              Welcome to your habit tracker. Use Tab to navigate, Enter or Space to activate buttons, and press ? for
              keyboard shortcuts.
            </p>
          </div>
        </header>

        <StatsBanner stats={stats} />

        <div className="mb-6 text-center">
          <div className="text-lg font-semibold flex items-center justify-center gap-2">
            <Target className="w-5 h-5 text-teal-600" />
            <span>Today's Progress: </span>
            <span className="text-teal-600 font-bold">{todayCompletedCount}</span>
            <span>completed</span>
          </div>
        </div>

        <div className="mb-6">
          <Link href="/resources">
            <Button
              className="w-full brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 transition-colors bg-transparent border-0"
              variant="outline"
              aria-describedby="resources-description"
            >
              <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
              Anti-Inflammatory Food Guide
            </Button>
          </Link>
          <div id="resources-description" className="sr-only">
            Navigate to the health resources page with food tracking and body metrics calculator
          </div>
        </div>

        <main>
          <div className="space-y-4" role="main" aria-label="Habit tracking sections">
            {sections.map((section, index) => (
              <SectionAccordion
                key={section}
                section={section}
                items={items}
                onAddItem={handleAddItem}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onBulkDeleteItems={handleBulkDeleteItems}
                onToggleComplete={handleToggleComplete}
                tabIndex={index === 0 ? 0 : -1}
              />
            ))}
          </div>
        </main>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" aria-hidden="true" />
            Stay consistent. Build habits. Level up your life.
          </p>
          <p className="mt-2 text-xs">
            Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">?</kbd> for keyboard shortcuts
          </p>
          <p className="mt-4 text-xs text-gray-400">All rights reserved 2025. Powered by Coriano Harris</p>
        </footer>
      </div>
    </div>
  )
}
