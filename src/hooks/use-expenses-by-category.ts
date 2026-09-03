"use client"

import { useCallback, useEffect, useState } from "react"
import { useDataRefetch } from "@/hooks/use-data-refetch"
import { apiClient } from "@/lib/api-client"
import type { ExpenseByCategory } from "@/types/api"

type FetchParams = {
  startDate?: string
  endDate?: string
}

export const useExpensesByCategory = (params: FetchParams = {}) => {
  const [expenses, setExpenses] = useState<ExpenseByCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = useCallback(() => {
    const query = new URLSearchParams()
    if (params.startDate) query.set("startDate", params.startDate)
    if (params.endDate) query.set("endDate", params.endDate)
    const queryString = query.toString()

    return Promise.resolve()
      .then(() => {
        setIsLoading(true)
        setError(null)
        return apiClient.get(
          `/metrics/expenses-by-category${queryString ? `?${queryString}` : ""}`
        )
      })
      .then((res) => {
        if (!res) return
        if (!res.ok) {
          setError("Falha ao carregar gastos por categoria")
          return
        }
        return res.json().then((json: { data: ExpenseByCategory[] } | ExpenseByCategory[]) => {
          const expenses = Array.isArray(json) ? json : json.data ?? []
          setExpenses(expenses)
        })
      })
      .catch(() => {
        setError("Falha ao carregar gastos por categoria")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [params.startDate, params.endDate])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  useDataRefetch(["metrics"], fetchExpenses)

  return { data: expenses, isLoading, error, refetch: fetchExpenses }
}
