'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, MoreHorizontal, Wallet as WalletIcon, Edit3, Scale, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import { useWallets } from '@/hooks/use-wallets';
import { useCategories } from '@/hooks/use-categories';
import AddWalletModal from '@/components/wallets/add-wallet-modal';
import AdjustBalanceModal from '@/components/wallets/adjust-balance-modal';
import EditWalletModal from '@/components/wallets/edit-wallet-modal';
import AddCategoryModal from '@/components/categories/add-category-modal';
import EditCategoryModal from '@/components/categories/edit-category-modal';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import type { Category, Wallet } from '@/types/api';

const walletGradients = [
  'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
  'linear-gradient(135deg, #059669 0%, #047857 100%)',
  'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
  'linear-gradient(135deg, #BFA071 0%, #8B6A40 100%)',
  'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
];

const Wallets = () => {
  const [activeTab, setActiveTab] = useState<'wallets' | 'categories'>('wallets');
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [deletingWallet, setDeletingWallet] = useState<Wallet | null>(null);
  const [adjustingWallet, setAdjustingWallet] = useState<Wallet | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
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
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    createCategory,
    isCreating: isCreatingCategory,
    updateCategory,
    isUpdating: isUpdatingCategory,
    deleteCategory,
    isDeleting: isDeletingCategory,
  } = useCategories();

  const totalAssets = wallets.filter((w) => w.balance > 0).reduce((s, w) => s + w.balance, 0);
  const totalLiabilities = wallets.filter((w) => w.balance < 0).reduce((s, w) => s + Math.abs(w.balance), 0);
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div className="p-6 pt-7 w-full max-w-225 mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-foreground m-0 mb-1 tracking-tight text-2xl font-bold">
            {activeTab === 'wallets' ? 'Carteiras' : 'Categorias'}
          </h1>
          <p className="text-muted-foreground m-0 text-sm">
            {activeTab === 'wallets' ? 'Gerencie suas contas e saldos' : 'Organize suas transações'}
          </p>
        </div>
        <Button
          className="bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5"
          onClick={
            activeTab === 'wallets'
              ? () => setIsAddWalletOpen(true)
              : () => setIsAddCategoryOpen(true)
          }
        >
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
                >
                  <div className="absolute -top-8 -right-8 w-30 h-30 rounded-full bg-white/8 pointer-events-none" />
                  <div className="absolute -bottom-5 -left-5 w-25 h-25 rounded-full bg-black/10 pointer-events-none" />

                  <div className="flex justify-between items-start">
                    <div className="w-9.5 h-9.5 rounded-[10px] bg-white/15 flex items-center justify-center">
                      <WalletIcon size={18} color="rgba(255,255,255,0.9)" />
                    </div>
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

        <TabsContent value="categories">
          {isLoadingCategories ? (
            <div className="flex justify-center py-12">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          ) : categoriesError ? (
            <p className="text-expense text-sm text-center py-12">{categoriesError}</p>
          ) : categories.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-12">
              Nenhuma categoria cadastrada
            </p>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              {categories.map((category, i) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center px-5 py-3.5 hover:bg-foreground/2 transition-colors"
                  style={{ borderBottom: i < categories.length - 1 ? '1px solid #1f1f22' : 'none' }}
                >
                  <div
                    className="w-10.5 h-10.5 rounded-[11px] flex items-center justify-center mr-3.5 shrink-0"
                    style={{
                      backgroundColor: category.color + '22',
                      border: `1px solid ${category.color}44`,
                      color: category.color,
                    }}
                  >
                    <DynamicIcon name={category.icon} size={18} />
                  </div>

                  <div className="flex-1">
                    <div className="text-foreground text-sm font-medium mb-0.5">{category.name}</div>
                  </div>

                  <div
                    className="w-5 h-5 rounded-full mr-4 shrink-0"
                    style={{ backgroundColor: category.color, boxShadow: `0 0 8px ${category.color}66` }}
                  />

                  <div className="flex gap-1.5">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="w-7.5 h-7.5 rounded-[7px] bg-muted text-muted-foreground"
                      onClick={() => setEditingCategory(category)}
                    >
                      <Edit3 size={13} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-7.5 h-7.5 rounded-[7px]"
                      onClick={() => setDeletingCategory(category)}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        categories={categories}
        onCreateCategory={createCategory}
        isCreating={isCreatingCategory}
      />

      <EditCategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        category={editingCategory}
        categories={categories}
        onUpdateCategory={updateCategory}
        isUpdating={isUpdatingCategory}
      />

      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open: boolean) => {
          if (!open) setDeletingCategory(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria &quot;{deletingCategory?.name}&quot;? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeletingCategory}
              onClick={async () => {
                if (!deletingCategory) return;
                await deleteCategory(deletingCategory.id);
                setDeletingCategory(null);
              }}
            >
              {isDeletingCategory ? <Loader2 size={16} className="animate-spin" /> : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Wallets;
