"use client";

import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const NO_PARENT = "none";

const editCategorySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Informe uma cor hexadecimal válida"),
  icon: z.string().min(1, "Informe um ícone"),
  parentId: z.string(),
});

type EditCategoryFormValues = z.infer<typeof editCategorySchema>;

type UpdateCategoryInput = {
  name: string;
  color: string;
  icon: string;
  parentId: string | null;
};

type EditCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  categories: Category[];
  onUpdateCategory: (
    id: string,
    input: UpdateCategoryInput,
  ) => Promise<boolean>;
  isUpdating: boolean;
};

const EditCategoryModal = ({
  isOpen,
  onClose,
  category,
  categories,
  onUpdateCategory,
  isUpdating,
}: EditCategoryModalProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<EditCategoryFormValues>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: "",
      color: "#7C3AED",
      icon: "tag",
      parentId: NO_PARENT,
    },
  });

  useEffect(() => {
    if (!category) return;
    form.reset({
      name: category.name,
      color: category.color,
      icon: category.icon,
      parentId: category.parentId ?? NO_PARENT,
    });
  }, [category, form]);

  const handleClose = () => {
    form.reset();
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (values: EditCategoryFormValues) => {
    if (!category) return;
    setSubmitError(null);
    const isSuccess = await onUpdateCategory(category.id, {
      name: values.name,
      color: values.color,
      icon: values.icon,
      parentId: values.parentId === NO_PARENT ? null : values.parentId,
    });
    if (!isSuccess) {
      setSubmitError("Erro ao atualizar categoria. Tente novamente.");
      return;
    }
    form.reset();
    onClose();
  };

  const selectableParents = categories.filter((c) => c.id !== category?.id);

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
                Editar Categoria
              </h2>
              <Button
                variant="secondary"
                size="icon"
                className="bg-muted text-muted-foreground"
                onClick={handleClose}
              >
                <X size={16} />
              </Button>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="px-6 flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                        NOME
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Alimentação" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                        ÍCONE
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg border border-input flex items-center justify-center shrink-0">
                            <DynamicIcon name={field.value} size={16} />
                          </div>
                          <Input
                            placeholder="Ex: utensils-crossed"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                        COR
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2.5">
                          <input
                            type="color"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-8 h-8 rounded-lg border border-input bg-transparent p-0.5 shrink-0 cursor-pointer"
                          />
                          <Input placeholder="#7C3AED" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                        CATEGORIA PAI
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma categoria pai" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent sideOffset={4} className="max-h-72">
                          <SelectItem value={NO_PARENT}>Nenhuma</SelectItem>
                          {selectableParents.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {submitError && (
                  <p className="text-expense text-sm text-center">
                    {submitError}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full mt-1 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold text-[15px]"
                >
                  {isUpdating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditCategoryModal;
