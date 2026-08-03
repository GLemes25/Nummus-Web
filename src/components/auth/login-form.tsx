"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import { signIn } from "@/lib/auth-client"

const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido"),
  password: z.string().min(1, "A senha é obrigatória"),
})

type LoginValues = z.infer<typeof loginSchema>

const LoginForm = () => {
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: LoginValues) => {
    setLoginError(null)
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
    })
    if (error) {
      setLoginError("E-mail ou senha inválidos")
      return
    }
    router.push("/dashboard")
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-2xl p-10 w-full max-w-100">
        <div className="mb-7">
          <h1 className="text-foreground mb-1.5 text-2xl font-bold">Entrar</h1>
          <p className="text-muted-foreground text-sm">Acesse sua conta Nummus</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="alex@exemplo.com" {...field} />
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {loginError && <p className="text-expense text-sm text-center">{loginError}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
              {isSubmitting && <Loader2 size={15} className="animate-spin" />}
              Entrar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default LoginForm
