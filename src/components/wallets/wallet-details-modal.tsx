'use client'

import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { useTransactions } from '@/hooks/use-transactions'
import type { Wallet } from '@/types/api'

type WalletDetailsModalProps = {
  wallet: Wallet | null
  onClose: () => void
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const WalletDetailsModal = ({ wallet, onClose }: WalletDetailsModalProps) => {
  const isOpen = !!wallet

  const { transactions, isLoading } = useTransactions({
    walletId: wallet?.id,
    limit: 50,
    enabled: isOpen,
  })

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{wallet?.name ?? 'Carteira'}</DialogTitle>
          <DialogDescription>
            {wallet
              ? `${wallet.currency} ${formatCurrency(wallet.balance)} · histórico de transações`
              : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={22} className="animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Nenhuma transação encontrada para esta carteira
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {transactions.map((tx, i) => (
                <div
                  key={tx.id}
                  className="flex items-center px-4 py-3.5"
                  style={{
                    borderBottom:
                      i < transactions.length - 1 ? '1px solid #1f1f22' : 'none',
                  }}
                >
                  <div
                    className="w-10.5 h-10.5 rounded-[11px] flex items-center justify-center mr-3.5 shrink-0"
                    style={{
                      backgroundColor: (tx.category?.color ?? '#71717a') + '22',
                      border: `1px solid ${tx.category?.color ?? '#71717a'}44`,
                    }}
                  >
                    <DynamicIcon name={tx.category?.icon ?? 'circle'} size={19} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground text-sm font-medium mb-0.5 truncate">
                      {tx.description}
                    </div>
                    <div className="text-zinc-600 text-xs">
                      {tx.category?.name ?? 'Sem categoria'} ·{' '}
                      {new Date(tx.date).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </div>
                  <div
                    className={`${tx.type === 'INCOME' ? 'text-income' : 'text-expense'} font-bold text-[15px] tracking-tight shrink-0 ml-3`}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}R$ {formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WalletDetailsModal
