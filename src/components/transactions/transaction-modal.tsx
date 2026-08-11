'use client'

import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Loader2, Slash, Wallet as WalletIcon } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import TransactionForm from '@/components/transactions/transaction-form'
import { useCategories } from '@/hooks/use-categories'
import { useTransactions } from '@/hooks/use-transactions'
import { useWallets } from '@/hooks/use-wallets'
import { apiClient } from '@/lib/api-client'
import { evaluateMathExpression } from '@/lib/evaluateMathExpression'

type TransactionModalProps = {
  isOpen: boolean
  onClose: () => void
}

type Mode = 'transaction' | 'transfer'

const isPlainNumber = (value: string) => /^\d+(\.\d+)?$/.test(value.trim())

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const NO_CATEGORY = '__none__'

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
    categoryId: z.string().optional(),
    description: z.string().optional(),
    date: z.date({ error: 'Selecione uma data válida' }),
  })
  .refine((data) => data.sourceWalletId !== data.destinationWalletId, {
    message: 'A carteira de origem e destino devem ser diferentes',
    path: ['destinationWalletId'],
  })

type TransferFormValues = z.infer<typeof transferFormSchema>

const TransferForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { wallets } = useWallets()
  const { categories } = useCategories()

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      sourceWalletId: wallets[0]?.id ?? '',
      destinationWalletId: wallets[1]?.id ?? wallets[0]?.id ?? '',
      amount: '',
      categoryId: undefined,
      description: '',
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
        description: values.description || undefined,
        categoryId: values.categoryId,
      })
      if (!res || !res.ok) {
        const data = res ? await res.json().catch(() => null) : null
        setSubmitError(data?.error ?? 'Erro ao realizar transferência')
        return
      }
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

const TransactionModal = ({ isOpen, onClose }: TransactionModalProps) => {
  const [mode, setMode] = useState<Mode>('transaction')
  const { createTransaction, isCreating } = useTransactions()

  const handleClose = () => {
    setMode('transaction')
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto px-4 pb-4 flex flex-col gap-4">
          <div className="flex bg-zinc-900 rounded-xl p-0.5 border border-border gap-0.5">
            {(
              [
                { value: 'transaction', label: 'Transação' },
                { value: 'transfer', label: 'Transferência' },
              ] as const
            ).map((option) => (
              <Button
                key={option.value}
                type="button"
                variant="ghost"
                onClick={() => setMode(option.value)}
                className={`flex-1 h-auto py-2 rounded-lg font-normal hover:bg-transparent ${
                  mode === option.value
                    ? 'bg-brand/15 text-brand font-semibold'
                    : 'text-muted-foreground'
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {mode === 'transaction' ? (
            <TransactionForm
              key="transaction"
              isSubmitting={isCreating}
              submitLabel="Salvar Transação"
              onSubmit={(values) => createTransaction({ ...values, date: values.date.toISOString() })}
              onSuccess={handleClose}
            />
          ) : (
            <TransferForm key="transfer" onSuccess={handleClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionModal
