"use client";

import { motion } from "motion/react";
import { CreditCard as CreditCardIcon, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCreditCards } from "@/hooks/use-credit-cards";

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CreditCards = () => {
  const { creditCards, isLoading, error } = useCreditCards();

  return (
    <div className="p-6 pt-7 w-full max-w-225 mx-auto">
      <div className="mb-6">
        <h1 className="text-foreground m-0 mb-1 tracking-tight text-2xl font-bold">
          Cartões
        </h1>
        <p className="text-muted-foreground m-0 text-sm">
          Acompanhe suas faturas e limites disponíveis
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="text-expense text-sm text-center py-12">{error}</p>
      ) : creditCards.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">
          Nenhum cartão de crédito cadastrado
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creditCards.map((creditCard, i) => {
            const availableLimit =
              creditCard.creditLimit - creditCard.currentInvoiceAmount;
            const usedPercentage =
              creditCard.creditLimit > 0
                ? Math.min(
                    100,
                    (creditCard.currentInvoiceAmount / creditCard.creditLimit) *
                      100
                  )
                : 0;

            return (
              <motion.div
                key={creditCard.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-9.5 h-9.5 rounded-[10px] bg-brand/10 flex items-center justify-center shrink-0">
                        <CreditCardIcon size={18} className="text-brand" />
                      </div>
                      <CardTitle>{creditCard.name}</CardTitle>
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
                          {formatCurrency(availableLimit)}
                        </span>
                      </div>
                      <Progress value={usedPercentage} />
                    </div>

                    <div className="text-muted-foreground text-xs">
                      Vence dia {creditCard.dueDay}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CreditCards;
