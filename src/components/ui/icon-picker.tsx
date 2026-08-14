"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DynamicIcon } from "@/components/ui/dynamic-icon"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const CATEGORY_ICON_NAMES = [
  "home",
  "car",
  "shopping-cart",
  "coffee",
  "utensils-crossed",
  "zap",
  "heart-pulse",
  "graduation-cap",
  "plane",
  "gift",
  "briefcase",
  "wallet",
  "credit-card",
  "piggy-bank",
  "dumbbell",
  "film",
  "music",
  "book-open",
  "shirt",
  "dog",
  "gamepad-2",
  "smartphone",
  "bus",
  "tag",
] as const

type IconPickerProps = {
  value: string
  onChange: (icon: string) => void
  className?: string
}

const IconPicker = ({ value, onChange, className }: IconPickerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelectIcon = (iconName: string) => {
    onChange(iconName)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      {/* PopoverTrigger composes with the shadcn Button via base-ui's `render`
          prop instead of rendering a native <button>, keeping a single
          interactive element in the DOM. */}
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn("relative w-10 h-10 shrink-0", className)}
          >
            <DynamicIcon name={value} />
            <span className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full border border-input bg-background p-0.5">
              <Pencil size={10} className="w-3 h-3 text-muted-foreground" />
            </span>
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto">
        <div className="grid grid-cols-4 gap-2">
          {CATEGORY_ICON_NAMES.map((iconName) => (
            <Button
              key={iconName}
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleSelectIcon(iconName)}
              className={cn(
                "w-10 h-10 p-2",
                iconName === value && "border-primary bg-accent ring-1 ring-primary",
              )}
            >
              <DynamicIcon name={iconName} size={18} />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { IconPicker }
