"use client";

import { CreditCard as CreditCardIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTransactions } from "@/hooks/use-transactions";
import type { CreditCard } from "@/types/api";

type CreditCardDetailsModalProps = {
  creditCard: CreditCard | null;
  isOpen: boolean;
  onClose: () => void;
};

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const CreditCardDetailsModal = ({
  creditCard,
  isOpen,
  onClose,
}: CreditCardDetailsModalProps) => {
  const { transactions, isLoading, error } = useTransactions({
    creditCardId: creditCard?.id,
    enabled: isOpen && !!creditCard?.id,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-brand/10 flex items-center justify-center shrink-0">
              <CreditCardIcon size={16} className="text-brand" />
            </div>
            <DialogTitle>{creditCard?.name ?? "Extrato da Fatura"}</DialogTitle>
          </div>
        </DialogHeader>

        {creditCard && (
          <div className="px-4 pb-1">
            <div className="flex items-baseline justify-between border-b border-border pb-3 mb-1">
              <span className="text-muted-foreground text-xs">Fatura atual</span>
              <span className="text-expense font-bold text-lg tracking-tight">
                {formatCurrency(creditCard.currentInvoiceAmount)}
              </span>
            </div>
          </div>
        )}

        <div className="px-4 pb-4 flex flex-col gap-1 max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={18} className="animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <p className="text-expense text-sm text-center py-8">{error}</p>
          ) : transactions.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Nenhuma despesa nesta fatura.
            </p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-foreground text-sm font-medium truncate">
                    {transaction.description}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(transaction.date)}
                  </span>
                </div>
                <span className="text-expense text-sm font-semibold ml-4 shrink-0">
                  -{formatCurrency(transaction.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditCardDetailsModal;
