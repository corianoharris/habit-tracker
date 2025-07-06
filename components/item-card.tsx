"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { HabitItem } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Check, Flame, Info } from "lucide-react"

interface ItemCardProps {
  item: HabitItem
  onEdit: (item: HabitItem) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
  tabIndex?: number
}

export default function ItemCard({ item, onEdit, onDelete, onToggleComplete, tabIndex = 0 }: ItemCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation within card
 useEffect(() => {
  const currentCard = cardRef.current
  if (!currentCard) return

  const handleKeyDown = (event: KeyboardEvent) => {
    // Only handle keyboard when this card is focused
    if (document.activeElement !== currentCard) return

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault()
        onToggleComplete(item.id)
        break

      case "e":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          onEdit(item)
        }
        break

      case "Delete":
      case "Backspace":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
            onDelete(item.id)
          }
        }
        break
    }
  }

  currentCard.addEventListener("keydown", handleKeyDown)
  return () => {
    currentCard.removeEventListener("keydown", handleKeyDown)
  }
}, [item, onEdit, onDelete, onToggleComplete])


  const handleToggleComplete = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    // Prevent multiple rapid clicks
    if (isProcessing) {
      return
    }

    setIsProcessing(true)
    onToggleComplete(item.id)

    // Reset processing state after a short delay
    setTimeout(() => {
      setIsProcessing(false)
    }, 300)

    // Announce completion to screen readers
    const announcement = item.completedToday
      ? `${item.name} marked as incomplete`
      : `${item.name} completed! Earned ${item.xp} XP`
    const announcer = document.createElement("div")
    announcer.setAttribute("aria-live", "polite")
    announcer.setAttribute("aria-atomic", "true")
    announcer.className = "sr-only"
    announcer.textContent = announcement
    document.body.appendChild(announcer)
    setTimeout(() => {
      if (document.body.contains(announcer)) {
        document.body.removeChild(announcer)
      }
    }, 2000)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      onDelete(item.id)
    }
  }

  return (
    <Card
      ref={cardRef}
      className={`mb-2 transition-all shadow-sm ${
        item.completedToday ? "bg-green-50" : "bg-white hover:bg-gray-50"
      } focus-within:outline-none focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2`}
      tabIndex={tabIndex}
      role="article"
      aria-label={`${item.name} habit ${item.completedToday ? "completed" : "not completed"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className={`font-medium ${item.completedToday ? "line-through text-green-600" : "text-gray-900"}`}
                id={`item-${item.id}-title`}
              >
                {item.name}
              </h3>
              {item.streak !== undefined && item.streak > 0 && (
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 border-0">
                  <Flame className="w-3 h-3 mr-1" aria-hidden="true" />
                  <span aria-label={`${item.streak} day streak`}>{item.streak}</span>
                </Badge>
              )}
              {item.xp !== undefined && item.xp > 0 && (
                <Badge variant="outline" className="text-xs bg-teal-50 text-teal-700 border-0">
                  <span aria-label={`${item.xp} experience points`}>{item.xp} XP</span>
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-gray-600" aria-describedby={`item-${item.id}-title`}>
              {item.sets && item.reps && (
                <span aria-label={`${item.sets} sets of ${item.reps} repetitions`}>
                  {item.sets} sets × {item.reps} reps
                </span>
              )}
              {item.quantity && <span aria-label={`${item.quantity} servings`}>{item.quantity} servings</span>}
              {item.count && <span aria-label={`Count: ${item.count}`}>Count: {item.count}</span>}
              {item.timeSlot && (
                <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-0">
                  <span aria-label={`Scheduled for ${item.timeSlot}`}>{item.timeSlot}</span>
                </Badge>
              )}
            </div>

            {showDetails && item.notes && (
              <p className="mt-2 text-sm text-gray-600" role="note">
                {item.notes}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Item actions">
            <Button
              size="sm"
              variant={item.completedToday ? "default" : "outline"}
              className={
                item.completedToday
                  ? "brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                  : "hover:brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 border-0"
              }
              onClick={handleToggleComplete}
              disabled={isProcessing}
              aria-label={`Mark ${item.name} as ${item.completedToday ? "incomplete" : "complete"}`}
              aria-pressed={item.completedToday}
            >
              <Check className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              onClick={() => onEdit(item)}
              aria-label={`Edit ${item.name}`}
            >
              <Edit className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              onClick={handleDelete}
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {(item.notes || (item.sets && item.reps) || item.quantity || item.count) && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 p-0 h-auto text-xs hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            aria-controls={`item-${item.id}-details`}
            aria-label={`${showDetails ? "Hide" : "Show"} details for ${item.name}`}
          >
            <Info className="w-3 h-3 mr-1" aria-hidden="true" />
            {showDetails ? "Hide details" : "Show details"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
