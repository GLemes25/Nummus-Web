'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit3, Trash2, Loader2, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCategories } from '@/hooks/use-categories';
import AddCategoryModal from '@/components/categories/add-category-modal';
import EditCategoryModal from '@/components/categories/edit-category-modal';
import { DynamicIcon } from '@/components/ui/dynamic-icon';
import type { Category } from '@/types/api';

const Categories = () => {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
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

  return (
    <div className="p-6 pt-7 w-full max-w-225 mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-foreground m-0 mb-1 tracking-tight text-2xl font-bold">
            Categorias
          </h1>
          <p className="text-muted-foreground m-0 text-sm">
            Organize suas transações
          </p>
        </div>
        <Button
          className="bg-brand text-brand-foreground hover:bg-brand/90 gap-1.5"
          onClick={() => setIsAddCategoryOpen(true)}
        >
          <Plus size={15} />
          Adicionar Categoria
        </Button>
      </div>

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

              <div className="flex-1 flex items-center gap-2">
                <div className="text-foreground text-sm font-medium mb-0.5">{category.name}</div>
                {category.isSystem && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="secondary" className="gap-1">
                        <Lock size={11} />
                        Sistema
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>Categoria gerada pelo sistema</TooltipContent>
                  </Tooltip>
                )}
              </div>

              <div
                className="w-5 h-5 rounded-full mr-4 shrink-0"
                style={{ backgroundColor: category.color, boxShadow: `0 0 8px ${category.color}66` }}
              />

              {!category.isSystem && (
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
              )}
            </motion.div>
          ))}
        </div>
      )}

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

export default Categories;
