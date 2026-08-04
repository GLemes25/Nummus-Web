'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DynamicIcon } from '@/components/ui/dynamic-icon'
import { apiClient } from '@/lib/api-client'
import { useWallets } from '@/hooks/use-wallets'
import { useCategories } from '@/hooks/use-categories'
import type { PaymentMethod } from '@/types/api'

type TransactionModalProps = {
  isOpen: boolean
  onClose: () => void
}

type TxType = 'expense' | 'income' | 'transfer'

const typeColor: Record<TxType, string> = {
  expense: '#F43F5E',
  income: '#10B981',
  transfer: '#BFA071',
}

const typeLabels: Record<TxType, string> = {
  expense: 'despesa',
  income: 'receita',
  transfer: 'transferência',
}

const amountPrefix: Record<TxType, string> = {
  expense: 'Debitado de',
  income: 'Adicionado a',
  transfer: 'Movendo de',
}

const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: 'PIX', label: 'Pix' },
  { value: 'CASH', label: 'Dinheiro' },
  { value: 'BANK_TRANSFER', label: 'Transferência' },
  { value: 'DEBIT_CARD', label: 'Débito' },
]

const TransactionModal = ({ isOpen, onClose }: TransactionModalProps) => {
  const [txType, setTxType] = useState<TxType>('expense')
  const [amount, setAmount] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [selectedWalletId, setSelectedWalletId] = useState<string>('')
  const [destinationWalletId, setDestinationWalletId] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const { wallets, isLoading: isWalletsLoading } = useWallets()
  const { categories, isLoading: isCategoriesLoading } = useCategories()

  useEffect(() => {
    if (wallets.length > 0 && !selectedWalletId) {
      setSelectedWalletId(wallets[0].id)
      setDestinationWalletId(wallets.length > 1 ? wallets[1].id : wallets[0].id)
    }
  }, [wallets, selectedWalletId])

  const handleAmountKey = useCallback((key: string) => {
    if (key === 'backspace') {
      setAmount((a) => a.slice(0, -1))
    } else if (key === '.' && amount.includes('.')) {
      return
    } else if (amount.split('.')[1]?.length >= 2) {
      return
    } else {
      setAmount((a) => a + key)
    }
  }, [amount])

  const resetForm = useCallback(() => {
    setAmount('')
    setSelectedCategoryId(null)
    setDescription('')
    setTxType('expense')
    setPaymentMethod('PIX')
    setErrorMsg(null)
  }, [])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMsg('Informe um valor válido')
      return
    }
    if (!selectedCategoryId) {
      setErrorMsg('Selecione uma categoria')
      return
    }
    if (!selectedWalletId) {
      setErrorMsg('Selecione uma carteira')
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      if (txType === 'transfer') {
        if (selectedWalletId === destinationWalletId) {
          setErrorMsg('A carteira de origem e destino devem ser diferentes')
          return
        }
        const res = await apiClient.post('/transfers', {
          sourceWalletId: selectedWalletId,
          destinationWalletId,
          amount: parseFloat(amount),
          date: new Date().toISOString(),
          description: description || undefined,
          categoryId: selectedCategoryId,
        })
        if (!res || !res.ok) {
          const data = res ? await res.json() : null
          setErrorMsg(data?.error ?? 'Erro ao realizar transferência')
          return
        }
      } else {
        const res = await apiClient.post('/transactions', {
          amount: parseFloat(amount),
          type: txType === 'income' ? 'INCOME' : 'EXPENSE',
          paymentMethod,
          date: new Date().toISOString(),
          description: description || `${typeLabels[txType]} registrada`,
          walletId: selectedWalletId,
          categoryId: selectedCategoryId,
        })
        if (!res || !res.ok) {
          const data = res ? await res.json() : null
          setErrorMsg(data?.error ?? 'Erro ao salvar transação')
          return
        }
      }
      resetForm()
      onClose()
    } catch {
      setErrorMsg('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const amountDisplay = amount || '0.00'
  const selectedWallet = wallets.find((w) => w.id === selectedWalletId)

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
            onClick={handleClose}
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
              <Button
                variant="secondary"
                size="icon"
                className="bg-muted text-muted-foreground"
                onClick={handleClose}
              >
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
                      borderBottom:
                        txType === t ? `2px solid ${typeColor[t]}` : '2px solid transparent',
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
                  color:
                    txType === 'income' ? '#10B981' : txType === 'transfer' ? '#BFA071' : '#fafafa',
                }}
              >
                R$ {amountDisplay}
              </div>
              <div className="text-zinc-600 text-sm">
                {amountPrefix[txType]}{' '}
                <span className="text-zinc-400">{selectedWallet?.name ?? '...'}</span>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="grid grid-cols-3 gap-2.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map(
                  (key) => (
                    <button
                      key={key}
                      onClick={() => handleAmountKey(key)}
                      className="py-4 rounded-xl border border-border cursor-pointer text-lg font-semibold transition-colors duration-100 flex items-center justify-center"
                      style={{
                        backgroundColor:
                          key === 'backspace' ? 'rgba(244,63,94,0.08)' : '#1f1f22',
                        color: key === 'backspace' ? '#F43F5E' : '#fafafa',
                        fontSize: key === 'backspace' ? 13 : 18,
                      }}
                    >
                      {key === 'backspace' ? '⌫' : key}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="px-6 flex flex-col gap-4">
              <div>
                <div className="text-muted-foreground text-xs tracking-[0.8px] mb-2.5">
                  CATEGORIA
                </div>
                {isCategoriesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 size={18} className="animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className="pt-2.5 pb-2 px-1.5 rounded-xl cursor-pointer flex flex-col items-center gap-1 transition-all duration-100"
                        style={{
                          border: `1px solid ${selectedCategoryId === cat.id ? '#7C3AED' : '#27272a'}`,
                          backgroundColor:
                            selectedCategoryId === cat.id
                              ? 'rgba(124,58,237,0.15)'
                              : '#1f1f22',
                        }}
                      >
                        <DynamicIcon name={cat.icon} size={18} />
                        <span
                          className="text-[10px] text-center leading-tight"
                          style={{
                            color: selectedCategoryId === cat.id ? '#8B5CF6' : '#71717a',
                          }}
                        >
                          {cat.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
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

              {txType !== 'transfer' && (
                <div>
                  <div className="text-muted-foreground text-xs tracking-[0.8px] mb-2">
                    FORMA DE PAGAMENTO
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {paymentMethodOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setPaymentMethod(opt.value)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                        style={{
                          border: `1px solid ${paymentMethod === opt.value ? '#7C3AED' : '#27272a'}`,
                          backgroundColor:
                            paymentMethod === opt.value
                              ? 'rgba(124,58,237,0.15)'
                              : '#1f1f22',
                          color: paymentMethod === opt.value ? '#8B5CF6' : '#71717a',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-muted-foreground text-xs tracking-[0.8px] mb-2">
                  {txType === 'transfer' ? 'CARTEIRA DE ORIGEM' : 'CARTEIRA'}
                </div>
                {isWalletsLoading ? (
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                ) : (
                  <div className="relative">
                    <select
                      value={selectedWalletId}
                      onChange={(e) => setSelectedWalletId(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-9 bg-zinc-900 border border-border rounded-lg text-foreground text-sm outline-none cursor-pointer appearance-none"
                    >
                      {wallets.map((w) => (
                        <option key={w.id} value={w.id} style={{ backgroundColor: '#18181b' }}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 text-xs">
                      ▾
                    </div>
                  </div>
                )}
              </div>

              {txType === 'transfer' && (
                <div>
                  <div className="text-muted-foreground text-xs tracking-[0.8px] mb-2">
                    CARTEIRA DE DESTINO
                  </div>
                  <div className="relative">
                    <select
                      value={destinationWalletId}
                      onChange={(e) => setDestinationWalletId(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-9 bg-zinc-900 border border-border rounded-lg text-foreground text-sm outline-none cursor-pointer appearance-none"
                    >
                      {wallets.map((w) => (
                        <option key={w.id} value={w.id} style={{ backgroundColor: '#18181b' }}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 text-xs">
                      ▾
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="text-muted-foreground text-xs tracking-[0.8px] mb-2">DATA</div>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-zinc-900 border border-border rounded-lg text-zinc-400 text-sm cursor-pointer">
                  <Calendar size={15} className="text-zinc-600 shrink-0" />
                  Hoje —{' '}
                  {new Date().toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {errorMsg && (
                <p className="text-expense text-sm text-center">{errorMsg}</p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
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
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : txType === 'transfer' ? (
                  'Realizar Transferência'
                ) : (
                  'Salvar Transação'
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default TransactionModal
