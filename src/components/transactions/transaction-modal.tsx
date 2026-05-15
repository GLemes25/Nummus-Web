'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type TxType = 'expense' | 'income' | 'transfer';

const categories = [
  { id: 'food', label: 'Alimentação', icon: '🍕' },
  { id: 'transport', label: 'Transporte', icon: '🚕' },
  { id: 'shopping', label: 'Compras', icon: '🛍️' },
  { id: 'health', label: 'Saúde', icon: '💊' },
  { id: 'housing', label: 'Moradia', icon: '🏠' },
  { id: 'entertainment', label: 'Entreten.', icon: '🎬' },
  { id: 'utilities', label: 'Utilidades', icon: '⚡' },
  { id: 'travel', label: 'Viagem', icon: '✈️' },
  { id: 'salary', label: 'Salário', icon: '💼' },
  { id: 'freelance', label: 'Freelance', icon: '💻' },
  { id: 'investment', label: 'Investimento', icon: '📈' },
  { id: 'other', label: 'Outro', icon: '📌' },
];

const wallets = ['Chase Checking', 'Chase Visa', 'Savings Account', 'Cash'];

const typeColor: Record<TxType, string> = {
  expense: '#F43F5E',
  income: '#10B981',
  transfer: '#BFA071',
};

const typeLabels: Record<TxType, string> = {
  expense: 'despesa',
  income: 'receita',
  transfer: 'transferência',
};

const amountPrefix: Record<TxType, string> = {
  expense: 'Debitado de',
  income: 'Adicionado a',
  transfer: 'Movendo de',
};

const TransactionModal = ({ isOpen, onClose }: TransactionModalProps) => {
  const [txType, setTxType] = useState<TxType>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('Chase Checking');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);

  const handleAmountKey = (key: string) => {
    if (key === 'backspace') {
      setAmount((a) => a.slice(0, -1));
    } else if (key === '.' && amount.includes('.')) {
      return;
    } else if (amount.split('.')[1]?.length >= 2) {
      return;
    } else {
      setAmount((a) => a + key);
    }
  };

  const handleAI = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      setAiSuggested(true);
      setSelectedCategory('food');
      setDescription('Categorização automática por IA: Alimentação');
    }, 1400);
  };

  const handleSubmit = () => {
    setAmount('');
    setSelectedCategory(null);
    setDescription('');
    setTxType('expense');
    setAiSuggested(false);
    onClose();
  };

  const amountDisplay = amount || '0.00';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-[6px] z-[200]"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25, type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[201] ui-surface-dark border-t border-zinc-700 rounded-t-[20px] pb-8 max-h-[95vh] overflow-y-auto lg:max-w-lg lg:mx-auto lg:rounded-2xl lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:border lg:border-zinc-700"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-zinc-700 lg:hidden" />
            </div>

            <div className="flex items-center justify-between px-6 pt-3 pb-5">
              <h2 className="text-foreground m-0 text-xl font-bold">Nova Transação</h2>
              <Button variant="secondary" size="icon" className="bg-muted text-muted-foreground" onClick={onClose}>
                <X size={16} />
              </Button>
            </div>

            <div className="px-6 pb-5">
              <div className="flex bg-zinc-900 rounded-xl p-0.5 border border-border">
                {(['expense', 'income', 'transfer'] as TxType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTxType(t)}
                    className="flex-1 py-2 px-2 rounded-[8px] border-none cursor-pointer text-sm transition-all capitalize"
                    style={{
                      backgroundColor: txType === t ? typeColor[t] + '22' : 'transparent',
                      color: txType === t ? typeColor[t] : '#71717a',
                      fontWeight: txType === t ? 600 : 400,
                      borderBottom: txType === t ? `2px solid ${typeColor[t]}` : '2px solid transparent',
                    }}
                  >
                    {typeLabels[t]}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center px-6 pb-7 border-b border-border">
              <div className="text-zinc-600 text-xs tracking-[1px] mb-2">VALOR</div>
              <div
                className="text-5xl font-extrabold tracking-tight leading-none mb-1.5 min-h-13 transition-colors duration-200"
                style={{
                  color: txType === 'income' ? '#10B981' : txType === 'transfer' ? '#BFA071' : '#fafafa',
                }}
              >
                ${amountDisplay}
              </div>
              <div className="text-zinc-600 text-sm">
                {amountPrefix[txType]}{' '}
                <span className="text-zinc-400">{selectedWallet}</span>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-3 gap-2.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
                  <button
                    key={key}
                    onClick={() => handleAmountKey(key)}
                    className="py-4 rounded-xl border border-border cursor-pointer text-lg font-semibold transition-colors duration-100 flex items-center justify-center"
                    style={{
                      backgroundColor: key === 'backspace' ? 'rgba(244,63,94,0.08)' : '#1f1f22',
                      color: key === 'backspace' ? '#F43F5E' : '#fafafa',
                      fontSize: key === 'backspace' ? 13 : 18,
                    }}
                  >
                    {key === 'backspace' ? '⌫' : key}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 flex flex-col gap-4">
              <Button
                onClick={handleAI}
                disabled={isAiLoading}
                variant="outline"
                className="w-full border-gold/40"
                style={{
                  background: aiSuggested
                    ? 'rgba(191,160,113,0.1)'
                    : 'linear-gradient(135deg, rgba(191,160,113,0.08), rgba(124,58,237,0.08))',
                  color: aiSuggested ? '#10B981' : '#BFA071',
                }}
              >
                {isAiLoading ? (
                  <>
                    <span className="animate-spin inline-block">⟳</span>
                    Analisando transação…
                  </>
                ) : aiSuggested ? (
                  <>✓ Categorizado com IA</>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Categorizar com IA
                  </>
                )}
              </Button>

              <div>
                <div className="text-muted-foreground text-xs tracking-[0.8px] mb-2.5">CATEGORIA</div>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="pt-2.5 pb-2 px-1.5 rounded-xl cursor-pointer flex flex-col items-center gap-1 transition-all duration-100"
                      style={{
                        border: `1px solid ${selectedCategory === cat.id ? '#7C3AED' : '#27272a'}`,
                        backgroundColor: selectedCategory === cat.id ? 'rgba(124,58,237,0.15)' : '#1f1f22',
                      }}
                    >
                      <span className="text-[18px]">{cat.icon}</span>
                      <span className="text-[10px]" style={{ color: selectedCategory === cat.id ? '#8B5CF6' : '#71717a' }}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-muted-foreground text-xs tracking-[0.8px] mb-2">NOTA</div>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Adicionar uma descrição…"
                  className="bg-zinc-900 border-border text-foreground"
                />
              </div>

              <div>
                <div className="text-muted-foreground text-xs tracking-[0.8px] mb-2">CARTEIRA</div>
                <div className="relative">
                  <select
                    value={selectedWallet}
                    onChange={(e) => setSelectedWallet(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-9 bg-zinc-900 border border-border rounded-lg text-foreground text-sm outline-none cursor-pointer appearance-none"
                  >
                    {wallets.map((w) => (
                      <option key={w} value={w} style={{ backgroundColor: '#18181b' }}>
                        {w}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 text-xs">▾</div>
                </div>
              </div>

              <div>
                <div className="text-muted-foreground text-xs tracking-[0.8px] mb-2">DATA</div>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-zinc-900 border border-border rounded-lg text-zinc-400 text-sm cursor-pointer">
                  <Calendar size={15} className="text-zinc-600 shrink-0" />
                  Hoje — 14 de mai. de 2026
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full mt-1 text-foreground font-semibold text-[15px]"
                style={{
                  background:
                    txType === 'income'
                      ? 'linear-gradient(135deg, #059669, #047857)'
                      : txType === 'transfer'
                      ? 'linear-gradient(135deg, #92600A, #78500A)'
                      : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
                  boxShadow:
                    txType === 'income'
                      ? '0 4px 16px rgba(16,185,129,0.3)'
                      : txType === 'transfer'
                      ? '0 4px 16px rgba(191,160,113,0.25)'
                      : '0 4px 16px rgba(124,58,237,0.35)',
                }}
              >
                Salvar Transação
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
