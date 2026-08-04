"use client"

import { DynamicIcon as LucideDynamicIcon, dynamicIconImports, type IconName } from "lucide-react/dynamic"
import { HelpCircle } from "lucide-react"

import { cn } from "@/lib/utils"

type DynamicIconProps = {
  name: string
  className?: string
  size?: number
}

const isKnownIconName = (name: string): name is IconName => name in dynamicIconImports

const DynamicIcon = ({ name, className, size = 18 }: DynamicIconProps) => {
  const normalizedName = name.trim().toLowerCase()

  if (!isKnownIconName(normalizedName)) {
    return <HelpCircle className={cn(className)} size={size} />
  }

  return (
    <LucideDynamicIcon
      name={normalizedName}
      size={size}
      className={cn(className)}
      fallback={() => <HelpCircle className={cn(className)} size={size} />}
    />
  )
}

export { DynamicIcon }
