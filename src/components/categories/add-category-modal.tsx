"use client";

import { Button } from "@/components/ui/button";
import {
  CategoryForm,
  NO_PARENT,
  type CategoryFormValues,
} from "@/components/categories/category-form";
import type { Category } from "@/types/api";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type CreateCategoryInput = {
  name: string;
  color: string;
  icon: string;
  parentId?: string;
};

type AddCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCreateCategory: (input: CreateCategoryInput) => Promise<Category | null>;
  isCreating: boolean;
};

const ADD_CATEGORY_DEFAULT_VALUES: CategoryFormValues = {
  name: "",
  color: "#7C3AED",
  icon: "tag",
  parentId: NO_PARENT,
};

const AddCategoryModal = ({
  isOpen,
  onClose,
  categories,
  onCreateCategory,
  isCreating,
}: AddCategoryModalProps) => {
  const handleSubmit = async (values: CategoryFormValues) => {
    const created = await onCreateCategory({
      name: values.name,
      color: values.color,
      icon: values.icon,
      parentId: values.parentId === NO_PARENT ? undefined : values.parentId,
    });
    if (created) {
      onClose();
    }
    return !!created;
  };

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
            className="fixed inset-0 bg-black/70 backdrop-blur-[6px] z-200"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{
              duration: 0.25,
              type: "spring",
              stiffness: 320,
              damping: 30,
            }}
            className="fixed bottom-0 left-0 right-0 z-201 ui-surface-dark border-t border-zinc-700 rounded-t-[20px] pb-8 max-h-[95vh] overflow-y-auto lg:max-w-lg lg:mx-auto lg:rounded-2xl lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:border lg:border-zinc-700"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-zinc-700 lg:hidden" />
            </div>

            <div className="flex items-center justify-between px-6 pt-3 pb-5">
              <h2 className="text-foreground m-0 text-xl font-bold">
                Nova Categoria
              </h2>
              <Button
                variant="secondary"
                size="icon"
                className="bg-muted text-muted-foreground"
                onClick={onClose}
              >
                <X size={16} />
              </Button>
            </div>

            <CategoryForm
              defaultValues={ADD_CATEGORY_DEFAULT_VALUES}
              categories={categories}
              onSubmit={handleSubmit}
              isSubmitting={isCreating}
              submitLabel="Criar Categoria"
              submitErrorMessage="Erro ao criar categoria. Tente novamente."
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddCategoryModal;
