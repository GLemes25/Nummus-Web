export type DataScope = "transactions" | "wallets" | "credit-cards" | "metrics"

type Listener = () => void

const listenersByScope = new Map<DataScope, Set<Listener>>()

export function emitDataChange(scopes: DataScope[]): void {
  scopes.forEach((scope) => {
    listenersByScope.get(scope)?.forEach((listener) => listener())
  })
}

export function subscribeDataChange(scope: DataScope, listener: Listener): () => void {
  const listeners = listenersByScope.get(scope) ?? new Set<Listener>()
  listeners.add(listener)
  listenersByScope.set(scope, listeners)
  return () => {
    listeners.delete(listener)
  }
}
