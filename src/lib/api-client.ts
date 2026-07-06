const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"

async function request(method: string, path: string, body?: unknown): Promise<Response | null> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (res.status === 401) {
    window.location.href = "/"
    return null
  }

  return res
}

export const apiClient = {
  get: (path: string) => request("GET", path),
  post: (path: string, body: unknown) => request("POST", path, body),
  delete: (path: string) => request("DELETE", path),
}
