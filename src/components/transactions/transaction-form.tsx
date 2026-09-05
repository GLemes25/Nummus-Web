'use client'

import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  CreditCard as CreditCardIcon,
  Loader2,
  Lock,
  Plus,
  Slash,
  Wallet as WalletIcon,
} from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
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
import { Switch } from '@/components/ui/switch'
import { useCategories } from '@/hooks/use-categories'
import { useCreditCards } from '@/hooks/use-credit-cards'
import { useWallets } from '@/hooks/use-wallets'
import type { TransactionMutationResult } from '@/hooks/use-transactions'
import { evaluateMathExpression } from '@/lib/evaluateMathExpression'
import type { PaymentMethod, RecurrenceFrequency } from '@/types/api'

const typeOptions = [
  { value: 'EXPENSE', label: 'Despesa' },
  { value: 'INCOME', label: 'Receita' },
] as const

const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: 'PIX', label: 'Pix' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'TRANSFER', label: 'Transferência' },
  { value: 'DEBIT', label: 'Débito' },
  { value: 'CREDIT', label: 'Crédito' },
]

const frequencyOptions: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'DAILY', label: 'Diariamente' },
  { value: 'WEEKLY', label: 'Semanalmente' },
  { value: 'MONTHLY', label: 'Mensalmente' },
  { value: 'YEARLY', label: 'Anualmente' },
]

const NEW_CATEGORY_DEFAULT_COLOR = '#7C3AED'
const NEW_CATEGORY_DEFAULT_ICON = 'tag'

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
    paymentMethod: z.enum(['CASH', 'PIX', 'TRANSFER', 'DEBIT', 'CREDIT']),
    walletId: z.string().optional(),
    creditCardId: z.string().optional(),
    date: z.date({ error: 'Selecione uma data válida' }),
    status: z.enum(['PENDING', 'COMPLETED']),
    installments: z
      .number()
      .int()
      .min(1, 'Mínimo de 1 parcela')
      .max(72, 'Máximo de 72 parcelas')
      .optional(),
    isRecurring: z.boolean().optional(),
    recurrenceFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
  })
  .refine((data) => data.type !== 'INCOME' || data.paymentMethod !== 'CREDIT', {
    message: 'Não é possível lançar receita em cartão de crédito',
    path: ['paymentMethod'],
  })
  .refine((data) => data.paymentMethod !== 'CREDIT' || !!data.creditCardId, {
    message: 'Selecione um cartão de crédito',
    path: ['creditCardId'],
  })
  .refine((data) => data.paymentMethod === 'CREDIT' || !!data.walletId, {
    message: 'Selecione uma carteira',
    path: ['walletId'],
  })
  .refine((data) => !data.isRecurring || !!data.recurrenceFrequency, {
    message: 'Selecione a frequência de repetição',
    path: ['recurrenceFrequency'],
  })

export type TransactionFormValues = z.infer<typeof transactionFormSchema>
export type TransactionFormSubmitValues = Omit<TransactionFormValues, 'amount'> & {
  amount: number
}

type TransactionFormProps = {
  defaultValues?: Partial<TransactionFormValues>
  onSubmit: (values: TransactionFormSubmitValues) => Promise<TransactionMutationResult>
  onSuccess: () => void
  isSubmitting: boolean
  submitLabel: string
  allowRecurrence?: boolean
}

const TransactionForm = ({
  defaultValues,
  onSubmit,
  onSuccess,
  isSubmitting,
  submitLabel,
  allowRecurrence = true,
}: TransactionFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false)
  const [categoryQuery, setCategoryQuery] = useState('')

  const { wallets } = useWallets()
  const { creditCards } = useCreditCards()
  const { categories, createCategory, isCreating: isCreatingCategory } = useCategories()

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: 'EXPENSE',
      amount: '',
      categoryId: undefined,
      description: '',
      paymentMethod: 'PIX',
      walletId: wallets[0]?.id ?? '',
      creditCardId: undefined,
      date: new Date(),
      status: 'COMPLETED',
      installments: 1,
      isRecurring: false,
      recurrenceFrequency: undefined,
      ...defaultValues,
    },
  })

  const watchedType = useWatch({ control: form.control, name: 'type' })
  const watchedPaymentMethod = useWatch({ control: form.control, name: 'paymentMethod' })
  const isCreditCardPayment = watchedPaymentMethod === 'CREDIT'

  const availablePaymentMethodOptions = useMemo(
    () =>
      watchedType === 'INCOME'
        ? paymentMethodOptions.filter((option) => option.value !== 'CREDIT')
        : paymentMethodOptions,
    [watchedType]
  )

  const rawAmount = useWatch({ control: form.control, name: 'amount' })
  const livePreview = useMemo(() => {
    if (!rawAmount || isPlainNumber(rawAmount)) return null
    return evaluateMathExpression(rawAmount)
  }, [rawAmount])

  const watchedIsRecurring = useWatch({ control: form.control, name: 'isRecurring' })

  const watchedInstallments = useWatch({ control: form.control, name: 'installments' })
  const installmentPreview = useMemo(() => {
    if (watchedType !== 'EXPENSE' || !watchedInstallments || watchedInstallments <= 1) return null
    const evaluated = evaluateMathExpression(rawAmount)
    if (evaluated === null || evaluated <= 0) return null
    return { count: watchedInstallments, value: evaluated / watchedInstallments }
  }, [watchedType, watchedInstallments, rawAmount])

  const normalizedCategoryQuery = categoryQuery.trim().toLowerCase()
  const filteredCategories = normalizedCategoryQuery
    ? categories.filter((category) => category.name.toLowerCase().includes(normalizedCategoryQuery))
    : categories
  const canCreateCategory =
    normalizedCategoryQuery.length > 0 &&
    !categories.some((category) => category.name.toLowerCase() === normalizedCategoryQuery)

  const handleCreateCategory = async () => {
    const name = categoryQuery.trim()
    if (!name) return
    const created = await createCategory({
      name,
      color: NEW_CATEGORY_DEFAULT_COLOR,
      icon: NEW_CATEGORY_DEFAULT_ICON,
    })
    if (created) {
      form.setValue('categoryId', created.id, { shouldValidate: true })
      setCategoryQuery('')
      setIsCategoryPickerOpen(false)
    }
  }

  const handleSubmit = async (values: TransactionFormValues) => {
    setSubmitError(null)
    const amount = evaluateMathExpression(values.amount)
    if (amount === null) {
      setSubmitError('Informe um valor válido')
      return
    }
    const isCreditCardAccount = values.paymentMethod === 'CREDIT'
    const result = await onSubmit({
      ...values,
      amount,
      walletId: isCreditCardAccount ? undefined : values.walletId,
      creditCardId: isCreditCardAccount ? values.creditCardId : undefined,
      installments: values.type === 'EXPENSE' ? values.installments : undefined,
      recurrenceFrequency: values.isRecurring ? values.recurrenceFrequency : undefined,
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
                        if (option.value === 'INCOME' && form.getValues('paymentMethod') === 'CREDIT') {
                          form.setValue('paymentMethod', 'PIX', { shouldValidate: true })
                          form.setValue('creditCardId', undefined)
                          form.setValue('walletId', wallets[0]?.id ?? '', { shouldValidate: true })
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

        {watchedType === 'EXPENSE' && (
          <FormField
            control={form.control}
            name="installments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                  PARCELAS
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="72"
                    value={field.value ?? 1}
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      const parsed = Number(event.target.value)
                      field.onChange(Number.isNaN(parsed) ? undefined : parsed)
                    }}
                  />
                </FormControl>
                {installmentPreview && (
                  <p className="text-muted-foreground text-xs">
                    {installmentPreview.count} parcelas de R$ {formatCurrency(installmentPreview.value)}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                <Popover
                  open={isCategoryPickerOpen}
                  onOpenChange={(open: boolean) => {
                    setIsCategoryPickerOpen(open)
                    if (!open) setCategoryQuery('')
                  }}
                >
                  <PopoverTrigger
                    render={
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between gap-2 bg-zinc-900 font-normal"
                        >
                          {selectedCategory ? (
                            <span className="flex items-center gap-2 truncate">
                              <DynamicIcon name={selectedCategory.icon} size={16} className="shrink-0" />
                              <span className="truncate">{selectedCategory.name}</span>
                              {selectedCategory.isSystem && (
                                <Lock size={12} className="shrink-0 text-muted-foreground" />
                              )}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Slash size={16} className="shrink-0" />
                              Sem categoria
                            </span>
                          )}
                          <ChevronsUpDown size={14} className="shrink-0 text-muted-foreground" />
                        </Button>
                      </FormControl>
                    }
                  />
                  <PopoverContent className="w-80 p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Buscar ou criar categoria…"
                        value={categoryQuery}
                        onValueChange={setCategoryQuery}
                      />
                      <CommandList>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              field.onChange(undefined)
                              setIsCategoryPickerOpen(false)
                              setCategoryQuery('')
                            }}
                          >
                            <Slash size={16} className="shrink-0 text-muted-foreground" />
                            Sem categoria
                            {!field.value && <Check size={14} className="ml-auto shrink-0" />}
                          </CommandItem>
                          {filteredCategories.map((category) => (
                            <CommandItem
                              key={category.id}
                              value={category.id}
                              onSelect={() => {
                                field.onChange(category.id)
                                setIsCategoryPickerOpen(false)
                                setCategoryQuery('')
                              }}
                            >
                              <DynamicIcon name={category.icon} size={16} className="shrink-0" />
                              <span className="truncate">{category.name}</span>
                              {category.isSystem && (
                                <Lock size={12} className="shrink-0 text-muted-foreground" />
                              )}
                              {field.value === category.id && (
                                <Check size={14} className="ml-auto shrink-0" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                        {filteredCategories.length === 0 && !canCreateCategory && (
                          <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                        )}
                        {canCreateCategory && (
                          <>
                            <CommandSeparator />
                            <CommandGroup>
                              <CommandItem
                                value={`__create__${normalizedCategoryQuery}`}
                                disabled={isCreatingCategory}
                                onSelect={handleCreateCategory}
                                className="text-brand"
                              >
                                {isCreatingCategory ? (
                                  <Loader2 size={16} className="shrink-0 animate-spin" />
                                ) : (
                                  <Plus size={16} className="shrink-0" />
                                )}
                                Criar categoria &quot;{categoryQuery.trim()}&quot;
                              </CommandItem>
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
                MÉTODO DE PAGAMENTO
              </FormLabel>
              <Select
                items={availablePaymentMethodOptions}
                value={field.value}
                onValueChange={(value: PaymentMethod | null) => {
                  if (!value) return
                  field.onChange(value)
                  if (value === 'CREDIT') {
                    form.setValue('walletId', undefined, { shouldValidate: true })
                  } else {
                    form.setValue('creditCardId', undefined)
                    if (!form.getValues('walletId')) {
                      form.setValue('walletId', wallets[0]?.id ?? '', { shouldValidate: true })
                    }
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o método de pagamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availablePaymentMethodOptions.map((option) => (
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

        {isCreditCardPayment ? (
          <FormField
            control={form.control}
            name="creditCardId"
            render={({ field }) => {
              const selectedCreditCard = creditCards.find((creditCard) => creditCard.id === field.value)
              return (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                    CARTÃO DE CRÉDITO
                  </FormLabel>
                  <Select value={field.value ?? ''} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o cartão">
                          {selectedCreditCard && (
                            <span className="flex items-center gap-2">
                              <CreditCardIcon size={16} className="shrink-0" />
                              {selectedCreditCard.name}
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {creditCards.map((creditCard) => (
                        <SelectItem key={creditCard.id} value={creditCard.id}>
                          <span className="flex items-center gap-2">
                            <CreditCardIcon size={16} className="shrink-0" />
                            {creditCard.name}
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
        ) : (
          <FormField
            control={form.control}
            name="walletId"
            render={({ field }) => {
              const selectedWallet = wallets.find((wallet) => wallet.id === field.value)
              return (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                    CARTEIRA
                  </FormLabel>
                  <Select value={field.value ?? ''} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a carteira">
                          {selectedWallet && (
                            <span className="flex items-center gap-2">
                              <WalletIcon size={16} className="shrink-0" />
                              {selectedWallet.name}
                            </span>
                          )}
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
        )}

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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                STATUS
              </FormLabel>
              <div className="flex items-center gap-2.5">
                <span className="text-foreground text-sm">
                  {field.value === 'COMPLETED' ? 'Pago' : 'Pendente'}
                </span>
                <FormControl>
                  <Switch
                    checked={field.value === 'COMPLETED'}
                    onCheckedChange={(checked) =>
                      field.onChange(checked ? 'COMPLETED' : 'PENDING')
                    }
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {allowRecurrence && (
          <>
            <FormField
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                    REPETIR TRANSAÇÃO
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={(checked) => {
                        field.onChange(checked)
                        if (checked && !form.getValues('recurrenceFrequency')) {
                          form.setValue('recurrenceFrequency', 'MONTHLY', { shouldValidate: true })
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedIsRecurring && (
              <FormField
                control={form.control}
                name="recurrenceFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                      FREQUÊNCIA
                    </FormLabel>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(value: string | null) => {
                        if (value) field.onChange(value as RecurrenceFrequency)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frequencyOptions.map((option) => (
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
            )}
          </>
        )}

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
