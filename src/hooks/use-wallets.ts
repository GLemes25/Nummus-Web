"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { Wallet } from "@/types/api"

export const useWallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWallets = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiClient.get("/wallets")
      if (!res) return
      if (!res.ok) {
        setError("Falha ao carregar carteiras")
        return
      }
      const data: Wallet[] = await res.json()
      setWallets(data)
    } catch {
      setError("Falha ao carregar carteiras")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWallets()
  }, [fetchWallets])

  return { wallets, isLoading, error, refetch: fetchWallets }
}
