"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { CreditCard } from "@/types/api"

export const useCreditCards = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    fetchCreditCards()
  }, [fetchCreditCards])

  return {
    creditCards,
    isLoading,
    error,
    refetch: fetchCreditCards,
  }
}
