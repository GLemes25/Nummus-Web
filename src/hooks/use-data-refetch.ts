"use client"

import { useEffect } from "react"
import { subscribeDataChange, type DataScope } from "@/lib/data-events"

export const useDataRefetch = (scopes: DataScope[], refetch: () => void) => {
  const scopesKey = scopes.join(",")

  useEffect(() => {
    const activeScopes = scopesKey.split(",") as DataScope[]
    const unsubscribes = activeScopes.map((scope) => subscribeDataChange(scope, refetch))
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [scopesKey, refetch])
}
