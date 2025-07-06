"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { HabitItem, SectionType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ItemFormProps {
  item?: HabitItem
  section: SectionType
  onSave: (item: Omit<HabitItem, "id" | "createdAt">) => void
  onCancel: () => void
}

export default function ItemForm({ item, section, onSave, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "habit" as "habit" | "task" | "meal",
    sets: "",
    reps: "",
    quantity: "",
    count: "", // Add count field
    timeSlot: "" as "" | "Morning" | "Afternoon" | "Evening" | "Custom",
    notes: "",
    xp: "10",
  })

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        type: item.type,
        sets: item.sets?.toString() || "",
        reps: item.reps?.toString() || "",
        quantity: item.quantity?.toString() || "",
        count: item.count?.toString() || "", // Include count in form data
        timeSlot: item.timeSlot || "",
        notes: item.notes || "",
        xp: item.xp?.toString() || "10",
      })
    }
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const newItem: Omit<HabitItem, "id" | "createdAt"> = {
      section,
      name: formData.name.trim(),
      type: formData.type,
      sets: formData.sets ? Number.parseInt(formData.sets) : undefined,
      reps: formData.reps ? Number.parseInt(formData.reps) : undefined,
      quantity: formData.quantity ? Number.parseInt(formData.quantity) : undefined,
      count: formData.count ? Number.parseInt(formData.count) : undefined, // Include count
      timeSlot: formData.timeSlot || undefined,
      notes: formData.notes.trim() || undefined,
      xp: Number.parseInt(formData.xp),
      completedToday: item?.completedToday || false,
      streak: item?.streak || 0,
      lastCompleted: item?.lastCompleted,
    }

    onSave(newItem)
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          {item ? "Edit" : "Add"} {section} Item
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "habit" | "task" | "meal") => setFormData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="habit">Habit</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="meal">Meal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(section === "Body" || section === "Work") && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sets">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  value={formData.sets}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sets: e.target.value }))}
                  placeholder="3"
                />
              </div>
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  value={formData.reps}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reps: e.target.value }))}
                  placeholder="12"
                />
              </div>
            </div>
          )}

          {section === "Mind" && (
            <div>
              <Label htmlFor="count">Count (Optional)</Label>
              <Input
                id="count"
                type="number"
                value={formData.count}
                onChange={(e) => setFormData((prev) => ({ ...prev, count: e.target.value }))}
                placeholder="e.g., 5 (for 5 Pomodoro breaks)"
              />
              <p className="text-xs text-gray-500 mt-1">Track number of sessions, breaks, or repetitions</p>
            </div>
          )}

          {section === "Meals" && (
            <div>
              <Label htmlFor="quantity">Servings</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                placeholder="1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="timeSlot">Time Slot</Label>
            <Select
              value={formData.timeSlot}
              onValueChange={(value: "Morning" | "Afternoon" | "Evening" | "Custom") =>
                setFormData((prev) => ({ ...prev, timeSlot: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Afternoon">Afternoon</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="xp">XP Reward</Label>
            <Input
              id="xp"
              type="number"
              value={formData.xp}
              onChange={(e) => setFormData((prev) => ({ ...prev, xp: e.target.value }))}
              placeholder="10"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional details..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">{item ? "Update" : "Add"} Item</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
