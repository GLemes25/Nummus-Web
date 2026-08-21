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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreditCard, Wallet } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const payInvoiceSchema = z.object({
  walletId: z.string().min(1, "Selecione uma carteira"),
});

type PayInvoiceFormValues = z.infer<typeof payInvoiceSchema>;

type PayInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  creditCard: CreditCard | null;
  wallets: Wallet[];
  isLoadingWallets: boolean;
  onPayInvoice: (creditCardId: string, walletId: string) => Promise<boolean>;
  isPaying: boolean;
};

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const PayInvoiceModal = ({
  isOpen,
  onClose,
  creditCard,
  wallets,
  isLoadingWallets,
  onPayInvoice,
  isPaying,
}: PayInvoiceModalProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<PayInvoiceFormValues>({
    resolver: zodResolver(payInvoiceSchema),
    defaultValues: { walletId: "" },
  });

  useEffect(() => {
    if (!creditCard) return;
    form.reset({ walletId: creditCard.walletId ?? "" });
  }, [creditCard, form]);

  const handleClose = () => {
    form.reset();
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (values: PayInvoiceFormValues) => {
    if (!creditCard) return;
    setSubmitError(null);
    const isSuccess = await onPayInvoice(creditCard.id, values.walletId);
    if (!isSuccess) {
      setSubmitError("Erro ao pagar fatura. Tente novamente.");
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
      <DialogContent className="ui-surface-dark">
        <DialogHeader>
          <DialogTitle>Pagar Fatura</DialogTitle>
        </DialogHeader>

        {creditCard && (
          <div className="px-4 flex flex-col gap-1 border-b border-border pb-4">
            <span className="text-muted-foreground text-xs">
              {creditCard.name}
            </span>
            <span className="text-expense font-bold text-2xl tracking-tight">
              {formatCurrency(creditCard.currentInvoiceAmount)}
            </span>
          </div>
        )}

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
                    PAGAR COM
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoadingWallets}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a carteira" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.name} ({formatCurrency(wallet.balance)})
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
              disabled={isPaying}
              className="w-full mt-1 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold text-[15px]"
            >
              {isPaying ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Confirmar Pagamento"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PayInvoiceModal;
