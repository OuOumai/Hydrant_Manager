"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayClickEventHandler } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type Task = {
  id: string
  hydrantId: string
  type: string
  priority: string
  scheduledDate: string
  address: string
  status: string
  assignedTo: string
  estimatedDuration: string
  progress?: number
  description?: string
}

export type CalendarProps = {
  mode?: "single"
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  tasks?: Task[]
  onTaskClick?: (task: Task) => void
  className?: string
}

function getMonthDays(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getMonthFirstDay(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  tasks = [],
  onTaskClick,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getMonthDays(year, month)
  const firstDayOfMonth = getMonthFirstDay(year, month)

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const handleDayClick = (day: number) => {
    if (onSelect) {
      onSelect(new Date(year, month, day))
    }
  }

  const getTasksForDay = (day: number) => {
    const date = new Date(year, month, day)
    return tasks.filter(task => {
      const taskDate = new Date(task.scheduledDate)
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      )
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">
          {currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
          <div key={day} className="font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square p-0.5" />
        ))}
        {days.map((day) => {
          const dayTasks = getTasksForDay(day)
          const isSelected =
            selected?.getFullYear() === year &&
            selected?.getMonth() === month &&
            selected?.getDate() === day

          return (
            <div
              key={day}
              className={cn(
                "aspect-square p-0.5 relative",
                isSelected && "bg-blue-50 rounded-lg"
              )}
            >
              <button
                onClick={() => handleDayClick(day)}
                className={cn(
                  "w-full h-full flex flex-col items-center rounded-lg hover:bg-gray-100",
                  isSelected && "bg-blue-100"
                )}
              >
                <span className={cn(
                  "text-sm font-medium",
                  isSelected && "text-blue-600"
                )}>
                  {day}
                </span>
                {dayTasks.length > 0 && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className={cn(
                            "w-3 h-3 rounded-full hover:ring-2 hover:ring-offset-1 transition-all",
                            getPriorityColor(task.priority)
                          )}
                          title={`${task.type} - ${task.priority === "high" ? "Priorité élevée" : task.priority === "medium" ? "Priorité moyenne" : "Priorité faible"}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            onTaskClick?.(task)
                          }}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-[0.7rem] px-1.5 py-0.5 hover:bg-gray-100"
                        >
                          +{dayTasks.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
