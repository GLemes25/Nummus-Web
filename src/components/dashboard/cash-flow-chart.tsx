'use client'

import { eachDayOfInterval, format, startOfMonth } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from '@/components/ui/chart'
import CashFlowTooltip from '@/components/dashboard/cash-flow-tooltip'
import { useTransactions } from '@/hooks/use-transactions'
import type { ChartConfig } from '@/components/ui/chart'
import type { Transaction } from '@/types/api'

type DailyCashFlow = {
  date: string
  income: number
  expense: number
}

const chartConfig = {
  income: { label: 'Receitas', color: 'var(--color-income)' },
  expense: { label: 'Despesas', color: 'var(--color-expense)' },
} satisfies ChartConfig

const buildCashFlowSeries = (transactions: Transaction[]): DailyCashFlow[] => {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const days = eachDayOfInterval({ start: monthStart, end: now })

  const dailyTotals = new Map<string, { income: number; expense: number }>()
  days.forEach((day) => dailyTotals.set(format(day, 'yyyy-MM-dd'), { income: 0, expense: 0 }))

  transactions.forEach((transaction) => {
    if (transaction.type !== 'INCOME' && transaction.type !== 'EXPENSE') return
    const transactionDate = new Date(transaction.date)
    if (transactionDate < monthStart || transactionDate > now) return

    const key = format(transactionDate, 'yyyy-MM-dd')
    const bucket = dailyTotals.get(key)
    if (!bucket) return

    if (transaction.type === 'INCOME') {
      bucket.income += transaction.amount
    } else {
      bucket.expense += transaction.amount
    }
  })

  return days.map((day) => {
    const bucket = dailyTotals.get(format(day, 'yyyy-MM-dd'))!
    return { date: format(day, 'dd/MM'), income: bucket.income, expense: bucket.expense }
  })
}

const formatCompactCurrency = (value: number) => {
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`
  return `R$ ${value.toFixed(0)}`
}

const CashFlowChart = () => {
  const { transactions, isLoading } = useTransactions({ limit: 100 })

  const data = buildCashFlowSeries(transactions)
  const hasMovement = data.some((day) => day.income > 0 || day.expense > 0)

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-5">
      <div className="mb-5">
        <h3 className="text-foreground m-0 mb-1 font-semibold">Fluxo de Caixa</h3>
        <p className="text-muted-foreground text-sm m-0">Receitas x despesas no mês atual</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={22} className="animate-spin text-muted-foreground" />
        </div>
      ) : !hasMovement ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          Nenhuma movimentação neste mês ainda
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.4} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={48}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              tickFormatter={formatCompactCurrency}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }}
              content={<CashFlowTooltip />}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={[3, 3, 0, 0]} maxBarSize={18} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={[3, 3, 0, 0]} maxBarSize={18} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}

export default CashFlowChart
