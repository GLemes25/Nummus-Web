"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { Transaction, TransactionsMeta } from "@/types/api"

type FetchParams = {
  page?: number
  limit?: number
}

export const useTransactions = (params: FetchParams = {}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [meta, setMeta] = useState<TransactionsMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (params.page) query.set("page", String(params.page))
      if (params.limit) query.set("limit", String(params.limit))

      const res = await apiClient.get(`/transactions?${query.toString()}`)
      if (!res) return
      if (!res.ok) {
        setError("Falha ao carregar transações")
        return
      }
      const data = await res.json()
      setTransactions(data.data)
      setMeta(data.meta)
    } catch {
      setError("Falha ao carregar transações")
    } finally {
      setIsLoading(false)
    }
  }, [params.page, params.limit])

  const deleteTransaction = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await apiClient.delete(`/transactions/${id}`)
        if (!res) return false
        if (!res.ok) return false
        await fetchTransactions()
        return true
      } catch {
        return false
      }
    },
    [fetchTransactions]
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return { transactions, meta, isLoading, error, refetch: fetchTransactions, deleteTransaction }
}
