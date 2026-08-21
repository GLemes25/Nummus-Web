export type Wallet = {
  id: string
  name: string
  currency: string
  initialBalance: number
  balance: number
  isArchived: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export type CreditCard = {
  id: string
  name: string
  creditLimit: number
  closingDay: number
  dueDay: number
  currentInvoiceAmount: number
  userId: string
  createdAt: string
  updatedAt: string
}

export type Category = {
  id: string
  name: string
  color: string
  icon: string
  parentId: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export type TransactionType = "INCOME" | "EXPENSE" | "BALANCE_ADJUSTMENT"
export type PaymentMethod = "CASH" | "PIX" | "TRANSFER" | "DEBIT" | "CREDIT"
export type TransactionStatus = "PENDING" | "COMPLETED" | "CANCELLED"

export type Transaction = {
  id: string
  amount: number
  type: TransactionType
  paymentMethod: PaymentMethod
  status: TransactionStatus
  date: string
  description: string
  walletId: string | null
  creditCardId: string | null
  categoryId: string | null
  installmentId?: string
  userId: string
  createdAt: string
  updatedAt: string
  category: {
    id: string
    name: string
    color: string
    icon: string
  } | null
  wallet: {
    id: string
    name: string
    currency: string
  } | null
}

export type TransactionsMeta = {
  totalCount: number
  page: number
  limit: number
  totalPages: number
}

export type TransactionsResponse = {
  data: Transaction[]
  meta: TransactionsMeta
}

export type NetWorthTrendPoint = {
  month: string
  balance: number
}

export type NetWorthSummary = {
  netWorth: number
  assets: number
  liabilities: number
}

export type ExpenseByCategory = {
  name: string
  amount: number
  color: string
  icon: string
}

export type MonthlySummary = {
  totalIncome: number
  totalExpense: number
  balance: number
}
