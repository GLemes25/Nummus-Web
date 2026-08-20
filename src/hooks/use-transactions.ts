"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { PaymentMethod, Transaction, TransactionsMeta, TransactionType } from "@/types/api"

type FetchParams = {
  page?: number
  limit?: number
  walletId?: string
  creditCardId?: string
  type?: TransactionType
  enabled?: boolean
}

export type CreateTransactionInput = {
  amount: number
  type: "INCOME" | "EXPENSE"
  paymentMethod: PaymentMethod
  description: string
  walletId?: string
  creditCardId?: string
  categoryId?: string
  date: string
  installments?: number
}

export type UpdateTransactionInput = CreateTransactionInput

export type TransactionMutationResult = { success: true } | { success: false; error: string }

export const useTransactions = (params: FetchParams = {}) => {
  const isEnabled = params.enabled ?? true
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [meta, setMeta] = useState<TransactionsMeta | null>(null)
  const [isLoading, setIsLoading] = useState(isEnabled)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const fetchTransactions = useCallback(() => {
    if (!isEnabled) return Promise.resolve()

    const query = new URLSearchParams()
    if (params.page) query.set("page", String(params.page))
    if (params.limit) query.set("limit", String(params.limit))
    if (params.walletId) query.set("walletId", params.walletId)
    if (params.creditCardId) query.set("creditCardId", params.creditCardId)
    if (params.type) query.set("type", params.type)

    return Promise.resolve()
      .then(() => {
        setIsLoading(true)
        setError(null)
        return apiClient.get(`/transactions?${query.toString()}`)
      })
      .then((res) => {
        if (!res) return
        if (!res.ok) {
          setError("Falha ao carregar transações")
          return
        }
        return res.json().then((data) => {
          setTransactions(data.data)
          setMeta(data.meta)
        })
      })
      .catch(() => {
        setError("Falha ao carregar transações")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isEnabled, params.page, params.limit, params.walletId, params.creditCardId, params.type])

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
    async (id: string, input: UpdateTransactionInput): Promise<TransactionMutationResult> => {
      setIsUpdating(true)
      try {
        const res = await apiClient.patch(`/transactions/${id}`, input)
        if (!res || !res.ok) {
          const data = res ? await res.json().catch(() => null) : null
          return { success: false, error: data?.error ?? "Erro ao atualizar transação" }
        }
        await fetchTransactions()
        return { success: true }
      } catch {
        return { success: false, error: "Ocorreu um erro inesperado. Tente novamente." }
      } finally {
        setIsUpdating(false)
      }
    },
    [fetchTransactions]
  )

  const createTransaction = useCallback(
    async (input: CreateTransactionInput): Promise<TransactionMutationResult> => {
      setIsCreating(true)
      try {
        const res = await apiClient.post("/transactions", input)
        if (!res || !res.ok) {
          const data = res ? await res.json().catch(() => null) : null
          return { success: false, error: data?.error ?? "Erro ao salvar transação" }
        }
        await fetchTransactions()
        return { success: true }
      } catch {
        return { success: false, error: "Ocorreu um erro inesperado. Tente novamente." }
      } finally {
        setIsCreating(false)
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
    createTransaction,
    isCreating,
  }
}
