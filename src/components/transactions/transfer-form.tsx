'use client'

import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Loader2, Wallet as WalletIcon } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWallets } from '@/hooks/use-wallets'
import { apiClient } from '@/lib/api-client'
import { emitDataChange } from '@/lib/data-events'
import { evaluateMathExpression } from '@/lib/evaluateMathExpression'

const isPlainNumber = (value: string) => /^\d+(\.\d+)?$/.test(value.trim())

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const transferFormSchema = z
  .object({
    sourceWalletId: z.string().min(1, 'Selecione a carteira de origem'),
    destinationWalletId: z.string().min(1, 'Selecione a carteira de destino'),
    amount: z.string().min(1, 'Informe um valor').refine(
      (raw) => {
        const evaluated = evaluateMathExpression(raw)
        return evaluated !== null && evaluated > 0
      },
      { message: 'Informe um valor válido' }
    ),
    date: z.date({ error: 'Selecione uma data válida' }),
  })
  .refine((data) => data.sourceWalletId !== data.destinationWalletId, {
    message: 'A carteira de origem e destino devem ser diferentes',
    path: ['destinationWalletId'],
  })

type TransferFormValues = z.infer<typeof transferFormSchema>

type TransferFormProps = {
  onSuccess: () => void
}

const TransferForm = ({ onSuccess }: TransferFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { wallets } = useWallets()

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      sourceWalletId: wallets[0]?.id ?? '',
      destinationWalletId: wallets[1]?.id ?? wallets[0]?.id ?? '',
      amount: '',
      date: new Date(),
    },
  })

  const rawAmount = useWatch({ control: form.control, name: 'amount' })
  const livePreview = useMemo(() => {
    if (!rawAmount || isPlainNumber(rawAmount)) return null
    return evaluateMathExpression(rawAmount)
  }, [rawAmount])

  const handleSubmit = async (values: TransferFormValues) => {
    const amount = evaluateMathExpression(values.amount)
    if (amount === null) {
      setSubmitError('Informe um valor válido')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await apiClient.post('/transfers', {
        sourceWalletId: values.sourceWalletId,
        destinationWalletId: values.destinationWalletId,
        amount,
        date: values.date.toISOString(),
      })
      if (!res || !res.ok) {
        const data = res ? await res.json().catch(() => null) : null
        setSubmitError(data?.error ?? 'Erro ao realizar transferência')
        return
      }
      emitDataChange(['transactions', 'wallets', 'metrics'])
      onSuccess()
    } catch {
      setSubmitError('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                VALOR
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00 ou 8+8"
                  {...field}
                  onBlur={(event) => {
                    field.onBlur()
                    const evaluated = evaluateMathExpression(event.target.value)
                    if (evaluated !== null && !isPlainNumber(event.target.value)) {
                      form.setValue('amount', String(evaluated), { shouldValidate: true })
                    }
                  }}
                />
              </FormControl>
              {livePreview !== null && (
                <p className="text-muted-foreground text-xs">= R$ {formatCurrency(livePreview)}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sourceWalletId"
          render={({ field }) => {
            const selectedWallet = wallets.find((wallet) => wallet.id === field.value)
            return (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                  CARTEIRA DE ORIGEM
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a carteira">
                        {selectedWallet ? (
                          <span className="flex items-center gap-2">
                            <WalletIcon size={16} className="shrink-0" />
                            {selectedWallet.name}
                          </span>
                        ) : undefined}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        <span className="flex items-center gap-2">
                          <WalletIcon size={16} className="shrink-0" />
                          {wallet.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="destinationWalletId"
          render={({ field }) => {
            const selectedWallet = wallets.find((wallet) => wallet.id === field.value)
            return (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                  CARTEIRA DE DESTINO
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a carteira">
                        {selectedWallet ? (
                          <span className="flex items-center gap-2">
                            <WalletIcon size={16} className="shrink-0" />
                            {selectedWallet.name}
                          </span>
                        ) : undefined}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        <span className="flex items-center gap-2">
                          <WalletIcon size={16} className="shrink-0" />
                          {wallet.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                DATA
              </FormLabel>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start gap-2.5 bg-zinc-900 text-foreground font-normal"
                    >
                      <CalendarIcon size={15} className="text-zinc-600 shrink-0" />
                      {field.value
                        ? format(field.value, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
                        : 'Selecione uma data'}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={field.value}
                    onSelect={(date) => date && field.onChange(date)}
                    disabled={(date) => date > new Date()}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError && <p className="text-expense text-sm text-center">{submitError}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold text-[15px]"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Realizar Transferência'}
        </Button>
      </form>
    </Form>
  )
}

export default TransferForm
