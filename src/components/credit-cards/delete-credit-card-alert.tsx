"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { CreditCard } from "@/types/api";
import { Loader2 } from "lucide-react";

type DeleteCreditCardAlertProps = {
  creditCard: CreditCard | null;
  onClose: () => void;
  onDeleteCreditCard: (id: string) => Promise<boolean>;
  isDeleting: boolean;
};

const DeleteCreditCardAlert = ({
  creditCard,
  onClose,
  onDeleteCreditCard,
  isDeleting,
}: DeleteCreditCardAlertProps) => {
  return (
    <AlertDialog
      open={!!creditCard}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent className="ui-surface-dark">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir cartão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o cartão &quot;{creditCard?.name}
            &quot;? Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={async () => {
              if (!creditCard) return;
              await onDeleteCreditCard(creditCard.id);
              onClose();
            }}
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Excluir"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCreditCardAlert;
