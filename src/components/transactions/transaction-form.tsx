'use client'

import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
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
import { useCategories } from '@/hooks/use-categories'
import { useWallets } from '@/hooks/use-wallets'
import type { TransactionMutationResult } from '@/hooks/use-transactions'
import { evaluateMathExpression } from '@/lib/evaluateMathExpression'
import type { PaymentMethod } from '@/types/api'

const typeOptions = [
  { value: 'EXPENSE', label: 'Despesa' },
  { value: 'INCOME', label: 'Receita' },
] as const

const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: 'PIX', label: 'Pix' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'BANK_TRANSFER', label: 'Transferência' },
  { value: 'DEBIT_CARD', label: 'Débito' },
]

const NO_CATEGORY = '__none__'

const isPlainNumber = (value: string) => /^\d+(\.\d+)?$/.test(value.trim())

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const transactionFormSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  amount: z.string().min(1, 'Informe um valor').refine(
    (raw) => {
      const evaluated = evaluateMathExpression(raw)
      return evaluated !== null && evaluated > 0
    },
    { message: 'Informe um valor válido' }
  ),
  categoryId: z.string().optional(),
  description: z.string().min(1, 'Informe uma descrição'),
  paymentMethod: z.enum(['CASH', 'PIX', 'BANK_TRANSFER', 'DEBIT_CARD']),
  walletId: z.string().min(1, 'Selecione uma carteira'),
  date: z.date({ error: 'Selecione uma data válida' }),
})

export type TransactionFormValues = z.infer<typeof transactionFormSchema>
export type TransactionFormSubmitValues = Omit<TransactionFormValues, 'amount'> & { amount: number }

type TransactionFormProps = {
  defaultValues?: Partial<TransactionFormValues>
  onSubmit: (values: TransactionFormSubmitValues) => Promise<TransactionMutationResult>
  onSuccess: () => void
  isSubmitting: boolean
  submitLabel: string
}

const TransactionForm = ({
  defaultValues,
  onSubmit,
  onSuccess,
  isSubmitting,
  submitLabel,
}: TransactionFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { wallets } = useWallets()
  const { categories } = useCategories()

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: 'EXPENSE',
      amount: '',
      categoryId: undefined,
      description: '',
      paymentMethod: 'PIX',
      walletId: wallets[0]?.id ?? '',
      date: new Date(),
      ...defaultValues,
    },
  })

  const rawAmount = useWatch({ control: form.control, name: 'amount' })
  const livePreview = useMemo(() => {
    if (!rawAmount || isPlainNumber(rawAmount)) return null
    return evaluateMathExpression(rawAmount)
  }, [rawAmount])

  const handleSubmit = async (values: TransactionFormValues) => {
    setSubmitError(null)
    const amount = evaluateMathExpression(values.amount)
    if (amount === null) {
      setSubmitError('Informe um valor válido')
      return
    }
    const result = await onSubmit({ ...values, amount })
    if (!result.success) {
      setSubmitError(result.error ?? 'Ocorreu um erro inesperado. Tente novamente.')
      return
    }
    onSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                TIPO
              </FormLabel>
              <div className="flex bg-zinc-900 rounded-xl p-0.5 border border-border gap-0.5">
                {typeOptions.map((option) => {
                  const isActive = field.value === option.value
                  const activeClass =
                    option.value === 'INCOME' ? 'bg-income/15 text-income' : 'bg-expense/15 text-expense'
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant="ghost"
                      onClick={() => field.onChange(option.value)}
                      className={`flex-1 h-auto py-2 rounded-lg font-normal hover:bg-transparent ${
                        isActive ? `${activeClass} font-semibold` : 'text-muted-foreground'
                      }`}
                    >
                      {option.label}
                    </Button>
                  )
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="categoryId"
          render={({ field }) => {
            const selectedCategory = categories.find((category) => category.id === field.value)
            return (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                  CATEGORIA
                </FormLabel>
                <Select
                  value={field.value ?? NO_CATEGORY}
                  onValueChange={(value) => field.onChange(value === NO_CATEGORY ? undefined : value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma categoria">
                        {selectedCategory ? (
                          <span className="flex items-center gap-2">
                            <DynamicIcon name={selectedCategory.icon} size={16} className="shrink-0" />
                            {selectedCategory.name}
                          </span>
                        ) : (
                          'Sem categoria'
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent sideOffset={4} className="max-h-72">
                    <SelectItem value={NO_CATEGORY}>Sem categoria</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="flex items-center gap-2">
                          <DynamicIcon name={category.icon} size={16} className="shrink-0" />
                          {category.name}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                NOTA
              </FormLabel>
              <FormControl>
                <Input placeholder="Adicionar uma descrição…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                FORMA DE PAGAMENTO
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="walletId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                CARTEIRA
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a carteira" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
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
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : submitLabel}
        </Button>
      </form>
    </Form>
  )
}

export default TransactionForm
