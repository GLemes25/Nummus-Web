'use client';

import { motion } from 'motion/react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet2, Bell, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomTooltip from '@/components/dashboard/custom-tooltip';
import type { AppView } from '@/types/app';

const areaData = [
  { month: 'Dez', balance: 98200 },
  { month: 'Jan', balance: 102400 },
  { month: 'Fev', balance: 99800 },
  { month: 'Mar', balance: 108600 },
  { month: 'Abr', balance: 119200 },
  { month: 'Mai', balance: 124850 },
];

const categoryData = [
  { name: 'Moradia', value: 1800, color: '#7C3AED' },
  { name: 'Alimentação', value: 680, color: '#10B981' },
  { name: 'Transporte', value: 340, color: '#F43F5E' },
  { name: 'Compras', value: 520, color: '#BFA071' },
  { name: 'Saúde', value: 180, color: '#06B6D4' },
  { name: 'Outros', value: 261, color: '#8B5CF6' },
];

const recentTransactions = [
  { id: 1, date: 'Hoje', icon: '🛒', category: 'Alimentação', description: 'Whole Foods Market', amount: -89.5 },
  { id: 2, date: 'Hoje', icon: '💼', category: 'Receita', description: 'Salário Mensal — Maio', amount: 5200.0 },
  { id: 3, date: 'Ontem', icon: '🚕', category: 'Transporte', description: 'Uber Ride', amount: -24.99 },
  { id: 4, date: 'Ontem', icon: '🎬', category: 'Entretenimento', description: 'Netflix Premium', amount: -17.99 },
  { id: 5, date: '12 de mai.', icon: '🏋️', category: 'Saúde', description: 'Gym Membership', amount: -49.0 },
];

type DashboardProps = {
  onNewTransaction: () => void;
  onNavigate: (view: AppView) => void;
};

const Dashboard = ({ onNavigate }: DashboardProps) => (
  <div className="p-6 pt-7 max-w-275">
    <div className="flex items-center justify-between mb-7">
      <div>
        <div className="text-muted-foreground text-sm mb-0.5">Quinta-feira, 14 de maio de 2026</div>
        <h1 className="text-foreground m-0 tracking-tight text-2xl font-bold">Bom dia, Alex 👋</h1>
      </div>
      <div className="flex gap-2.5 items-center">
        <Button variant="outline" size="icon" className="relative bg-card border-border text-muted-foreground">
          <Bell size={17} />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-expense border-2 border-background" />
        </Button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-foreground font-bold text-sm cursor-pointer shrink-0" style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
          AJ
        </div>
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="bg-card border border-border rounded-2xl p-7 mb-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #18181b 0%, #1e1030 60%, #18181b 100%)' }}
    >
      <div className="absolute -top-12 -right-12 w-55 h-55 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(124,58,237,0.18)_0%,transparent_70%)]" />
      <div className="absolute -bottom-8 left-25 w-35 h-35 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(191,160,113,0.08)_0%,transparent_70%)]" />
      <div className="text-muted-foreground text-xs tracking-[1.5px] mb-2.5">PATRIMÔNIO LÍQUIDO TOTAL</div>
      <div className="text-gold text-5xl font-extrabold tracking-tight mb-3 leading-none">$124.850,00</div>
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="flex items-center gap-1 bg-income/10 text-income px-3 py-1 rounded-full text-sm font-medium border border-income/20">
          <TrendingUp size={13} />
          +4,74% este mês
        </div>
        <span className="text-zinc-600 text-sm">+$5.650 desde abril</span>
      </div>
    </motion.div>

    <div className="grid grid-cols-3 gap-4 mb-5">
      {[
        { label: 'Receita', value: '$5.200,00', change: '+12,3% vs. mês anterior', type: 'income', Icon: ArrowUpRight },
        { label: 'Despesas', value: '$3.781,48', change: '-8,1% vs. mês anterior', type: 'expense', Icon: ArrowDownRight },
        { label: 'Economias', value: '$1.418,52', change: '27,3% taxa de poupança', type: 'neutral', Icon: Wallet2 },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.06 }}
          className="bg-card border border-border rounded-xl p-4 py-[18px]"
        >
          <div className="flex justify-between mb-2.5">
            <span className="text-muted-foreground text-sm">{stat.label}</span>
            <div
              className="w-7 h-7 rounded-[7px] flex items-center justify-center"
              style={{
                backgroundColor:
                  stat.type === 'income'
                    ? 'rgba(16,185,129,0.12)'
                    : stat.type === 'expense'
                    ? 'rgba(244,63,94,0.12)'
                    : 'rgba(191,160,113,0.12)',
              }}
            >
              <stat.Icon
                size={15}
                className={stat.type === 'income' ? 'text-income' : stat.type === 'expense' ? 'text-expense' : 'text-gold'}
              />
            </div>
          </div>
          <div className="text-foreground font-bold text-xl mb-1 tracking-tight">{stat.value}</div>
          <div className={stat.type === 'income' ? 'text-income text-xs' : stat.type === 'expense' ? 'text-expense text-xs' : 'text-gold text-xs'}>
            {stat.change}
          </div>
        </motion.div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-5">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-5">
          <h3 className="text-foreground m-0 mb-1 font-semibold">Tendência de Saldo</h3>
          <p className="text-muted-foreground text-sm m-0">Patrimônio líquido nos últimos 6 meses</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={areaData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="balance" stroke="#7C3AED" strokeWidth={2.5} fill="url(#balGrad)" dot={false} activeDot={{ r: 5, fill: '#7C3AED', stroke: '#18181b', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="mb-3.5">
          <h3 className="text-foreground m-0 mb-1 font-semibold">Gastos</h3>
          <p className="text-muted-foreground text-sm m-0">Por categoria · Mai. 2026</p>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
              {categoryData.map((entry, index) => (
                <Cell key={`c-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: 8, color: '#fafafa', fontSize: 13 }}
              formatter={(v) => [`$${Number(v).toFixed(0)}`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-1.5">
          {categoryData.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-[2px] shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-zinc-400 text-xs">{cat.name}</span>
              </div>
              <span className="text-foreground text-xs font-medium">${cat.value.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-foreground m-0 mb-0.5 font-semibold">Transações Recentes</h3>
          <p className="text-muted-foreground text-sm m-0">Sua atividade recente</p>
        </div>
        <Button
          variant="link"
          size="sm"
          className="text-brand p-0 h-auto gap-1"
          onClick={() => onNavigate('transactions')}
        >
          Ver todas <ChevronRight size={14} />
        </Button>
      </div>

      <div className="flex flex-col">
        {recentTransactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="flex items-center py-[13px]"
            style={{ borderBottom: i < recentTransactions.length - 1 ? '1px solid #1f1f22' : 'none' }}
          >
            <div className="w-[42px] h-[42px] rounded-[11px] bg-muted flex items-center justify-center text-[19px] mr-3.5 shrink-0">
              {tx.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-foreground text-sm font-medium mb-0.5 truncate">{tx.description}</div>
              <div className="text-zinc-600 text-xs">{tx.category} · {tx.date}</div>
            </div>
            <div className={`${tx.amount > 0 ? 'text-income' : 'text-expense'} font-bold text-[15px] tracking-tight shrink-0 ml-3`}>
              {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default Dashboard;
