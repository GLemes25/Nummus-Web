'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Trash2, Edit3, MoreHorizontal, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import MonthSelector from '@/components/ui/month-selector'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import EditTransactionModal from '@/components/transactions/edit-transaction-modal'
import TransactionFilters from '@/components/transactions/transaction-filters'
import { useDateFilter } from '@/hooks/use-date-filter'
import { useDebounce } from '@/hooks/use-debounce'
import { useTransactions } from '@/hooks/use-transactions'
import type { Transaction, TransactionType } from '@/types/api'

const ALL_VALUE = 'all'

const typeLabels: Record<string, string> = {
  INCOME: 'receita',
  EXPENSE: 'despesa',
  BALANCE_ADJUSTMENT: 'ajuste',
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Hoje'
  if (d.toDateString() === yesterday.toDateString()) return 'Ontem'
  return d.toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })
}

const groupByDate = (txs: Transaction[]) => {
  const groups: Record<string, Transaction[]> = {}
  txs.forEach((tx) => {
    const label = formatDate(tx.date)
    if (!groups[label]) groups[label] = []
    groups[label].push(tx)
  })
  return groups
}

type TransactionsProps = {
  onNewTransaction: () => void
}

const Transactions = ({ onNewTransaction }: TransactionsProps) => {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<TransactionType | typeof ALL_VALUE>(ALL_VALUE)
  const [categoryId, setCategoryId] = useState(ALL_VALUE)
  const [walletId, setWalletId] = useState(ALL_VALUE)
  const [creditCardId, setCreditCardId] = useState(ALL_VALUE)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [realizingId, setRealizingId] = useState<string | null>(null)

  const debouncedSearch = useDebounce(search, 400)

  const { startDate, endDate, label, goToPreviousMonth, goToNextMonth } = useDateFilter()

  const hasActiveFilters =
    type !== ALL_VALUE || categoryId !== ALL_VALUE || walletId !== ALL_VALUE || creditCardId !== ALL_VALUE

  const handleClearFilters = () => {
    setType(ALL_VALUE)
    setCategoryId(ALL_VALUE)
    setWalletId(ALL_VALUE)
    setCreditCardId(ALL_VALUE)
  }

  const handleAccountChange = (nextWalletId: string, nextCreditCardId: string) => {
    setWalletId(nextWalletId)
    setCreditCardId(nextCreditCardId)
  }

  const {
    transactions,
    meta,
    isLoading,
    deleteTransaction,
    updateTransaction,
    isUpdating,
    realizeTransaction,
    isRealizing,
  } = useTransactions({
    limit: 50,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    search: debouncedSearch || undefined,
    type: type === ALL_VALUE ? undefined : type,
    categoryId: categoryId === ALL_VALUE ? undefined : categoryId,
    walletId: walletId === ALL_VALUE ? undefined : walletId,
    creditCardId: creditCardId === ALL_VALUE ? undefined : creditCardId,
  })

  const handleRealizeTransaction = async (id: string) => {
    setRealizingId(id)
    const result = await realizeTransaction(id)
    if (!result.success) {
      console.error(result.error)
    }
    setRealizingId(null)
  }

  const grouped = groupByDate(transactions)
  const dateKeys = Object.keys(grouped)

  const totalIncome = transactions.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((s, t) => s + t.amount, 0)

  return (
    <div className="p-6 pt-7 w-full max-w-200 mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-foreground m-0 mb-1 tracking-tight text-2xl font-bold">Transações</h1>
          <p className="text-muted-foreground m-0 text-sm">
            {meta ? `${meta.totalCount} transações no total` : 'Carregando...'}
          </p>
        </div>
        <Button onClick={onNewTransaction} className="bg-brand text-brand-foreground hover:bg-brand/90">
          + Novo
        </Button>
      </div>

      <div className="mb-5">
        <MonthSelector label={label} onPrevious={goToPreviousMonth} onNext={goToNextMonth} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-income/8 border border-income/20 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-income/80 text-sm">Receita Total</span>
          <span className="text-income font-bold text-base">+R$ {formatCurrency(totalIncome)}</span>
        </div>
        <div className="bg-expense/8 border border-expense/20 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-expense/80 text-sm">Despesas Totais</span>
          <span className="text-expense font-bold text-base">-R$ {formatCurrency(totalExpense)}</span>
        </div>
      </div>

      <TransactionFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        walletId={walletId}
        creditCardId={creditCardId}
        onAccountChange={handleAccountChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <AnimatePresence>
          {dateKeys.length === 0 ? (
            <div className="text-center py-16 text-zinc-600">
              Nenhuma transação corresponde ao filtro
            </div>
          ) : (
            dateKeys.map((dateLabel, gi) => (
              <motion.div
                key={dateLabel}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.04 }}
                className="mb-5"
              >
                <div className="text-zinc-600 text-xs font-semibold tracking-[0.8px] uppercase mb-2 pl-1">
                  {dateLabel}
                </div>

                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  {grouped[dateLabel].map((tx, i) => (
                    <div
                      key={tx.id}
                      className={`flex items-center px-4 py-3.5 hover:bg-foreground/2 transition-colors ${
                        tx.status === 'PENDING'
                          ? 'opacity-60 border border-dashed border-border'
                          : ''
                      }`}
                      style={{
                        borderBottom:
                          i < grouped[dateLabel].length - 1 && tx.status !== 'PENDING'
                            ? '1px solid var(--border)'
                            : undefined,
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
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-600 text-xs">{tx.category?.name ?? 'Sem categoria'}</span>
                          {tx.wallet && (
                            <>
                              <span className="text-zinc-700 text-xs">·</span>
                              <span className="text-zinc-700 text-xs">{tx.wallet.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div
                          className={`font-bold text-[15px] tracking-tight ${
                            tx.type === 'INCOME' ? 'text-income' : 'text-expense'
                          }`}
                        >
                          {tx.type === 'INCOME' ? '+' : '-'}R$ {formatCurrency(tx.amount)}
                        </div>
                        <div className="text-zinc-700 text-xs mt-0.5">{typeLabels[tx.type]}</div>
                      </div>
                      {tx.status === 'PENDING' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isRealizing && realizingId === tx.id}
                          onClick={() => handleRealizeTransaction(tx.id)}
                          className="ml-2 shrink-0 w-8 h-8 text-income hover:text-income hover:bg-income/10"
                          title="Dar baixa"
                        >
                          {isRealizing && realizingId === tx.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 shrink-0 w-8 h-8 text-zinc-600 hover:text-foreground"
                            >
                              <MoreHorizontal size={14} />
                            </Button>
                          }
                        />
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setEditingTransaction(tx)}>
                            <Edit3 size={14} />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeletingTransaction(tx)}
                          >
                            <Trash2 size={14} />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      )}

      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onUpdateTransaction={updateTransaction}
        isUpdating={isUpdating}
      />

      <AlertDialog
        open={!!deletingTransaction}
        onOpenChange={(open: boolean) => {
          if (!open) setDeletingTransaction(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a transação &quot;{deletingTransaction?.description}
              &quot;? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={async () => {
                if (!deletingTransaction) return
                setIsDeleting(true)
                await deleteTransaction(deletingTransaction.id)
                setIsDeleting(false)
                setDeletingTransaction(null)
              }}
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Transactions
