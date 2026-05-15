'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, MoreHorizontal, CreditCard, Banknote, PiggyBank, TrendingUp, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type WalletEntry = {
  id: number;
  name: string;
  type: string;
  balance: number;
  masked: string;
  color: string;
  gradient: string;
  icon: React.ElementType;
};

const walletData: WalletEntry[] = [
  { id: 1, name: 'Chase Checking', type: 'bank', balance: 8420.5, masked: '••••  4231', color: '#7C3AED', gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', icon: CreditCard },
  { id: 2, name: 'Conta Poupança', type: 'savings', balance: 32600.0, masked: '••••  8804', color: '#10B981', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)', icon: PiggyBank },
  { id: 3, name: 'Chase Visa', type: 'credit', balance: -2340.78, masked: '••••  1792', color: '#F43F5E', gradient: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)', icon: CreditCard },
  { id: 4, name: 'Carteira de Investimentos', type: 'investment', balance: 84290.0, masked: 'Fidelity', color: '#BFA071', gradient: 'linear-gradient(135deg, #BFA071 0%, #8B6A40 100%)', icon: TrendingUp },
  { id: 5, name: 'Carteira de Dinheiro', type: 'cash', balance: 340.0, masked: 'Físico', color: '#06B6D4', gradient: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)', icon: Banknote },
];

const categoryData = [
  { id: 1, icon: '🍕', label: 'Alimentação', color: '#7C3AED', count: 24 },
  { id: 2, icon: '🚕', label: 'Transporte', color: '#06B6D4', count: 12 },
  { id: 3, icon: '🛍️', label: 'Compras', color: '#F43F5E', count: 18 },
  { id: 4, icon: '💊', label: 'Saúde', color: '#10B981', count: 6 },
  { id: 5, icon: '🏠', label: 'Moradia e Aluguel', color: '#BFA071', count: 3 },
  { id: 6, icon: '🎬', label: 'Entretenimento', color: '#8B5CF6', count: 9 },
  { id: 7, icon: '⚡', label: 'Utilidades', color: '#EAB308', count: 5 },
  { id: 8, icon: '✈️', label: 'Viagem', color: '#EC4899', count: 4 },
  { id: 9, icon: '💼', label: 'Salário / Receita', color: '#10B981', count: 2 },
  { id: 10, icon: '💻', label: 'Freelance', color: '#7C3AED', count: 3 },
  { id: 11, icon: '📈', label: 'Investimentos', color: '#BFA071', count: 7 },
  { id: 12, icon: '📌', label: 'Diversos', color: '#71717a', count: 15 },
];

const Wallets = () => {
  const [activeTab, setActiveTab] = useState<'wallets' | 'categories'>('wallets');

  const totalAssets = walletData.filter((w) => w.balance > 0).reduce((s, w) => s + w.balance, 0);
  const totalLiabilities = walletData.filter((w) => w.balance < 0).reduce((s, w) => s + Math.abs(w.balance), 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="p-6 pt-7 max-w-225">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-foreground m-0 mb-1 tracking-tight text-2xl font-bold">
            {activeTab === 'wallets' ? 'Carteiras' : 'Categorias'}
          </h1>
          <p className="text-muted-foreground m-0 text-sm">
            {activeTab === 'wallets' ? 'Gerencie suas contas e saldos' : 'Organize suas transações'}
          </p>
        </div>
        <Button className="bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5">
          <Plus size={15} />
          {activeTab === 'wallets' ? 'Adicionar Carteira' : 'Adicionar Categoria'}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'wallets' | 'categories')}
        className="mb-6"
      >
        <TabsList className="bg-card border border-border w-fit">
          <TabsTrigger value="wallets" className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground capitalize">
            Carteiras
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground capitalize">
            Categorias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallets">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Patrimônio Líquido', value: `$${netWorth.toLocaleString()}`, colorClass: 'text-gold' },
              { label: 'Total de Ativos', value: `$${totalAssets.toLocaleString()}`, colorClass: 'text-income' },
              { label: 'Passivos', value: `-$${totalLiabilities.toLocaleString()}`, colorClass: 'text-expense' },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-3.5">
                <div className="text-muted-foreground text-xs mb-1.5">{s.label}</div>
                <div className={`${s.colorClass} font-bold text-lg tracking-tight`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {walletData.map((wallet, i) => {
              const Icon = wallet.icon;
              return (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl p-[22px] relative overflow-hidden cursor-pointer min-h-40 flex flex-col justify-between"
                  style={{ background: wallet.gradient }}
                >
                  <div className="absolute -top-8 -right-8 w-30 h-30 rounded-full bg-white/8 pointer-events-none" />
                  <div className="absolute -bottom-5 -left-5 w-25 h-25 rounded-full bg-black/10 pointer-events-none" />

                  <div className="flex justify-between items-start">
                    <div className="w-[38px] h-[38px] rounded-[10px] bg-white/15 flex items-center justify-center">
                      <Icon size={18} color="rgba(255,255,255,0.9)" />
                    </div>
                    <Button variant="ghost" size="icon" className="w-[30px] h-[30px] rounded-[7px] bg-black/20 text-white/70 hover:bg-black/30 hover:text-white">
                      <MoreHorizontal size={14} />
                    </Button>
                  </div>

                  <div>
                    <div className="text-white/60 text-xs mb-1">{wallet.name}</div>
                    <div className="text-white font-extrabold text-[22px] tracking-tight mb-1.5">
                      {wallet.balance < 0 ? '-' : ''}${Math.abs(wallet.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-white/50 text-xs tracking-wide">{wallet.masked}</div>
                  </div>
                </motion.div>
              );
            })}

            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: walletData.length * 0.06 }}
              className="rounded-2xl border-2 border-dashed border-border bg-transparent p-[22px] flex flex-col items-center justify-center gap-2.5 cursor-pointer min-h-40 text-zinc-600 transition-colors hover:border-brand hover:text-brand"
            >
              <Plus size={24} />
              <span className="text-sm">Adicionar Carteira</span>
            </motion.button>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {categoryData.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center px-5 py-3.5 cursor-pointer hover:bg-foreground/2 transition-colors"
                style={{ borderBottom: i < categoryData.length - 1 ? '1px solid #1f1f22' : 'none' }}
              >
                <div
                  className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center text-xl mr-3.5 shrink-0"
                  style={{ backgroundColor: cat.color + '22', border: `1px solid ${cat.color}44` }}
                >
                  {cat.icon}
                </div>

                <div className="flex-1">
                  <div className="text-foreground text-sm font-medium mb-0.5">{cat.label}</div>
                  <div className="text-zinc-600 text-xs">{cat.count} transações</div>
                </div>

                <div
                  className="w-5 h-5 rounded-full mr-4 shrink-0"
                  style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}66` }}
                />

                <div className="flex gap-1.5">
                  <Button variant="secondary" size="icon" className="w-[30px] h-[30px] rounded-[7px] bg-muted text-muted-foreground">
                    <Edit3 size={13} />
                  </Button>
                  <Button variant="destructive" size="icon" className="w-[30px] h-[30px] rounded-[7px]">
                    <Trash2 size={13} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wallets;
