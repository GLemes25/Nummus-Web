'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import TransactionForm from '@/components/transactions/transaction-form'
import TransferForm from '@/components/transactions/transfer-form'
import { useTransactions } from '@/hooks/use-transactions'

type TransactionModalProps = {
  isOpen: boolean
  onClose: () => void
}

type Mode = 'transaction' | 'transfer'

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
