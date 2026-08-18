'use client'

import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CalendarIcon,
  CreditCard as CreditCardIcon,
  Loader2,
  Slash,
  Wallet as WalletIcon,
} from 'lucide-react'
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCategories } from '@/hooks/use-categories'
import { useCreditCards } from '@/hooks/use-credit-cards'
import { useWallets } from '@/hooks/use-wallets'
import type { TransactionMutationResult } from '@/hooks/use-transactions'
import { evaluateMathExpression } from '@/lib/evaluateMathExpression'
import type { PaymentMethod } from '@/types/api'

export const WALLET_ACCOUNT_PREFIX = 'wallet_'
export const CREDIT_CARD_ACCOUNT_PREFIX = 'card_'

const typeOptions = [
  { value: 'EXPENSE', label: 'Despesa' },
  { value: 'INCOME', label: 'Receita' },
] as const

const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: 'PIX', label: 'Pix' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'BANK_TRANSFER', label: 'Transferência' },
  { value: 'DEBIT_CARD', label: 'Débito' },
  { value: 'CREDIT_CARD', label: 'Crédito' },
]

const NO_CATEGORY = '__none__'

const isPlainNumber = (value: string) => /^\d+(\.\d+)?$/.test(value.trim())

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const transactionFormSchema = z
  .object({
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
    paymentMethod: z.enum(['CASH', 'PIX', 'BANK_TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD']),
    accountId: z.string().min(1, 'Selecione uma carteira ou cartão'),
    date: z.date({ error: 'Selecione uma data válida' }),
  })
  .refine(
    (data) => data.type !== 'INCOME' || !data.accountId.startsWith(CREDIT_CARD_ACCOUNT_PREFIX),
    { message: 'Não é possível lançar receita em cartão de crédito', path: ['accountId'] }
  )

export type TransactionFormValues = z.infer<typeof transactionFormSchema>
export type TransactionFormSubmitValues = Omit<TransactionFormValues, 'amount' | 'accountId'> & {
  amount: number
  walletId?: string
  creditCardId?: string
}

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
  const { creditCards } = useCreditCards()
  const { categories } = useCategories()

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: 'EXPENSE',
      amount: '',
      categoryId: undefined,
      description: '',
      paymentMethod: 'PIX',
      accountId: wallets[0] ? `${WALLET_ACCOUNT_PREFIX}${wallets[0].id}` : '',
      date: new Date(),
      ...defaultValues,
    },
  })

  const watchedType = useWatch({ control: form.control, name: 'type' })

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
    const { accountId, ...rest } = values
    const isCreditCardAccount = accountId.startsWith(CREDIT_CARD_ACCOUNT_PREFIX)
    const result = await onSubmit({
      ...rest,
      amount,
      walletId: isCreditCardAccount ? undefined : accountId.slice(WALLET_ACCOUNT_PREFIX.length),
      creditCardId: isCreditCardAccount ? accountId.slice(CREDIT_CARD_ACCOUNT_PREFIX.length) : undefined,
    })
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
                      onClick={() => {
                        field.onChange(option.value)
                        if (option.value === 'INCOME') {
                          const currentAccountId = form.getValues('accountId')
                          if (currentAccountId?.startsWith(CREDIT_CARD_ACCOUNT_PREFIX)) {
                            form.setValue(
                              'accountId',
                              wallets[0] ? `${WALLET_ACCOUNT_PREFIX}${wallets[0].id}` : '',
                              { shouldValidate: true }
                            )
                          }
                        }
                      }}
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
                          <span className="flex items-center gap-2">
                            <Slash size={16} className="shrink-0 text-muted-foreground" />
                            Sem categoria
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent sideOffset={4} className="max-h-72">
                    <SelectItem value={NO_CATEGORY}>
                      <span className="flex items-center gap-2">
                        <Slash size={16} className="shrink-0 text-muted-foreground" />
                        Sem categoria
                      </span>
                    </SelectItem>
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
              <Select
                items={paymentMethodOptions}
                value={field.value}
                onValueChange={field.onChange}
              >
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
          name="accountId"
          render={({ field }) => {
            const selectedWallet = wallets.find(
              (wallet) => `${WALLET_ACCOUNT_PREFIX}${wallet.id}` === field.value
            )
            const selectedCreditCard = creditCards.find(
              (creditCard) => `${CREDIT_CARD_ACCOUNT_PREFIX}${creditCard.id}` === field.value
            )
            return (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                  CONTA
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a carteira ou cartão">
                        {selectedWallet ? (
                          <span className="flex items-center gap-2">
                            <WalletIcon size={16} className="shrink-0" />
                            {selectedWallet.name}
                          </span>
                        ) : selectedCreditCard ? (
                          <span className="flex items-center gap-2">
                            <CreditCardIcon size={16} className="shrink-0" />
                            {selectedCreditCard.name}
                          </span>
                        ) : undefined}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Carteiras</SelectLabel>
                      {wallets.map((wallet) => (
                        <SelectItem
                          key={wallet.id}
                          value={`${WALLET_ACCOUNT_PREFIX}${wallet.id}`}
                        >
                          <span className="flex items-center gap-2">
                            <WalletIcon size={16} className="shrink-0" />
                            {wallet.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    {watchedType !== 'INCOME' && creditCards.length > 0 && (
                      <SelectGroup>
                        <SelectLabel>Cartões de Crédito</SelectLabel>
                        {creditCards.map((creditCard) => (
                          <SelectItem
                            key={creditCard.id}
                            value={`${CREDIT_CARD_ACCOUNT_PREFIX}${creditCard.id}`}
                          >
                            <span className="flex items-center gap-2">
                              <CreditCardIcon size={16} className="shrink-0" />
                              {creditCard.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
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
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : submitLabel}
        </Button>
      </form>
    </Form>
  )
}

export default TransactionForm
