"use client"

import { useCallback, useEffect, useState } from "react"
import { useDataRefetch } from "@/hooks/use-data-refetch"
import { apiClient } from "@/lib/api-client"
import type { MonthlySummary } from "@/types/api"

type UseMonthlySummaryParams = {
  startDate: string
  endDate: string
}

export const useMonthlySummary = ({ startDate, endDate }: UseMonthlySummaryParams) => {
  const [summary, setSummary] = useState<MonthlySummary>({ totalIncome: 0, totalExpense: 0, balance: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(() => {
    const query = new URLSearchParams({ startDate, endDate })

    return Promise.resolve()
      .then(() => {
        setIsLoading(true)
        setError(null)
        return apiClient.get(`/metrics/summary?${query.toString()}`)
      })
      .then((res) => {
        if (!res) return
        if (!res.ok) {
          setError("Falha ao carregar resumo mensal")
          return
        }
        return res.json().then((data: MonthlySummary) => {
          setSummary(data)
        })
      })
      .catch(() => {
        setError("Falha ao carregar resumo mensal")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [startDate, endDate])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  useDataRefetch(["metrics"], fetchSummary)

  return { summary, isLoading, error }
}
