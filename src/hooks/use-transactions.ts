"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { PaymentMethod, Transaction, TransactionsMeta, TransactionType } from "@/types/api"

type FetchParams = {
  page?: number
  limit?: number
  walletId?: string
  type?: TransactionType
  enabled?: boolean
}

export type UpdateTransactionInput = {
  amount: number
  type: "INCOME" | "EXPENSE"
  paymentMethod: PaymentMethod
  description: string
  walletId: string
  categoryId: string
  date: string
}

export const useTransactions = (params: FetchParams = {}) => {
  const isEnabled = params.enabled ?? true
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [meta, setMeta] = useState<TransactionsMeta | null>(null)
  const [isLoading, setIsLoading] = useState(isEnabled)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchTransactions = useCallback(async () => {
    if (!isEnabled) return
    setIsLoading(true)
    setError(null)
    try {
      const query = new URLSearchParams()
      if (params.page) query.set("page", String(params.page))
      if (params.limit) query.set("limit", String(params.limit))
      if (params.walletId) query.set("walletId", params.walletId)
      if (params.type) query.set("type", params.type)

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
  }, [isEnabled, params.page, params.limit, params.walletId, params.type])

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

  const updateTransaction = useCallback(
    async (id: string, input: UpdateTransactionInput): Promise<boolean> => {
      setIsUpdating(true)
      try {
        const res = await apiClient.patch(`/transactions/${id}`, input)
        if (!res || !res.ok) return false
        await fetchTransactions()
        return true
      } catch {
        return false
      } finally {
        setIsUpdating(false)
      }
    },
    [fetchTransactions]
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    meta,
    isLoading,
    error,
    refetch: fetchTransactions,
    deleteTransaction,
    updateTransaction,
    isUpdating,
  }
}
