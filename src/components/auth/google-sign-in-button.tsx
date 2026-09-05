"use client"

import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import GoogleIcon from "@/components/auth/google-icon"
import { signIn } from "@/lib/auth-client"

type GoogleSignInButtonProps = {
  callbackURL: string
  onError: (message: string | null) => void
}

const GoogleSignInButton = ({ callbackURL, onError }: GoogleSignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    onError(null)
    setIsLoading(true)
    const { error } = await signIn.social({ provider: "google", callbackURL })
    if (error) {
      onError("Não foi possível entrar com o Google. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full mb-6"
      disabled={isLoading}
      onClick={handleClick}
    >
      {isLoading ? <Loader2 size={18} className="animate-spin shrink-0" /> : <GoogleIcon />}
      {isLoading ? "Redirecionando..." : "Continuar com Google"}
    </Button>
  )
}

export default GoogleSignInButton
