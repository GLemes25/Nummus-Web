'use client'

import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useTransactions } from '@/hooks/use-transactions'
import { evaluateMathExpression } from '@/lib/evaluateMathExpression'
import type { Wallet } from '@/types/api'

const isPlainNumber = (value: string) => /^-?\d+(\.\d+)?$/.test(value.trim())

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const adjustBalanceSchema = z.object({
  actualBalance: z.string().min(1, 'Informe o saldo atual').refine(
    (raw) => evaluateMathExpression(raw) !== null,
    { message: 'Informe um valor válido' }
  ),
})

type AdjustBalanceFormValues = z.infer<typeof adjustBalanceSchema>

type AdjustBalanceModalProps = {
  isOpen: boolean
  onClose: () => void
  wallet: Wallet | null
  onAdjusted: () => void
}

const AdjustBalanceModal = ({ isOpen, onClose, wallet, onAdjusted }: AdjustBalanceModalProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const { createTransaction, isCreating } = useTransactions({ enabled: false })

  const form = useForm<AdjustBalanceFormValues>({
    resolver: zodResolver(adjustBalanceSchema),
    defaultValues: { actualBalance: '' },
  })

  useEffect(() => {
    if (!wallet || !isOpen) return
    form.reset({ actualBalance: String(wallet.balance) })
  }, [wallet, isOpen, form])

  const rawValue = useWatch({ control: form.control, name: 'actualBalance' })
  const parsedValue = useMemo(() => {
    if (!rawValue) return null
    return evaluateMathExpression(rawValue)
  }, [rawValue])

  const difference = useMemo(() => {
    if (!wallet || parsedValue === null) return null
    return Math.round((parsedValue - wallet.balance) * 100) / 100
  }, [wallet, parsedValue])

  const handleClose = () => {
    form.reset()
    setSubmitError(null)
    setInfoMessage(null)
    onClose()
  }

  const onSubmit = async (values: AdjustBalanceFormValues) => {
    if (!wallet) return
    setSubmitError(null)
    setInfoMessage(null)

    const actualBalance = evaluateMathExpression(values.actualBalance)
    if (actualBalance === null) {
      setSubmitError('Informe um valor válido')
      return
    }

    const balanceDifference = Math.round((actualBalance - wallet.balance) * 100) / 100
    if (balanceDifference === 0) {
      setInfoMessage('O saldo informado já corresponde ao saldo atual da carteira')
      return
    }

    const result = await createTransaction({
      walletId: wallet.id,
      amount: Math.abs(balanceDifference),
      type: balanceDifference > 0 ? 'INCOME' : 'EXPENSE',
      paymentMethod: 'TRANSFER',
      description: 'Ajuste de Saldo',
      date: new Date().toISOString(),
      status: 'COMPLETED',
    })

    if (!result.success) {
      setSubmitError(result.error ?? 'Erro ao ajustar saldo. Tente novamente.')
      return
    }

    form.reset()
    onAdjusted()
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
          <DialogTitle>Ajustar Saldo</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto px-4 pb-4 flex flex-col gap-4">
          {wallet && (
            <div className="bg-muted rounded-xl px-4 py-3.5 flex items-center justify-between">
              <div className="text-muted-foreground text-xs">Saldo atual do sistema</div>
              <div className="text-foreground font-semibold text-sm">
                {wallet.balance < 0 ? '-' : ''}
                {wallet.currency} {formatCurrency(Math.abs(wallet.balance))}
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="actualBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                      SALDO ATUAL REAL
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        {...field}
                        onBlur={(event) => {
                          field.onBlur()
                          const evaluated = evaluateMathExpression(event.target.value)
                          if (evaluated !== null && !isPlainNumber(event.target.value)) {
                            form.setValue('actualBalance', String(evaluated), { shouldValidate: true })
                          }
                        }}
                      />
                    </FormControl>
                    {difference !== null && difference !== 0 && (
                      <p className={`text-xs ${difference > 0 ? 'text-income' : 'text-expense'}`}>
                        {difference > 0 ? 'Será lançada uma receita de ' : 'Será lançada uma despesa de '}
                        {formatCurrency(Math.abs(difference))} para compensar a diferença
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {infoMessage && <p className="text-muted-foreground text-sm text-center">{infoMessage}</p>}
              {submitError && <p className="text-expense text-sm text-center">{submitError}</p>}

              <Button
                type="submit"
                disabled={isCreating}
                className="w-full mt-1 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold text-[15px]"
              >
                {isCreating ? <Loader2 size={16} className="animate-spin" /> : 'Salvar Ajuste'}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AdjustBalanceModal
