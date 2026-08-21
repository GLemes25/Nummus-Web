"use client"

import { Search, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategories } from "@/hooks/use-categories"
import { useCreditCards } from "@/hooks/use-credit-cards"
import { useWallets } from "@/hooks/use-wallets"
import type { TransactionType } from "@/types/api"

const ALL_VALUE = "all"

const typeOptions: { value: TransactionType | typeof ALL_VALUE; label: string }[] = [
  { value: ALL_VALUE, label: "Todos" },
  { value: "INCOME", label: "Receita" },
  { value: "EXPENSE", label: "Despesa" },
]

const walletValue = (walletId: string) => `wallet:${walletId}`
const creditCardValue = (creditCardId: string) => `card:${creditCardId}`

type TransactionFiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  type: TransactionType | typeof ALL_VALUE
  onTypeChange: (value: TransactionType | typeof ALL_VALUE) => void
  categoryId: string
  onCategoryChange: (value: string) => void
  walletId: string
  creditCardId: string
  onAccountChange: (walletId: string, creditCardId: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

const TransactionFilters = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  categoryId,
  onCategoryChange,
  walletId,
  creditCardId,
  onAccountChange,
  onClearFilters,
  hasActiveFilters,
}: TransactionFiltersProps) => {
  const { categories } = useCategories()
  const { wallets } = useWallets()
  const { creditCards } = useCreditCards()

  const accountValue =
    walletId !== ALL_VALUE
      ? walletValue(walletId)
      : creditCardId !== ALL_VALUE
        ? creditCardValue(creditCardId)
        : ALL_VALUE

  const handleAccountChange = (value: string) => {
    if (value.startsWith("wallet:")) {
      onAccountChange(value.replace("wallet:", ""), ALL_VALUE)
      return
    }
    if (value.startsWith("card:")) {
      onAccountChange(ALL_VALUE, value.replace("card:", ""))
      return
    }
    onAccountChange(ALL_VALUE, ALL_VALUE)
  }

  return (
    <div className="flex gap-2.5 mb-5 flex-wrap">
      <div className="relative flex-1 min-w-50">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar transações…"
          className="pl-9 bg-card border-border text-foreground"
        />
      </div>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className={
                hasActiveFilters
                  ? "bg-brand/15 text-brand-muted border-brand/40"
                  : "bg-card border-border text-muted-foreground"
              }
            >
              <SlidersHorizontal size={14} />
              Filtros
            </Button>
          }
        />
        <PopoverContent className="w-70 border-zinc-800">
          <PopoverHeader>
            <PopoverTitle>Filtrar transações</PopoverTitle>
          </PopoverHeader>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Tipo</span>
              <Select value={type} onValueChange={(value) => onTypeChange(value ?? ALL_VALUE)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos">
                    {(value: string) =>
                      typeOptions.find((option) => option.value === value)?.label ?? "Todos"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Categoria</span>
              <Select value={categoryId} onValueChange={(value) => onCategoryChange(value ?? ALL_VALUE)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas">
                    {(value: string) =>
                      categories.find((category) => category.id === value)?.name ?? "Todas"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Conta</span>
              <Select
                value={accountValue}
                onValueChange={(value) => handleAccountChange(value ?? ALL_VALUE)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas">
                    {(value: string) =>
                      wallets.find((wallet) => walletValue(wallet.id) === value)?.name ??
                      creditCards.find((creditCard) => creditCardValue(creditCard.id) === value)
                        ?.name ??
                      "Todas"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>Todas</SelectItem>
                  {wallets.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Carteiras</SelectLabel>
                      {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={walletValue(wallet.id)}>
                          {wallet.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                  {creditCards.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Cartões de crédito</SelectLabel>
                      {creditCards.map((creditCard) => (
                        <SelectItem key={creditCard.id} value={creditCardValue(creditCard.id)}>
                          {creditCard.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="justify-start text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
                Limpar filtros
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default TransactionFilters
