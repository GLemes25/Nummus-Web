'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TransactionForm, {
  type TransactionFormValues,
} from '@/components/transactions/transaction-form'
import type { TransactionMutationResult, UpdateTransactionInput } from '@/hooks/use-transactions'
import type { Transaction } from '@/types/api'

type EditTransactionModalProps = {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
  onUpdateTransaction: (id: string, input: UpdateTransactionInput) => Promise<TransactionMutationResult>
  isUpdating: boolean
}

const EditTransactionModal = ({
  isOpen,
  onClose,
  transaction,
  onUpdateTransaction,
  isUpdating,
}: EditTransactionModalProps) => (
  <Dialog
    open={isOpen}
    onOpenChange={(open: boolean) => {
      if (!open) onClose()
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
            defaultValues={{
              type: transaction.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
              amount: String(transaction.amount),
              categoryId: transaction.categoryId ?? undefined,
              description: transaction.description,
              paymentMethod: transaction.paymentMethod as TransactionFormValues['paymentMethod'],
              walletId: transaction.walletId ?? undefined,
              creditCardId: transaction.creditCardId ?? undefined,
              date: new Date(transaction.date),
            }}
            isSubmitting={isUpdating}
            submitLabel="Salvar Alterações"
            onSubmit={(values) =>
              onUpdateTransaction(transaction.id, { ...values, date: values.date.toISOString() })
            }
            onSuccess={onClose}
          />
        </div>
      )}
    </DialogContent>
  </Dialog>
)

export default EditTransactionModal
