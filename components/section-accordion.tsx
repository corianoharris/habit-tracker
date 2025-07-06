"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { HabitItem, SectionType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ChevronDown, ChevronRight, Plus, Dumbbell, Brain, Briefcase, Utensils, Bed, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ItemCard from "./item-card"
import ItemForm from "./item-form"
import ClearCompletedDialog from "./clear-completed-dialog"

interface SectionAccordionProps {
  section: SectionType
  items: HabitItem[]
  onEditItem: (item: HabitItem) => void
  onDeleteItem: (id: string) => void
  onToggleComplete: (id: string) => void
  onAddItem: (item: Omit<HabitItem, "id" | "createdAt">) => void
  onBulkDeleteItems?: (ids: string[]) => void
  tabIndex?: number
}

const sectionIcons = {
  Body: Dumbbell,
  Mind: Brain,
  Work: Briefcase,
  Meals: Utensils,
  Recovery: Bed,
  Personal: User,
}

const sectionColors = {
  Body: "text-red-600",
  Mind: "text-teal-600",
  Work: "text-blue-600",
  Meals: "text-green-600",
  Recovery: "text-indigo-600",
  Personal: "text-purple-600",
}

export default function SectionAccordion({
  section,
  items,
  onEditItem,
  onDeleteItem,
  onToggleComplete,
  onAddItem,
  onBulkDeleteItems,
  tabIndex = 0,
}: SectionAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<HabitItem | undefined>()
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const sectionItems = items.filter((item) => item.section === section)
  const completedCount = sectionItems.filter((item) => item.completedToday).length

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target !== headerRef.current) return

      switch (event.key) {
        case "ArrowDown":
        case "ArrowUp":
          event.preventDefault()
          const sections = document.querySelectorAll("[data-section-header]")
          const currentIndex = Array.from(sections).indexOf(headerRef.current!)
          const nextIndex =
            event.key === "ArrowDown" ? Math.min(currentIndex + 1, sections.length - 1) : Math.max(currentIndex - 1, 0)
          ;(sections[nextIndex] as HTMLElement)?.focus()
          break
        case "Home":
          event.preventDefault()
          ;(document.querySelector("[data-section-header]") as HTMLElement)?.focus()
          break
        case "End":
          event.preventDefault()
          const lastSection = document.querySelectorAll("[data-section-header]")
          ;(lastSection[lastSection.length - 1] as HTMLElement)?.focus()
          break
      }
    }

    headerRef.current?.addEventListener("keydown", handleKeyDown)
    return () => headerRef.current?.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSaveItem = (itemData: Omit<HabitItem, "id" | "createdAt">) => {
    if (editingItem) {
      onEditItem({ ...itemData, id: editingItem.id, createdAt: editingItem.createdAt })
    } else {
      onAddItem(itemData)
    }
    setShowForm(false)
    setEditingItem(undefined)
  }

  const handleEditClick = (item: HabitItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(undefined)
  }

  const handleToggleSection = () => {
    setIsOpen(!isOpen)
    const announcement = isOpen ? `${section} section collapsed` : `${section} section expanded`
    const announcer = document.createElement("div")
    announcer.setAttribute("aria-live", "polite")
    announcer.setAttribute("aria-atomic", "true")
    announcer.className = "sr-only"
    announcer.textContent = announcement
    document.body.appendChild(announcer)
    setTimeout(() => document.body.removeChild(announcer), 1000)
  }

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isOpen) {
      setIsOpen(true)
    }
    setShowForm(true)
  }

  const IconComponent = sectionIcons[section]
  const iconColor = sectionColors[section]

  const handleClearCompleted = () => {
    const completedItems = sectionItems.filter((item) => item.completedToday)

    if (completedItems.length === 0) {
      toast({
        variant: "destructive",
        title: "No Items to Clear",
        description: `No completed items found in ${section} section.`,
      })
      return
    }

    try {
      if (onBulkDeleteItems) {
        const completedIds = completedItems.map((item) => item.id)
        onBulkDeleteItems(completedIds)
      } else {
        completedItems.forEach((item) => {
          onDeleteItem(item.id)
        })
      }

      toast({
        variant: "success",
        title: "Items Cleared Successfully",
        description: `Cleared ${completedItems.length} completed item${
          completedItems.length === 1 ? "" : "s"
        } from ${section} section.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error Clearing Items",
        description: "Failed to clear completed items. Please try again.",
      })
    }
  }

  return (
    <Card className="mb-4 bg-white shadow-sm">
      <CardHeader className="p-0">
        <div
          ref={headerRef}
          data-section-header
          className="w-full p-4 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 transition-colors rounded-t-lg"
          onClick={handleToggleSection}
          onTouchStart={(e) => console.log(`Touch event on SectionAccordion header: ${section}`)} // Debug log
          aria-expanded={isOpen}
          aria-controls={`section-${section.toLowerCase()}`}
          tabIndex={tabIndex}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOpen ? (
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
              ) : (
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              )}
              <IconComponent className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />
              <h2 className="text-lg font-semibold">{section}</h2>
              <span
                className="text-sm text-gray-500"
                aria-label={`${completedCount} of ${sectionItems.length} items completed`}
              >
                ({completedCount}/{sectionItems.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClearCompletedDialog
                section={section}
                completedCount={completedCount}
                onConfirm={handleClearCompleted}
                disabled={completedCount === 0}
              />
              <Button
                size="sm"
                variant="outline"
                className="brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 bg-transparent border-0"
                onClick={handleAddClick}
                aria-label={`Add new item to ${section} section`}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">Add item</span>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent
          ref={contentRef}
          id={`section-${section.toLowerCase()}`}
          className="pt-0"
          role="region"
          aria-labelledby={`section-${section.toLowerCase()}-header`}
        >
          {showForm && (
            <div role="dialog" aria-label={`${editingItem ? "Edit" : "Add"} ${section} item`}>
              <ItemForm item={editingItem} section={section} onSave={handleSaveItem} onCancel={handleCancel} />
            </div>
          )}

          {sectionItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No items yet. Click the + button to add one!</p>
          ) : (
            <div className="space-y-2" role="list" aria-label={`${section} habits`}>
              {sectionItems.map((item, index) => (
                <div key={item.id} role="listitem">
                  <ItemCard
                    item={item}
                    onEdit={handleEditClick}
                    onDelete={onDeleteItem}
                    onToggleComplete={onToggleComplete}
                    tabIndex={index === 0 ? 0 : -1}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
