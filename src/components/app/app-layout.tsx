"use client";

import Dashboard from "@/components/dashboard/dashboard";
import PricingTable from "@/components/premium/pricing-table";
import UserProfile from "@/components/profile/user-profile";
import TransactionModal from "@/components/transactions/transaction-modal";
import Transactions from "@/components/transactions/transactions";
import { Button } from "@/components/ui/button";
import Wallets from "@/components/wallets/wallets";
import type { AppView } from "@/types/app";
import {
  CreditCard,
  Crown,
  LayoutDashboard,
  Plus,
  User,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

type AppLayoutProps = {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
  showTransactionModal: boolean;
  onToggleTransactionModal: (show: boolean) => void;
};

type NavItem = {
  id: AppView;
  label: string;
  icon: React.ElementType;
  badge?: string;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Painel", icon: LayoutDashboard },
  { id: "transactions", label: "Transações", icon: CreditCard },
  { id: "wallets", label: "Carteiras", icon: Wallet },
  { id: "premium", label: "Premium", icon: Crown, badge: "PRO" },
  { id: "profile", label: "Perfil", icon: User },
];

const AppLayout = ({
  currentView,
  onNavigate,
  onLogout,
  showTransactionModal,
  onToggleTransactionModal,
}: AppLayoutProps) => (
  <div className="bg-background min-h-screen flex">
    <aside className="hidden lg:flex flex-col fixed h-screen w-60 border-r border-border bg-card z-20 shrink-0">
      <div className="px-5 pt-6 pb-5 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <Image src="/Icon.svg" alt="Logo" width={60} height={60} />
          <div>
            <div className="text-foreground font-bold text-sm tracking-tight">
              Nummus
            </div>
            <div className="text-gold text-[9px] tracking-[2px] mt-0.5">
              PREMIUM
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2.5 py-3.5 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start gap-3 px-3 py-2.5 h-auto rounded-lg relative text-sm font-normal ${
                isActive
                  ? "bg-brand/10 text-brand hover:bg-brand/15 font-medium"
                  : "text-muted-foreground hover:bg-foreground/4 hover:text-foreground"
              }`}
              onClick={() => onNavigate(item.id)}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-4.5 bg-brand rounded-r-xs" />
              )}
              <Icon size={17} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="bg-gold text-background text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide">
                  {item.badge}
                </span>
              )}
            </Button>
          );
        })}
      </nav>

      <div className="px-2.5 pt-4 pb-8 border-t border-zinc-900">
        <Button
          className="w-full gap-2 text-foreground"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
            boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
          }}
          onClick={() => onToggleTransactionModal(true)}
        >
          <Plus size={16} />
          Nova Transação
        </Button>
      </div>
    </aside>

    <main className="lg:ml-60 flex-1 pb-20 min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="min-h-screen"
        >
          {currentView === "dashboard" && (
            <Dashboard
              onNewTransaction={() => onToggleTransactionModal(true)}
              onNavigate={onNavigate}
            />
          )}
          {currentView === "transactions" && (
            <Transactions
              onNewTransaction={() => onToggleTransactionModal(true)}
            />
          )}
          {currentView === "wallets" && <Wallets />}
          {currentView === "premium" && <PricingTable />}
          {currentView === "profile" && <UserProfile onLogout={onLogout} />}
        </motion.div>
      </AnimatePresence>
    </main>

    <div className="flex lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border pb-6 pt-2.5 z-50 justify-around items-center">
      {navItems.slice(0, 2).map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant="ghost"
            className={`flex flex-col items-center gap-1 px-3.5 py-1.5 h-auto ${isActive ? "text-brand" : "text-zinc-600"}`}
            onClick={() => onNavigate(item.id)}
          >
            <Icon size={22} />
            <span
              className={`text-[10px] ${isActive ? "font-medium" : "font-normal"}`}
            >
              {item.label}
            </span>
          </Button>
        );
      })}

      <Button
        className="w-13.5 h-13.5 rounded-full p-0 shrink-0 mb-1"
        style={{
          background: "linear-gradient(145deg, #7C3AED, #6D28D9)",
          boxShadow:
            "0 4px 20px rgba(124,58,237,0.55), 0 0 0 6px rgba(124,58,237,0.08)",
        }}
        onClick={() => onToggleTransactionModal(true)}
      >
        <Plus size={24} className="text-foreground" />
      </Button>

      {[navItems[2], navItems[4]].map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        return (
          <Button
            key={item.id}
            variant="ghost"
            className={`flex flex-col items-center gap-1 px-3.5 py-1.5 h-auto ${isActive ? "text-brand" : "text-zinc-600"}`}
            onClick={() => onNavigate(item.id)}
          >
            <Icon size={22} />
            <span
              className={`text-[10px] ${isActive ? "font-medium" : "font-normal"}`}
            >
              {item.label}
            </span>
          </Button>
        );
      })}
    </div>

    <TransactionModal
      isOpen={showTransactionModal}
      onClose={() => onToggleTransactionModal(false)}
    />
  </div>
);

export default AppLayout;
