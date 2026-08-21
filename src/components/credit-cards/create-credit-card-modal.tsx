"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useWallets } from "@/hooks/use-wallets";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const NO_WALLET_VALUE = "none";

const createCreditCardSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  creditLimit: z.coerce
    .number({ message: "Informe um valor válido" })
    .positive("O limite deve ser maior que zero"),
  closingDay: z.coerce
    .number({ message: "Informe um dia válido" })
    .int("O dia deve ser um número inteiro")
    .min(1, "O dia deve estar entre 1 e 31")
    .max(31, "O dia deve estar entre 1 e 31"),
  dueDay: z.coerce
    .number({ message: "Informe um dia válido" })
    .int("O dia deve ser um número inteiro")
    .min(1, "O dia deve estar entre 1 e 31")
    .max(31, "O dia deve estar entre 1 e 31"),
  walletId: z.string().default(NO_WALLET_VALUE),
});

type CreateCreditCardFormInput = z.input<typeof createCreditCardSchema>;
type CreateCreditCardValues = z.output<typeof createCreditCardSchema>;

type CreateCreditCardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateCreditCard: (input: {
    name: string;
    creditLimit: number;
    closingDay: number;
    dueDay: number;
    walletId?: string;
  }) => Promise<boolean>;
  isCreating: boolean;
};

const CreateCreditCardModal = ({
  isOpen,
  onClose,
  onCreateCreditCard,
  isCreating,
}: CreateCreditCardModalProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { wallets, isLoading: isLoadingWallets } = useWallets();

  const form = useForm<
    CreateCreditCardFormInput,
    unknown,
    CreateCreditCardValues
  >({
    resolver: zodResolver(createCreditCardSchema),
    defaultValues: {
      name: "",
      creditLimit: 0,
      closingDay: 1,
      dueDay: 10,
      walletId: NO_WALLET_VALUE,
    },
  });

  const handleClose = () => {
    form.reset();
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (values: CreateCreditCardValues) => {
    setSubmitError(null);
    const isSuccess = await onCreateCreditCard({
      ...values,
      walletId:
        values.walletId === NO_WALLET_VALUE ? undefined : values.walletId,
    });
    if (!isSuccess) {
      setSubmitError("Erro ao criar cartão. Tente novamente.");
      return;
    }
    form.reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cartão</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-4 pb-4 flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="walletId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                    VINCULAR CONTA
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoadingWallets}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Vincular conta">
                          {(value: string) =>
                            value && value !== NO_WALLET_VALUE
                              ? (wallets.find((wallet) => wallet.id === value)
                                  ?.name ?? "Vincular conta")
                              : "Nenhuma"
                          }
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NO_WALLET_VALUE}>Nenhuma</SelectItem>
                      {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                    NOME DO CARTÃO
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nubank" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creditLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                    LIMITE DE CRÉDITO
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      value={field.value as number | string}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="closingDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                      DIA DE FECHAMENTO
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        step="1"
                        placeholder="1"
                        {...field}
                        value={field.value as number | string}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                      DIA DE VENCIMENTO
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        step="1"
                        placeholder="10"
                        {...field}
                        value={field.value as number | string}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {submitError && (
              <p className="text-expense text-sm text-center">
                {submitError}
              </p>
            )}

            <Button
              type="submit"
              disabled={isCreating}
              className="w-full mt-1 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold text-[15px]"
            >
              {isCreating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Criar Cartão"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCreditCardModal;
