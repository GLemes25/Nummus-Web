'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type MonthSelectorProps = {
  label: string
  onPrevious: () => void
  onNext: () => void
}

const MonthSelector = ({ label, onPrevious, onNext }: MonthSelectorProps) => (
  <div className="flex items-center justify-center gap-2">
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onPrevious}
      aria-label="Mês anterior"
      className="bg-card border-border text-muted-foreground shrink-0"
    >
      <ChevronLeft size={16} />
    </Button>
    <span className="text-foreground font-semibold text-sm w-36 text-center capitalize">
      {label}
    </span>
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onNext}
      aria-label="Próximo mês"
      className="bg-card border-border text-muted-foreground shrink-0"
    >
      <ChevronRight size={16} />
    </Button>
  </div>
)

export default MonthSelector
