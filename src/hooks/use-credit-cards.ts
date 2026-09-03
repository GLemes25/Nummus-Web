"use client"

import { useCallback, useEffect, useState } from "react"
import { useDataRefetch } from "@/hooks/use-data-refetch"
import { apiClient } from "@/lib/api-client"
import { emitDataChange } from "@/lib/data-events"
import type { CreditCard } from "@/types/api"

type CreateCreditCardInput = {
  name: string
  creditLimit: number
  closingDay: number
  dueDay: number
  walletId?: string
}

type UpdateCreditCardInput = {
  name: string
  creditLimit: number
  closingDay: number
  dueDay: number
  walletId?: string
}

export const useCreditCards = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPayingInvoice, setIsPayingInvoice] = useState(false)

  const fetchCreditCards = useCallback(() => {
    return Promise.resolve()
      .then(() => {
        setIsLoading(true)
        setError(null)
        return apiClient.get("/credit-cards")
      })
      .then((res) => {
        if (!res) return
        if (!res.ok) {
          setError("Falha ao carregar cartões de crédito")
          return
        }
        return res.json().then((data: CreditCard[]) => {
          setCreditCards(data)
        })
      })
      .catch(() => {
        setError("Falha ao carregar cartões de crédito")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const createCreditCard = useCallback(
    async (input: CreateCreditCardInput): Promise<boolean> => {
      setIsCreating(true)
      try {
        const res = await apiClient.post("/credit-cards", input)
        if (!res || !res.ok) return false
        emitDataChange(["credit-cards", "metrics"])
        return true
      } catch {
        return false
      } finally {
        setIsCreating(false)
      }
    },
    []
  )

  const updateCreditCard = useCallback(
    async (id: string, input: UpdateCreditCardInput): Promise<boolean> => {
      setIsUpdating(true)
      try {
        const res = await apiClient.patch(`/credit-cards/${id}`, input)
        if (!res || !res.ok) return false
        emitDataChange(["credit-cards", "metrics"])
        return true
      } catch {
        return false
      } finally {
        setIsUpdating(false)
      }
    },
    []
  )

  const deleteCreditCard = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true)
      try {
        const res = await apiClient.delete(`/credit-cards/${id}`)
        if (!res || !res.ok) return false
        emitDataChange(["credit-cards", "transactions", "metrics"])
        return true
      } catch {
        return false
      } finally {
        setIsDeleting(false)
      }
    },
    []
  )

  const payInvoice = useCallback(
    async (creditCardId: string, walletId: string): Promise<boolean> => {
      setIsPayingInvoice(true)
      try {
        const res = await apiClient.post(`/credit-cards/${creditCardId}/pay`, {
          walletId,
        })
        if (!res || !res.ok) return false
        emitDataChange(["credit-cards", "wallets", "transactions", "metrics"])
        return true
      } catch {
        return false
      } finally {
        setIsPayingInvoice(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchCreditCards()
  }, [fetchCreditCards])

  useDataRefetch(["credit-cards", "transactions"], fetchCreditCards)

  return {
    creditCards,
    isLoading,
    error,
    refetch: fetchCreditCards,
    createCreditCard,
    isCreating,
    updateCreditCard,
    isUpdating,
    deleteCreditCard,
    isDeleting,
    payInvoice,
    isPayingInvoice,
  }
}
