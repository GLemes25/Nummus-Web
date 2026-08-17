'use client'

import { motion } from 'motion/react'
import { ArrowDownRight, ArrowUpRight, Loader2, TrendingDown, TrendingUp, Wallet2 } from 'lucide-react'

type IncomeOrExpense = 'INCOME' | 'EXPENSE'

type SummaryCardsProps = {
  monthlyIncome: number
  monthlyExpenses: number
  savings: number
  isLoading: boolean
  onSelectType: (type: IncomeOrExpense) => void
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const SummaryCards = ({
  monthlyIncome,
  monthlyExpenses,
  savings,
  isLoading,
  onSelectType,
}: SummaryCardsProps) => {
  // Deltas ainda não são retornados pela API — mockados até o histórico mensal existir
  const stats = [
    {
      label: 'Receita',
      value: `R$ ${formatCurrency(monthlyIncome)}`,
      trendLabel: '+12,4% vs. mês anterior',
      TrendIcon: TrendingUp,
      type: 'income' as const,
      txType: 'INCOME' as const,
      Icon: ArrowUpRight,
    },
    {
      label: 'Despesas',
      value: `R$ ${formatCurrency(monthlyExpenses)}`,
      trendLabel: '+8,1% vs. mês anterior',
      TrendIcon: TrendingUp,
      type: 'expense' as const,
      txType: 'EXPENSE' as const,
      Icon: ArrowDownRight,
    },
    {
      label: 'Economias',
      value: `R$ ${formatCurrency(Math.max(savings, 0))}`,
      trendLabel: savings >= 0 ? 'saldo positivo do período' : 'saldo negativo do período',
      TrendIcon: savings >= 0 ? TrendingUp : TrendingDown,
      type: 'neutral' as const,
      txType: null,
      Icon: Wallet2,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-5">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.06 }}
          className={`bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl p-4 py-4.5 transition-colors ${
            stat.txType ? 'cursor-pointer hover:border-border' : ''
          }`}
          onClick={stat.txType ? () => onSelectType(stat.txType) : undefined}
        >
          <div className="flex justify-between mb-2.5">
            <span className="text-muted-foreground text-sm">{stat.label}</span>
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center ${
                stat.type === 'income'
                  ? 'bg-income/12'
                  : stat.type === 'expense'
                    ? 'bg-expense/12'
                    : 'bg-gold/12'
              }`}
            >
              <stat.Icon
                size={15}
                className={
                  stat.type === 'income'
                    ? 'text-income'
                    : stat.type === 'expense'
                      ? 'text-expense'
                      : 'text-gold'
                }
              />
            </div>
          </div>
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="text-foreground font-bold text-xl mb-1 tracking-tight">
                {stat.value}
              </div>
              <div
                className={`flex items-center text-xs ${
                  stat.type === 'income'
                    ? 'text-income'
                    : stat.type === 'expense'
                      ? 'text-expense'
                      : stat.TrendIcon === TrendingUp
                        ? 'text-income'
                        : 'text-expense'
                }`}
              >
                <stat.TrendIcon className="w-4 h-4 mr-1" />
                {stat.trendLabel}
              </div>
            </>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default SummaryCards
