'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { TransactionUpdateMode } from '@/types/api'

type RecurringUpdateModeDialogProps = {
  isOpen: boolean
  onClose: () => void
  onSelectMode: (mode: TransactionUpdateMode) => void
  isSubmitting: boolean
}

const RecurringUpdateModeDialog = ({
  isOpen,
  onClose,
  onSelectMode,
  isSubmitting,
}: RecurringUpdateModeDialogProps) => (
  <Dialog
    open={isOpen}
    onOpenChange={(open: boolean) => {
      if (!open && !isSubmitting) onClose()
    }}
  >
    <DialogContent className="max-w-sm" showCloseButton={!isSubmitting}>
      <DialogHeader>
        <DialogTitle>Como você deseja salvar?</DialogTitle>
        <DialogDescription>
          Esta transação faz parte de uma série recorrente.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-2 px-4 pb-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className="justify-start bg-zinc-900 font-normal"
          onClick={() => onSelectMode('SINGLE')}
        >
          Apenas esta transação
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          className="justify-start bg-zinc-900 font-normal"
          onClick={() => onSelectMode('FUTURE')}
        >
          Esta e todas as futuras
        </Button>
        {isSubmitting && (
          <div className="flex justify-center pt-2">
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
)

export default RecurringUpdateModeDialog
