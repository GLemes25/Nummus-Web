"use client"

import { useCallback, useMemo, useState } from "react"
import { endOfMonth, startOfMonth } from "date-fns"

export const useDateFilter = () => {
  const [referenceDate, setReferenceDate] = useState(() => new Date())

  const goToPreviousMonth = useCallback(() => {
    setReferenceDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
  }, [])

  const goToNextMonth = useCallback(() => {
    setReferenceDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
  }, [])

  const startDate = useMemo(() => startOfMonth(referenceDate), [referenceDate])
  const endDate = useMemo(() => endOfMonth(referenceDate), [referenceDate])

  const label = useMemo(() => {
    const formatted = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(
      referenceDate
    )
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }, [referenceDate])

  return {
    referenceDate,
    startDate,
    endDate,
    label,
    goToPreviousMonth,
    goToNextMonth,
  }
}
