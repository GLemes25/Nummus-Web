"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { CreditCard } from "@/types/api"

type CreateCreditCardInput = {
  name: string
  creditLimit: number
  closingDay: number
  dueDay: number
}

export const useCreditCards = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

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
        await fetchCreditCards()
        return true
      } catch {
        return false
      } finally {
        setIsCreating(false)
      }
    },
    [fetchCreditCards]
  )

  useEffect(() => {
    fetchCreditCards()
  }, [fetchCreditCards])

  return {
    creditCards,
    isLoading,
    error,
    refetch: fetchCreditCards,
    createCreditCard,
    isCreating,
  }
}
