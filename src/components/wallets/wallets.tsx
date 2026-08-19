'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, MoreHorizontal, Wallet as WalletIcon, Edit3, Scale, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNetWorth } from '@/hooks/use-net-worth';
import { useWallets } from '@/hooks/use-wallets';
import { useCreditCards } from '@/hooks/use-credit-cards';
import AddWalletModal from '@/components/wallets/add-wallet-modal';
import AdjustBalanceModal from '@/components/wallets/adjust-balance-modal';
import EditWalletModal from '@/components/wallets/edit-wallet-modal';
import WalletDetailsModal from '@/components/wallets/wallet-details-modal';
import CreditCardList from '@/components/credit-cards/credit-card-list';
import CreateCreditCardModal from '@/components/credit-cards/create-credit-card-modal';
import CreditCardDetailsModal from '@/components/credit-cards/credit-card-details-modal';
import EditCreditCardModal from '@/components/credit-cards/edit-credit-card-modal';
import DeleteCreditCardAlert from '@/components/credit-cards/delete-credit-card-alert';
import type { CreditCard as CreditCardType, Wallet } from '@/types/api';

const walletGradients = [
  'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
  'linear-gradient(135deg, #059669 0%, #047857 100%)',
  'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
  'linear-gradient(135deg, #BFA071 0%, #8B6A40 100%)',
  'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
];

const Wallets = () => {
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [deletingWallet, setDeletingWallet] = useState<Wallet | null>(null);
  const [adjustingWallet, setAdjustingWallet] = useState<Wallet | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isCreateCreditCardOpen, setIsCreateCreditCardOpen] = useState(false);
  const [selectedCreditCard, setSelectedCreditCard] =
    useState<CreditCardType | null>(null);
  const [cardBeingEdited, setCardBeingEdited] =
    useState<CreditCardType | null>(null);
  const [cardBeingDeleted, setCardBeingDeleted] =
    useState<CreditCardType | null>(null);
  const {
    wallets,
    isLoading,
    error,
    refetch,
    createWallet,
    isCreating,
    updateWallet,
    isUpdating,
    deleteWallet,
    isDeleting,
  } = useWallets();
  const { summary, isLoading: isSummaryLoading } = useNetWorth();
  const {
    creditCards,
    isLoading: isLoadingCreditCards,
    error: creditCardsError,
    createCreditCard,
    isCreating: isCreatingCreditCard,
    updateCreditCard,
    isUpdating: isUpdatingCreditCard,
    deleteCreditCard,
    isDeleting: isDeletingCreditCard,
  } = useCreditCards();

  return (
    <div className="p-6 pt-7 w-full max-w-225 mx-auto">
      <div className="mb-6">
        <h1 className="text-foreground m-0 mb-1 tracking-tight text-2xl font-bold">
          Carteiras
        </h1>
        <p className="text-muted-foreground m-0 text-sm">
          Gerencie suas contas, saldos e cartões de crédito
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Patrimônio Líquido', value: summary.netWorth, colorClass: 'text-gold' },
          { label: 'Total de Ativos', value: summary.assets, colorClass: 'text-income' },
          { label: 'Passivos', value: summary.liabilities, colorClass: 'text-expense' },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-3.5">
            <div className="text-muted-foreground text-xs mb-1.5">{s.label}</div>
            {isSummaryLoading ? (
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            ) : (
              <div className={`${s.colorClass} font-bold text-lg tracking-tight`}>
                {(s.value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            )}
          </div>
        ))}
      </div>

      <Tabs defaultValue="accounts">
        <TabsList>
          <TabsTrigger value="accounts">Contas</TabsTrigger>
          <TabsTrigger value="credit-cards">Cartões de Crédito</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              className="bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5"
              onClick={() => setIsAddWalletOpen(true)}
            >
              <Plus size={15} />
              Adicionar Carteira
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-expense text-sm text-center py-12">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wallets.map((wallet, i) => (
                <motion.div
                  key={wallet.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl p-5.5 relative overflow-hidden cursor-pointer min-h-40 flex flex-col justify-between"
                  style={{ background: walletGradients[i % walletGradients.length] }}
                  onClick={() => setSelectedWallet(wallet)}
                >
                  <div className="absolute -top-8 -right-8 w-30 h-30 rounded-full bg-white/8 pointer-events-none" />
                  <div className="absolute -bottom-5 -left-5 w-25 h-25 rounded-full bg-black/10 pointer-events-none" />

                  <div className="flex justify-between items-start">
                    <div className="w-9.5 h-9.5 rounded-[10px] bg-white/15 flex items-center justify-center">
                      <WalletIcon size={18} color="rgba(255,255,255,0.9)" />
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7.5 h-7.5 rounded-[7px] bg-black/20 text-white/70 hover:bg-black/30 hover:text-white"
                            >
                              <MoreHorizontal size={14} />
                            </Button>
                          }
                        />
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setEditingWallet(wallet)}>
                            <Edit3 size={14} />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setAdjustingWallet(wallet)}>
                            <Scale size={14} />
                            Ajustar Saldo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeletingWallet(wallet)}
                          >
                            <Trash2 size={14} />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div>
                    <div className="text-white/60 text-xs mb-1">{wallet.name}</div>
                    <div className="text-white font-extrabold text-[22px] tracking-tight mb-1.5">
                      {wallet.balance < 0 ? '-' : ''}${Math.abs(wallet.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-white/50 text-xs tracking-wide">{wallet.currency}</div>
                  </div>
                </motion.div>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: wallets.length * 0.06 }}
                onClick={() => setIsAddWalletOpen(true)}
                className="rounded-2xl border-2 border-dashed border-border bg-transparent p-5.5 flex flex-col items-center justify-center gap-2.5 cursor-pointer min-h-40 text-zinc-600 transition-colors hover:border-brand hover:text-brand"
              >
                <Plus size={24} />
                <span className="text-sm">Adicionar Carteira</span>
              </motion.button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="credit-cards" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button
              className="bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5"
              onClick={() => setIsCreateCreditCardOpen(true)}
            >
              <Plus size={15} />
              Novo Cartão
            </Button>
          </div>

          <CreditCardList
            creditCards={creditCards}
            isLoading={isLoadingCreditCards}
            error={creditCardsError}
            onSelectCreditCard={setSelectedCreditCard}
            onEditCreditCard={setCardBeingEdited}
            onDeleteCreditCard={setCardBeingDeleted}
          />
        </TabsContent>
      </Tabs>

      <AddWalletModal
        isOpen={isAddWalletOpen}
        onClose={() => setIsAddWalletOpen(false)}
        onCreateWallet={createWallet}
        isCreating={isCreating}
      />

      <EditWalletModal
        isOpen={!!editingWallet}
        onClose={() => setEditingWallet(null)}
        wallet={editingWallet}
        onUpdateWallet={updateWallet}
        isUpdating={isUpdating}
      />

      <AdjustBalanceModal
        isOpen={!!adjustingWallet}
        onClose={() => setAdjustingWallet(null)}
        wallet={adjustingWallet}
        onAdjusted={refetch}
      />

      <WalletDetailsModal
        wallet={selectedWallet}
        onClose={() => setSelectedWallet(null)}
      />

      <CreateCreditCardModal
        isOpen={isCreateCreditCardOpen}
        onClose={() => setIsCreateCreditCardOpen(false)}
        onCreateCreditCard={createCreditCard}
        isCreating={isCreatingCreditCard}
      />

      <CreditCardDetailsModal
        creditCard={selectedCreditCard}
        isOpen={!!selectedCreditCard}
        onClose={() => setSelectedCreditCard(null)}
      />

      <EditCreditCardModal
        isOpen={!!cardBeingEdited}
        onClose={() => setCardBeingEdited(null)}
        creditCard={cardBeingEdited}
        onUpdateCreditCard={updateCreditCard}
        isUpdating={isUpdatingCreditCard}
      />

      <DeleteCreditCardAlert
        creditCard={cardBeingDeleted}
        onClose={() => setCardBeingDeleted(null)}
        onDeleteCreditCard={deleteCreditCard}
        isDeleting={isDeletingCreditCard}
      />

      <AlertDialog
        open={!!deletingWallet}
        onOpenChange={(open: boolean) => {
          if (!open) setDeletingWallet(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir carteira</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a carteira &quot;{deletingWallet?.name}&quot;? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={async () => {
                if (!deletingWallet) return;
                await deleteWallet(deletingWallet.id);
                setDeletingWallet(null);
              }}
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Wallets;
