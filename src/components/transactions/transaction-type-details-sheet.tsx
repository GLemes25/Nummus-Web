'use client'

import { Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { useTransactions } from '@/hooks/use-transactions'

type IncomeOrExpense = 'INCOME' | 'EXPENSE'

type TransactionTypeDetailsSheetProps = {
  type: IncomeOrExpense | null
  onClose: () => void
}

const typeTitles: Record<IncomeOrExpense, string> = {
  INCOME: 'Receitas',
  EXPENSE: 'Despesas',
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const TransactionTypeDetailsSheet = ({ type, onClose }: TransactionTypeDetailsSheetProps) => {
  const isOpen = !!type

  const { transactions, isLoading } = useTransactions({
    type: type ?? undefined,
    limit: 50,
    enabled: isOpen,
  })

  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{type ? typeTitles[type] : 'Transações'}</SheetTitle>
          <SheetDescription>
            {type
              ? `${type === 'INCOME' ? '+' : '-'}R$ ${formatCurrency(total)} no total`
              : ''}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={22} className="animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Nenhuma transação encontrada
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
                    className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center mr-3.5 shrink-0"
                    style={{
                      backgroundColor: tx.category.color + '22',
                      border: `1px solid ${tx.category.color}44`,
                    }}
                  >
                    <DynamicIcon name={tx.category.icon} size={19} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground text-sm font-medium mb-0.5 truncate">
                      {tx.description}
                    </div>
                    <div className="text-zinc-600 text-xs">
                      {tx.category.name}
                      {tx.wallet ? ` · ${tx.wallet.name}` : ''} ·{' '}
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
      </SheetContent>
    </Sheet>
  )
}

export default TransactionTypeDetailsSheet
