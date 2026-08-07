'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useWallets } from '@/hooks/use-wallets'
import { useCategories } from '@/hooks/use-categories'
import type { UpdateTransactionInput } from '@/hooks/use-transactions'
import type { Transaction } from '@/types/api'

const typeOptions = [
  { value: 'EXPENSE', label: 'Despesa' },
  { value: 'INCOME', label: 'Receita' },
]

const paymentMethodOptions = [
  { value: 'PIX', label: 'Pix' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'BANK_TRANSFER', label: 'Transferência' },
  { value: 'DEBIT_CARD', label: 'Débito' },
]

const editTransactionSchema = z.object({
  amount: z.coerce.number().positive('Informe um valor válido'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  description: z.string().min(1, 'Informe uma descrição'),
  paymentMethod: z.enum(['CASH', 'PIX', 'BANK_TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD']),
  walletId: z.string().min(1, 'Selecione uma carteira'),
})

type EditTransactionFormInput = z.input<typeof editTransactionSchema>
type EditTransactionFormValues = z.output<typeof editTransactionSchema>

type EditTransactionModalProps = {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
  onUpdateTransaction: (id: string, input: UpdateTransactionInput) => Promise<boolean>
  isUpdating: boolean
}

const EditTransactionModal = ({
  isOpen,
  onClose,
  transaction,
  onUpdateTransaction,
  isUpdating,
}: EditTransactionModalProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { wallets } = useWallets()
  const { categories } = useCategories()

  const form = useForm<EditTransactionFormInput, unknown, EditTransactionFormValues>({
    resolver: zodResolver(editTransactionSchema),
    defaultValues: {
      amount: 0,
      type: 'EXPENSE',
      categoryId: '',
      description: '',
      paymentMethod: 'PIX',
      walletId: '',
    },
  })

  useEffect(() => {
    if (!transaction) return
    form.reset({
      amount: transaction.amount,
      type: transaction.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
      categoryId: transaction.categoryId,
      description: transaction.description,
      paymentMethod: transaction.paymentMethod,
      walletId: transaction.walletId ?? '',
    })
  }, [transaction, form])

  const handleClose = () => {
    form.reset()
    setSubmitError(null)
    onClose()
  }

  const onSubmit = async (values: EditTransactionFormValues) => {
    if (!transaction) return
    setSubmitError(null)
    const isSuccess = await onUpdateTransaction(transaction.id, {
      ...values,
      date: transaction.date,
    })
    if (!isSuccess) {
      setSubmitError('Erro ao atualizar transação. Tente novamente.')
      return
    }
    form.reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-[6px] z-[200]"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25, type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[201] ui-surface-dark border-t border-zinc-700 rounded-t-[20px] pb-8 max-h-[95vh] overflow-y-auto lg:max-w-lg lg:mx-auto lg:rounded-2xl lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:border lg:border-zinc-700"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-zinc-700 lg:hidden" />
            </div>

            <div className="flex items-center justify-between px-6 pt-3 pb-5">
              <h2 className="text-foreground m-0 text-xl font-bold">Editar Transação</h2>
              <Button
                variant="secondary"
                size="icon"
                className="bg-muted text-muted-foreground"
                onClick={handleClose}
              >
                <X size={16} />
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 flex flex-col gap-4">
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
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value as number}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                        TIPO
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {typeOptions.map((option) => (
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
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                        CATEGORIA
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
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
                          {wallets.map((w) => (
                            <SelectItem key={w.id} value={w.id}>
                              {w.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {submitError && <p className="text-expense text-sm text-center">{submitError}</p>}

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full mt-1 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold text-[15px]"
                >
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : 'Salvar Alterações'}
                </Button>
              </form>
            </Form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default EditTransactionModal
