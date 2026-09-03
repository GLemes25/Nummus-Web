"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/api";

const NO_PARENT = "none";

const categoryFormSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Informe uma cor hexadecimal válida"),
  icon: z.string().min(1, "Informe um ícone"),
  parentId: z.string(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

type CategoryFormProps = {
  defaultValues: CategoryFormValues;
  categories: Category[];
  onSubmit: (values: CategoryFormValues) => Promise<boolean>;
  isSubmitting: boolean;
  submitLabel: string;
  submitErrorMessage: string;
};

const CategoryForm = ({
  defaultValues,
  categories,
  onSubmit,
  isSubmitting,
  submitLabel,
  submitErrorMessage,
}: CategoryFormProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues,
  });

  const handleSubmit = async (values: CategoryFormValues) => {
    setSubmitError(null);
    const isSuccess = await onSubmit(values);
    if (!isSuccess) {
      setSubmitError(submitErrorMessage);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
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
                <IconPicker value={field.value} onChange={field.onChange} />
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
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma categoria pai">
                      {(value: string) =>
                        value === NO_PARENT
                          ? "Nenhuma"
                          : (categories.find((category) => category.id === value)?.name ??
                            "Selecione uma categoria pai")
                      }
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent sideOffset={4} className="max-h-72">
                  <SelectItem value={NO_PARENT}>Nenhuma</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {submitError && (
          <p className="text-expense text-sm text-center">{submitError}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-1 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold text-[15px]"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            submitLabel
          )}
        </Button>
      </form>
    </Form>
  );
};

export { CategoryForm, NO_PARENT, categoryFormSchema };
export type { CategoryFormValues };
