"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2, AlertTriangle } from "lucide-react"
import type { SectionType } from "@/lib/types"

interface ClearCompletedDialogProps {
  section: SectionType
  completedCount: number
  onConfirm: () => void
  disabled?: boolean
}

export default function ClearCompletedDialog({
  section,
  completedCount,
  onConfirm,
  disabled = false,
}: ClearCompletedDialogProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  if (disabled || completedCount === 0) {
    return (
      <Button
        size="sm"
        variant="outline"
        className="text-gray-400 cursor-not-allowed bg-transparent border-0"
        disabled={true}
        aria-label={`No completed items to clear in ${section} section`}
      >
        <Trash2 className="w-4 h-4" aria-hidden="true" />
        <span className="sr-only">Clear completed</span>
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} aria-label={`Clear completed items in ${section} section`}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 bg-transparent border-0"
          aria-label={`Clear all completed items in ${section} section`}
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
          <span className="sr-only">Clear completed</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="important:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Clear Completed Items
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to clear <strong>{completedCount}</strong> completed item
            {completedCount === 1 ? "" : "s"} from the <strong>{section}</strong> section?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">This action cannot be undone</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              All completed items will be permanently removed from your tracker.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear {completedCount} Item{completedCount === 1 ? "" : "s"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
