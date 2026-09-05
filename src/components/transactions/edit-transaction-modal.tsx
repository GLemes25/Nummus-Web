'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import RecurringUpdateModeDialog from '@/components/transactions/recurring-update-mode-dialog'
import TransactionForm, {
  type TransactionFormSubmitValues,
  type TransactionFormValues,
} from '@/components/transactions/transaction-form'
import type { TransactionMutationResult, UpdateTransactionInput } from '@/hooks/use-transactions'
import type { Transaction, TransactionUpdateMode } from '@/types/api'

type EditTransactionModalProps = {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
  onUpdateTransaction: (id: string, input: UpdateTransactionInput) => Promise<TransactionMutationResult>
  isUpdating: boolean
}

type PendingUpdate = {
  values: TransactionFormSubmitValues
  resolve: (result: TransactionMutationResult) => void
}

const EditTransactionModal = ({
  isOpen,
  onClose,
  transaction,
  onUpdateTransaction,
  isUpdating,
}: EditTransactionModalProps) => {
  const [pendingUpdate, setPendingUpdate] = useState<PendingUpdate | null>(null)

  const cancelPendingUpdate = () => {
    pendingUpdate?.resolve({ success: false, error: '' })
    setPendingUpdate(null)
  }

  const handleClose = () => {
    cancelPendingUpdate()
    onClose()
  }

  const handleSelectUpdateMode = async (updateMode: TransactionUpdateMode) => {
    if (!pendingUpdate || !transaction) return
    const { values, resolve } = pendingUpdate
    const result = await onUpdateTransaction(transaction.id, {
      ...values,
      date: values.date.toISOString(),
      updateMode,
    })
    setPendingUpdate(null)
    resolve(result)
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open: boolean) => {
          if (!open) handleClose()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
          </DialogHeader>

          {transaction && (
            <div className="overflow-y-auto px-4 pb-4">
              <TransactionForm
                key={transaction.id}
                allowRecurrence={false}
                defaultValues={{
                  type: transaction.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
                  amount: String(transaction.amount),
                  categoryId: transaction.categoryId ?? undefined,
                  description: transaction.description,
                  paymentMethod: transaction.paymentMethod as TransactionFormValues['paymentMethod'],
                  walletId: transaction.walletId ?? undefined,
                  creditCardId: transaction.creditCardId ?? undefined,
                  date: new Date(transaction.date),
                  status: transaction.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
                }}
                isSubmitting={isUpdating}
                submitLabel="Salvar Alterações"
                onSubmit={(values) => {
                  if (transaction.recurringTransactionId) {
                    return new Promise<TransactionMutationResult>((resolve) => {
                      setPendingUpdate({ values, resolve })
                    })
                  }
                  return onUpdateTransaction(transaction.id, {
                    ...values,
                    date: values.date.toISOString(),
                  })
                }}
                onSuccess={onClose}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RecurringUpdateModeDialog
        isOpen={!!pendingUpdate}
        onClose={cancelPendingUpdate}
        onSelectMode={handleSelectUpdateMode}
        isSubmitting={isUpdating}
      />
    </>
  )
}

export default EditTransactionModal
