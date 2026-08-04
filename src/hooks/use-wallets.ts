"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { Wallet } from "@/types/api"

type CreateWalletInput = {
  name: string
  currency: string
  initialBalance: number
}

type UpdateWalletInput = {
  name: string
  currency: string
}

export const useWallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const createWallet = useCallback(
    async (input: CreateWalletInput): Promise<boolean> => {
      setIsCreating(true)
      try {
        const res = await apiClient.post("/wallets", input)
        if (!res || !res.ok) return false
        await fetchWallets()
        return true
      } catch {
        return false
      } finally {
        setIsCreating(false)
      }
    },
    [fetchWallets]
  )

  const updateWallet = useCallback(
    async (id: string, input: UpdateWalletInput): Promise<boolean> => {
      setIsUpdating(true)
      try {
        const res = await apiClient.patch(`/wallets/${id}`, input)
        if (!res || !res.ok) return false
        await fetchWallets()
        return true
      } catch {
        return false
      } finally {
        setIsUpdating(false)
      }
    },
    [fetchWallets]
  )

  const deleteWallet = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true)
      try {
        const res = await apiClient.delete(`/wallets/${id}`)
        if (!res || !res.ok) return false
        await fetchWallets()
        return true
      } catch {
        return false
      } finally {
        setIsDeleting(false)
      }
    },
    [fetchWallets]
  )

  useEffect(() => {
    fetchWallets()
  }, [fetchWallets])

  return {
    wallets,
    isLoading,
    error,
    refetch: fetchWallets,
    createWallet,
    isCreating,
    updateWallet,
    isUpdating,
    deleteWallet,
    isDeleting,
  }
}
