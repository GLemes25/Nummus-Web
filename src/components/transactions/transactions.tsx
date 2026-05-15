'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Transaction = {
  id: number;
  date: string;
  icon: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  wallet: string;
};

const allTransactions: Transaction[] = [
  { id: 1, date: '2026-05-14', icon: '🛒', category: 'Alimentação', description: 'Whole Foods Market', amount: -89.5, type: 'expense', wallet: 'Chase Checking' },
  { id: 2, date: '2026-05-14', icon: '💼', category: 'Receita', description: 'Salário Mensal — Maio', amount: 5200.0, type: 'income', wallet: 'Chase Checking' },
  { id: 3, date: '2026-05-13', icon: '🚕', category: 'Transporte', description: 'Uber Ride · 12:34', amount: -24.99, type: 'expense', wallet: 'Chase Checking' },
  { id: 4, date: '2026-05-13', icon: '🎬', category: 'Entretenimento', description: 'Netflix Premium', amount: -17.99, type: 'expense', wallet: 'Chase Checking' },
  { id: 5, date: '2026-05-12', icon: '🏋️', category: 'Saúde', description: 'Gym Membership', amount: -49.0, type: 'expense', wallet: 'Chase Checking' },
  { id: 6, date: '2026-05-12', icon: '☕', category: 'Alimentação', description: 'Blue Bottle Coffee', amount: -7.5, type: 'expense', wallet: 'Dinheiro' },
  { id: 7, date: '2026-05-12', icon: '💸', category: 'Transferência', description: 'Transferência para Poupança', amount: -500.0, type: 'transfer', wallet: 'Chase Checking' },
  { id: 8, date: '2026-05-11', icon: '🏠', category: 'Moradia', description: 'Aluguel — Maio', amount: -1800.0, type: 'expense', wallet: 'Chase Checking' },
  { id: 9, date: '2026-05-11', icon: '📦', category: 'Compras', description: 'Amazon Prime Order', amount: -67.4, type: 'expense', wallet: 'Chase Checking' },
  { id: 10, date: '2026-05-10', icon: '💰', category: 'Receita', description: 'Projeto Freelance — Kit UI', amount: 850.0, type: 'income', wallet: 'Chase Checking' },
  { id: 11, date: '2026-05-10', icon: '⚡', category: 'Utilidades', description: 'Electricity Bill', amount: -94.2, type: 'expense', wallet: 'Chase Checking' },
  { id: 12, date: '2026-05-09', icon: '🛍️', category: 'Compras', description: 'Zara — Spring Collection', amount: -142.0, type: 'expense', wallet: 'Chase Visa' },
  { id: 13, date: '2026-05-09', icon: '🍕', category: 'Alimentação', description: "Roberta's Pizza", amount: -38.5, type: 'expense', wallet: 'Chase Visa' },
  { id: 14, date: '2026-05-08', icon: '📱', category: 'Utilidades', description: 'Phone Bill — T-Mobile', amount: -55.0, type: 'expense', wallet: 'Chase Checking' },
  { id: 15, date: '2026-05-08', icon: '🎵', category: 'Entretenimento', description: 'Spotify Premium', amount: -9.99, type: 'expense', wallet: 'Chase Checking' },
];

const filterLabels: Record<string, string> = {
  all: 'Todos',
  income: 'Receita',
  expense: 'Despesa',
  transfer: 'Transferência',
};

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (dateStr === '2026-05-14') return 'Hoje';
  if (dateStr === '2026-05-13') return 'Ontem';
  return d.toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' });
};

const groupByDate = (txs: Transaction[]) => {
  const groups: Record<string, Transaction[]> = {};
  txs.forEach((tx) => {
    const label = formatDate(tx.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
  });
  return groups;
};

const typeLabels: Record<string, string> = {
  income: 'receita',
  expense: 'despesa',
  transfer: 'transferência',
};

type TransactionsProps = {
  onNewTransaction: () => void;
};

const Transactions = ({ onNewTransaction }: TransactionsProps) => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [search, setSearch] = useState('');

  const filtered = allTransactions.filter((tx) => {
    const matchType = filter === 'all' || tx.type === filter;
    const matchSearch =
      !search ||
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const grouped = groupByDate(filtered);
  const dateKeys = Object.keys(grouped);
  const totalIncome = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="p-6 pt-7 max-w-[800px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-foreground m-0 mb-1 tracking-tight text-2xl font-bold">Transações</h1>
          <p className="text-muted-foreground m-0 text-sm">{filtered.length} transações · Mai. 2026</p>
        </div>
        <Button onClick={onNewTransaction} className="bg-brand text-brand-foreground hover:bg-brand/90">
          + Novo
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-income/[0.08] border border-income/20 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-income/80 text-sm">Receita Total</span>
          <span className="text-income font-bold text-base">+${totalIncome.toFixed(2)}</span>
        </div>
        <div className="bg-expense/[0.08] border border-expense/20 rounded-xl px-4 py-3 flex justify-between items-center">
          <span className="text-expense/80 text-sm">Despesas Totais</span>
          <span className="text-expense font-bold text-base">-${totalExpense.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2.5 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar transações…"
            className="pl-9 bg-card border-border text-foreground"
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'income', 'expense', 'transfer'] as const).map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant={filter === f ? 'secondary' : 'outline'}
              size="sm"
              className={filter === f ? 'bg-brand/15 text-brand-muted border-brand/40' : 'bg-card border-border text-muted-foreground'}
            >
              {filterLabels[f]}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {dateKeys.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">Nenhuma transação corresponde ao filtro</div>
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
                    className="flex items-center px-4 py-3.5 cursor-pointer hover:bg-foreground/[0.02] transition-colors"
                    style={{ borderBottom: i < grouped[dateLabel].length - 1 ? '1px solid #1f1f22' : 'none' }}
                  >
                    <div className="w-[42px] h-[42px] rounded-[11px] bg-muted flex items-center justify-center text-[19px] mr-3.5 shrink-0">
                      {tx.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-foreground text-sm font-medium mb-0.5 truncate">{tx.description}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-600 text-xs">{tx.category}</span>
                        <span className="text-zinc-700 text-xs">·</span>
                        <span className="text-zinc-700 text-xs">{tx.wallet}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className={`font-bold text-[15px] tracking-tight ${tx.type === 'income' ? 'text-income' : tx.type === 'transfer' ? 'text-gold' : 'text-expense'}`}>
                        {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                      </div>
                      <div className="text-zinc-700 text-xs mt-0.5">
                        {typeLabels[tx.type]}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-700 ml-2 shrink-0" />
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

export default Transactions;
