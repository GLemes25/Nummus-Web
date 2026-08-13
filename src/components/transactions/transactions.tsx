'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Trash2, Edit3, MoreHorizontal, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
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
import { useTransactions } from '@/hooks/use-transactions'
import type { Transaction } from '@/types/api'

const filterLabels: Record<string, string> = {
  all: 'Todos',
  INCOME: 'Receita',
  EXPENSE: 'Despesa',
  BALANCE_ADJUSTMENT: 'Ajuste',
}

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
  const [filter, setFilter] = useState<'all' | 'INCOME' | 'EXPENSE' | 'BALANCE_ADJUSTMENT'>('all')
  const [search, setSearch] = useState('')
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { transactions, meta, isLoading, deleteTransaction, updateTransaction, isUpdating } =
    useTransactions({ limit: 50 })

  const filtered = transactions.filter((tx) => {
    const matchType = filter === 'all' || tx.type === filter
    const matchSearch =
      !search ||
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      (tx.category?.name.toLowerCase().includes(search.toLowerCase()) ?? false)
    return matchType && matchSearch
  })

  const grouped = groupByDate(filtered)
  const dateKeys = Object.keys(grouped)

  const totalIncome = filtered.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered
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

      <div className="flex gap-2.5 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-50">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar transações…"
            className="pl-9 bg-card border-border text-foreground"
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'INCOME', 'EXPENSE'] as const).map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant={filter === f ? 'secondary' : 'outline'}
              size="sm"
              className={
                filter === f
                  ? 'bg-brand/15 text-brand-muted border-brand/40'
                  : 'bg-card border-border text-muted-foreground'
              }
            >
              {filterLabels[f]}
            </Button>
          ))}
        </div>
      </div>

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
                      className="flex items-center px-4 py-3.5 hover:bg-foreground/2 transition-colors"
                      style={{
                        borderBottom:
                          i < grouped[dateLabel].length - 1 ? '1px solid #1f1f22' : 'none',
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
