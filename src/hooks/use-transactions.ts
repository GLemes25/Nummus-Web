"use client"

import { useCallback, useEffect, useState } from "react"
import { useDataRefetch } from "@/hooks/use-data-refetch"
import { apiClient } from "@/lib/api-client"
import { emitDataChange } from "@/lib/data-events"
import type {
  PaymentMethod,
  RecurrenceFrequency,
  Transaction,
  TransactionsMeta,
  TransactionStatus,
  TransactionType,
  TransactionUpdateMode,
} from "@/types/api"

type FetchParams = {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  walletId?: string
  creditCardId?: string
  type?: TransactionType
  enabled?: boolean
  startDate?: string
  endDate?: string
}

export type CreateTransactionInput = {
  amount: number
  type: "INCOME" | "EXPENSE"
  paymentMethod: PaymentMethod
  status: TransactionStatus
  description: string
  walletId?: string
  creditCardId?: string
  categoryId?: string
  date: string
  installments?: number
  isRecurring?: boolean
  recurrenceFrequency?: RecurrenceFrequency
}

export type UpdateTransactionInput = CreateTransactionInput & {
  updateMode?: TransactionUpdateMode
}

export type TransactionMutationResult = { success: true } | { success: false; error: string }

export const useTransactions = (params: FetchParams = {}) => {
  const isEnabled = params.enabled ?? true
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [meta, setMeta] = useState<TransactionsMeta | null>(null)
  const [isLoading, setIsLoading] = useState(isEnabled)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isRealizing, setIsRealizing] = useState(false)

  const fetchTransactions = useCallback(() => {
    if (!isEnabled) return Promise.resolve()

    const query = new URLSearchParams()
    if (params.page) query.set("page", String(params.page))
    if (params.limit) query.set("limit", String(params.limit))
    if (params.search) query.set("search", params.search)
    if (params.categoryId) query.set("categoryId", params.categoryId)
    if (params.walletId) query.set("walletId", params.walletId)
    if (params.creditCardId) query.set("creditCardId", params.creditCardId)
    if (params.type) query.set("type", params.type)
    if (params.startDate) query.set("startDate", params.startDate)
    if (params.endDate) query.set("endDate", params.endDate)

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
  }, [
    isEnabled,
    params.page,
    params.limit,
    params.search,
    params.categoryId,
    params.walletId,
    params.creditCardId,
    params.type,
    params.startDate,
    params.endDate,
  ])

  const deleteTransaction = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await apiClient.delete(`/transactions/${id}`)
        if (!res) return false
        if (!res.ok) return false
        emitDataChange(["transactions", "wallets", "credit-cards", "metrics"])
        return true
      } catch {
        return false
      }
    },
    []
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
        emitDataChange(["transactions", "wallets", "credit-cards", "metrics"])
        return { success: true }
      } catch {
        return { success: false, error: "Ocorreu um erro inesperado. Tente novamente." }
      } finally {
        setIsUpdating(false)
      }
    },
    []
  )

  const realizeTransaction = useCallback(
    async (id: string): Promise<TransactionMutationResult> => {
      setIsRealizing(true)
      try {
        const res = await apiClient.patch(`/transactions/${id}/realize`, {})
        if (!res || !res.ok) {
          const data = res ? await res.json().catch(() => null) : null
          return { success: false, error: data?.error ?? "Erro ao dar baixa na transação" }
        }
        emitDataChange(["transactions", "wallets", "credit-cards", "metrics"])
        return { success: true }
      } catch {
        return { success: false, error: "Ocorreu um erro inesperado. Tente novamente." }
      } finally {
        setIsRealizing(false)
      }
    },
    []
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
        emitDataChange(["transactions", "wallets", "credit-cards", "metrics"])
        return { success: true }
      } catch {
        return { success: false, error: "Ocorreu um erro inesperado. Tente novamente." }
      } finally {
        setIsCreating(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  useDataRefetch(["transactions"], fetchTransactions)

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
    realizeTransaction,
    isRealizing,
  }
}
