"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSession } from "@/lib/auth-client"

const DashboardWelcome = () => {
  const router = useRouter()
  const { data: sessionData, isPending: isSessionPending } = useSession()

  useEffect(() => {
    if (!isSessionPending && !sessionData?.session) {
      router.push("/login")
    }
  }, [isSessionPending, sessionData, router])

  if (isSessionPending) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!sessionData?.session) {
    return null
  }

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-2xl p-10 text-center max-w-120">
        <h1 className="text-foreground text-2xl font-bold mb-2">
          Bem-vindo, {sessionData.user.email}!
        </h1>
        <p className="text-muted-foreground text-sm">
          A integração frontend-backend foi um sucesso.
        </p>
      </div>
    </div>
  )
}

export default DashboardWelcome
