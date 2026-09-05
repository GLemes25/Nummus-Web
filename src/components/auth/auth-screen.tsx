"use client"

import AuthDivider from "@/components/auth/auth-divider"
import GoogleSignInButton from "@/components/auth/google-sign-in-button"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn, signUp } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

type AuthScreenProps = {
  onAuth: () => void
}

const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
})

type AuthValues = z.infer<typeof authSchema>

const AuthScreen = ({ onAuth }: AuthScreenProps) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const form = useForm<AuthValues>({
    resolver: zodResolver(
      mode === "signup"
        ? authSchema.extend({
            name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
          })
        : authSchema,
    ),
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmit = async (values: AuthValues) => {
    setAuthError(null)
    if (mode === "signin") {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      })
      if (error) {
        setAuthError("E-mail ou senha inválidos")
        return
      }
    } else {
      const { error } = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name ?? "",
      })
      if (error) {
        setAuthError("Não foi possível criar a conta. Tente novamente.")
        return
      }
    }
    onAuth()
  }

  const isLoading = form.formState.isSubmitting

  const handleModeSwitch = () => {
    form.reset()
    setAuthError(null)
    setMode(mode === "signin" ? "signup" : "signin")
  }

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-6">
      <div
        className="hidden lg:flex flex-col justify-between w-115 min-h-150 rounded-2xl p-12 relative overflow-hidden mr-10 border border-border shrink-0"
        style={{
          background: "linear-gradient(145deg, #18181b 0%, #1a0d38 60%, #0d0622 100%)",
        }}
      >
        <div className="absolute -top-15 -right-15 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.25)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-50 h-50 rounded-full bg-[radial-gradient(circle,rgba(191,160,113,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(145deg, #BFA071, #8B6A40)",
              boxShadow: "0 4px 12px rgba(191,160,113,0.3)",
            }}
          >
            <span className="text-background font-extrabold text-lg leading-none">N</span>
          </div>
          <div>
            <div className="text-foreground font-semibold text-sm">Nummus</div>
            <div className="text-gold text-[10px] tracking-[2px]">ECOSSISTEMA FINANCEIRO</div>
          </div>
        </div>

        <div>
          <h1 className="text-foreground mb-4 leading-tight text-3xl font-bold">
            Seu ecossistema
            <br />
            <span className="text-gold">financeiro completo</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Acompanhe cada transação, gerencie múltiplas carteiras e obtenha insights com IA para
            alcançar seus objetivos financeiros mais rapidamente.
          </p>
        </div>

        <div className="flex gap-8">
          {[
            { value: "50K+", label: "Usuários Ativos" },
            { value: "$2.4B", label: "Rastreado" },
            { value: "99.9%", label: "Disponibilidade" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-gold font-bold text-2xl tracking-tight">{stat.value}</div>
              <div className="text-zinc-600 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-muted/50 border border-zinc-700 rounded-xl p-4">
          <p className="text-zinc-300 text-sm leading-relaxed mb-3">
            &ldquo;O Nummus transformou completamente como penso sobre dinheiro. Os insights com IA
            são <span className="text-gold">incríveis</span>.&rdquo;
          </p>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-foreground font-semibold shrink-0"
              style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
            >
              SL
            </div>
            <div>
              <div className="text-foreground text-sm font-medium">Sarah L.</div>
              <div className="text-zinc-600 text-xs">Designer de Produto</div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card border border-border rounded-2xl p-10 w-full max-w-100"
      >
        <div className="flex lg:hidden items-center gap-2.5 mb-7">
          <div
            className="w-8.5 h-8.5 rounded-[9px] flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(145deg, #BFA071, #8B6A40)" }}
          >
            <span className="text-background font-extrabold text-sm">N</span>
          </div>
          <span className="text-foreground font-semibold">Nummus</span>
        </div>

        <div className="mb-7">
          <h2 className="text-foreground mb-1.5 text-2xl font-bold">
            {mode === "signin" ? "Bem-vindo de volta" : "Criar conta"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {mode === "signin"
              ? "Entre para continuar no seu painel"
              : "Comece sua jornada financeira hoje"}
          </p>
        </div>

        <GoogleSignInButton callbackURL="/" onError={setAuthError} />

        <AuthDivider />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {mode === "signup" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-400 text-sm">Nome completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Alex Johnson"
                        className="bg-background border-border text-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400 text-sm">Endereço de e-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="alex@exemplo.com"
                      className="bg-background border-border text-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-zinc-400 text-sm">Senha</FormLabel>
                    {mode === "signin" && (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="text-brand p-0 h-auto text-xs"
                      >
                        Esqueceu a senha?
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="bg-background border-border text-foreground pr-11"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-600 hover:text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {authError && <p className="text-expense text-sm text-center">{authError}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {isLoading && <Loader2 size={15} className="animate-spin" />}
              {mode === "signin" ? "Entrar" : "Criar Conta"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-6">
          <span className="text-zinc-600 text-sm">
            {mode === "signin" ? "Não tem uma conta? " : "Já tem uma conta? "}
          </span>
          <Button
            type="button"
            variant="link"
            className="text-brand p-0 h-auto text-sm"
            onClick={handleModeSwitch}
          >
            {mode === "signin" ? "Cadastre-se grátis" : "Entrar"}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default AuthScreen
