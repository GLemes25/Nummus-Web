"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { ExpenseByCategory } from "@/types/api"

export const useExpensesByCategory = () => {
  const [expenses, setExpenses] = useState<ExpenseByCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenses = useCallback(() => {
    return Promise.resolve()
      .then(() => {
        setIsLoading(true)
        setError(null)
        return apiClient.get("/metrics/expenses-by-category")
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
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  return { data: expenses, isLoading, error, refetch: fetchExpenses }
}
