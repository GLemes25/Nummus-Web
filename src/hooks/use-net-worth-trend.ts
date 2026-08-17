"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { NetWorthTrendPoint } from "@/types/api"

export const useNetWorthTrend = () => {
  const [trend, setTrend] = useState<NetWorthTrendPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrend = useCallback(() => {
    return Promise.resolve()
      .then(() => {
        setIsLoading(true)
        setError(null)
        return apiClient.get("/metrics/net-worth-trend")
      })
      .then((res) => {
        if (!res) return
        if (!res.ok) {
          setError("Falha ao carregar tendência de patrimônio")
          return
        }
        return res.json().then((data: NetWorthTrendPoint[]) => {
          setTrend(data)
        })
      })
      .catch(() => {
        setError("Falha ao carregar tendência de patrimônio")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchTrend()
  }, [fetchTrend])

  return { trend, isLoading, error, refetch: fetchTrend }
}
