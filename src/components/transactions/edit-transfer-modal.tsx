'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TransferForm from '@/components/transactions/transfer-form'
import { apiClient } from '@/lib/api-client'
import type { Transaction } from '@/types/api'

type TransferDetails = {
  id: string
  sourceWalletId: string
  destinationWalletId: string
  amount: number
  date: string
  description: string | null
}

type EditTransferModalProps = {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction | null
}

const EditTransferModal = ({ isOpen, onClose, transaction }: EditTransferModalProps) => {
  const [transferDetails, setTransferDetails] = useState<TransferDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !transaction) return

    let isCancelled = false
    Promise.resolve()
      .then(() => {
        setIsLoading(true)
        setLoadError(null)
        return apiClient.get(`/transfers/by-transaction/${transaction.id}`)
      })
      .then((res) => {
        if (isCancelled) return
        if (!res || !res.ok) {
          setLoadError('Falha ao carregar a transferência')
          return
        }
        return res.json().then((data: TransferDetails) => {
          if (!isCancelled) setTransferDetails(data)
        })
      })
      .catch(() => {
        if (!isCancelled) setLoadError('Falha ao carregar a transferência')
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [isOpen, transaction])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Transferência</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto px-4 pb-4">
          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </div>
          )}
          {!isLoading && loadError && (
            <p className="text-expense text-sm text-center py-6">{loadError}</p>
          )}
          {!isLoading && transferDetails && (
            <TransferForm
              key={transferDetails.id}
              transferId={transferDetails.id}
              defaultValues={{
                sourceWalletId: transferDetails.sourceWalletId,
                destinationWalletId: transferDetails.destinationWalletId,
                amount: String(transferDetails.amount),
                date: new Date(transferDetails.date),
              }}
              submitLabel="Salvar Alterações"
              onSuccess={onClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditTransferModal
