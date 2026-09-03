"use client"

import { useEffect, useRef } from "react"
import { subscribeDataChange, type DataScope } from "@/lib/data-events"

export const useDataRefetch = (scopes: DataScope[], refetch: () => void) => {
  const refetchRef = useRef(refetch)

  useEffect(() => {
    refetchRef.current = refetch
  }, [refetch])

  const scopesKey = scopes.join(",")

  useEffect(() => {
    const activeScopes = scopesKey.split(",") as DataScope[]
    const unsubscribes = activeScopes.map((scope) =>
      subscribeDataChange(scope, () => refetchRef.current())
    )
    return () => {
      unsubscribes.forEach((unsubscribe) => unsubscribe())
    }
  }, [scopesKey])
}
