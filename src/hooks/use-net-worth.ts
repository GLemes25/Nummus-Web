"use client"

import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { NetWorthSummary } from "@/types/api"

const EMPTY_SUMMARY: NetWorthSummary = { netWorth: 0, assets: 0, liabilities: 0 }

export const useNetWorth = () => {
  const [summary, setSummary] = useState<NetWorthSummary>(EMPTY_SUMMARY)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(() => {
    return Promise.resolve()
      .then(() => {
        setIsLoading(true)
        setError(null)
        return apiClient.get("/metrics/net-worth")
      })
      .then((res) => {
        if (!res) return
        if (!res.ok) {
          setError("Falha ao carregar patrimônio líquido")
          return
        }
        return res.json().then((json: { data: NetWorthSummary } | NetWorthSummary) => {
          const data = "netWorth" in json ? json : json.data
          setSummary({
            netWorth: data?.netWorth ?? 0,
            assets: data?.assets ?? 0,
            liabilities: data?.liabilities ?? 0,
          })
        })
      })
      .catch(() => {
        setError("Falha ao carregar patrimônio líquido")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return { summary, isLoading, error, refetch: fetchSummary }
}
