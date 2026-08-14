"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { Category } from "@/types/api"

type CreateCategoryInput = {
  name: string
  color: string
  icon: string
  parentId: string | null
}

type UpdateCategoryInput = {
  name: string
  color: string
  icon: string
  parentId: string | null
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCategories = useCallback(() => {
    return Promise.resolve()
      .then(() => {
        setIsLoading(true)
        setError(null)
        return apiClient.get("/categories")
      })
      .then((res) => {
        if (!res) return
        if (!res.ok) {
          setError("Falha ao carregar categorias")
          return
        }
        return res.json().then((data: Category[]) => {
          setCategories(data)
        })
      })
      .catch(() => {
        setError("Falha ao carregar categorias")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const createCategory = useCallback(
    async (input: CreateCategoryInput): Promise<boolean> => {
      setIsCreating(true)
      try {
        const res = await apiClient.post("/categories", input)
        if (!res || !res.ok) return false
        await fetchCategories()
        return true
      } catch {
        return false
      } finally {
        setIsCreating(false)
      }
    },
    [fetchCategories]
  )

  const updateCategory = useCallback(
    async (id: string, input: UpdateCategoryInput): Promise<boolean> => {
      setIsUpdating(true)
      try {
        const res = await apiClient.patch(`/categories/${id}`, input)
        if (!res || !res.ok) return false
        await fetchCategories()
        return true
      } catch {
        return false
      } finally {
        setIsUpdating(false)
      }
    },
    [fetchCategories]
  )

  const deleteCategory = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true)
      try {
        const res = await apiClient.delete(`/categories/${id}`)
        if (!res || !res.ok) return false
        await fetchCategories()
        return true
      } catch {
        return false
      } finally {
        setIsDeleting(false)
      }
    },
    [fetchCategories]
  )

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
    createCategory,
    isCreating,
    updateCategory,
    isUpdating,
    deleteCategory,
    isDeleting,
  }
}
