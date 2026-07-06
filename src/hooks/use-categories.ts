"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { Category } from "@/types/api"

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiClient.get("/categories")
      if (!res) return
      if (!res.ok) {
        setError("Falha ao carregar categorias")
        return
      }
      const data: Category[] = await res.json()
      setCategories(data)
    } catch {
      setError("Falha ao carregar categorias")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, isLoading, error, refetch: fetchCategories }
}
