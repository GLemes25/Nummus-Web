"use client";

import { motion } from "motion/react";
import {
  CreditCard as CreditCardIcon,
  Edit3,
  Loader2,
  MoreHorizontal,
  Receipt,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import type { CreditCard } from "@/types/api";

type CreditCardListProps = {
  creditCards: CreditCard[];
  isLoading: boolean;
  error: string | null;
  onSelectCreditCard: (creditCard: CreditCard) => void;
  onEditCreditCard: (creditCard: CreditCard) => void;
  onDeleteCreditCard: (creditCard: CreditCard) => void;
  onPayInvoice: (creditCard: CreditCard) => void;
};

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CreditCardList = ({
  creditCards,
  isLoading,
  error,
  onSelectCreditCard,
  onEditCreditCard,
  onDeleteCreditCard,
  onPayInvoice,
}: CreditCardListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <p className="text-expense text-sm text-center py-12">{error}</p>;
  }

  if (creditCards.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-12">
        Nenhum cartão de crédito cadastrado
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {creditCards.map((creditCard, i) => {
        const hasValidLimit = Boolean(creditCard.creditLimit);
        const availableLimit = hasValidLimit
          ? creditCard.creditLimit - creditCard.currentInvoiceAmount
          : null;
        const usedPercentage = hasValidLimit
          ? Math.min(
              100,
              (creditCard.currentInvoiceAmount / creditCard.creditLimit) * 100
            )
          : 0;

        return (
          <motion.div
            key={creditCard.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card
              className="cursor-pointer hover:border-brand/40 transition-colors"
              onClick={() => onSelectCreditCard(creditCard)}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9.5 h-9.5 rounded-[10px] bg-brand/10 flex items-center justify-center shrink-0">
                      <CreditCardIcon size={18} className="text-brand" />
                    </div>
                    <CardTitle className="truncate">
                      {creditCard.name}
                    </CardTitle>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7.5 h-7.5 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        }
                      />
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCreditCard(creditCard);
                          }}
                        >
                          <Edit3 size={14} />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCreditCard(creditCard);
                          }}
                        >
                          <Trash2 size={14} />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <div className="text-muted-foreground text-xs mb-1">
                    Fatura Atual
                  </div>
                  <div className="text-expense font-bold text-xl tracking-tight">
                    {formatCurrency(creditCard.currentInvoiceAmount)}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-muted-foreground">
                      Limite Disponível
                    </span>
                    <span className="text-foreground font-medium">
                      {hasValidLimit && availableLimit !== null
                        ? formatCurrency(availableLimit)
                        : "-"}
                    </span>
                  </div>
                  <Progress value={hasValidLimit ? usedPercentage : 0} />
                </div>

                <div className="text-muted-foreground text-xs">
                  Vence dia {creditCard.dueDay}
                </div>

                {creditCard.currentInvoiceAmount > 0 && (
                  <Button
                    variant="secondary"
                    className="w-full gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPayInvoice(creditCard);
                    }}
                  >
                    <Receipt size={14} />
                    Pagar Fatura
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CreditCardList;
