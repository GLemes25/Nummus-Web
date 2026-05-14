"use client";

import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, X, Zap } from "lucide-react";
import { motion } from "motion/react";

const freeFeatures = [
  { label: "Up to 2 wallets", included: true },
  { label: "Basic transaction tracking", included: true },
  { label: "Monthly spending reports", included: true },
  { label: "5 spending categories", included: true },
  { label: "Unlimited wallets", included: false },
  { label: "AI Advanced Insights", included: false },
  { label: "Export to PDF / CSV", included: false },
  { label: "Custom categories & icons", included: false },
  { label: "Budget goals & alerts", included: false },
  { label: "Priority support", included: false },
];

const proFeatures = [
  { label: "Unlimited wallets", included: true },
  { label: "AI Advanced Insights & forecasting", included: true },
  { label: "Export to PDF / CSV / Excel", included: true },
  { label: "Custom categories & icons", included: true },
  { label: "Budget goals & smart alerts", included: true },
  { label: "Recurring transaction tracking", included: true },
  { label: "Investment portfolio tracking", included: true },
  { label: "Multi-currency support", included: true },
  { label: "Priority support (24h)", included: true },
  { label: "Early access to new features", included: true },
];

const testimonials = [
  {
    name: "Sarah L.",
    role: "Product Designer",
    avatar: "SL",
    text: "The AI insights alone are worth the subscription. I saved $400 last month by catching subscription leaks.",
    color: "#7C3AED",
  },
  {
    name: "Marcus T.",
    role: "Software Engineer",
    avatar: "MT",
    text: "Finally an app that understands multi-wallet complexity. The investment tracking is phenomenal.",
    color: "#10B981",
  },
];

const PricingTable = () => (
  <div className="p-6 pt-7 max-w-[960px]">
    {/* Header */}
    <div className="text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 rounded-full px-3.5 py-1.5 mb-4"
      >
        <Crown size={13} className="text-gold" />
        <span className="text-gold text-xs font-semibold tracking-wide">
          NUMMUS
        </span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="text-foreground mb-3 tracking-tight text-3xl font-bold"
      >
        Take full control of your finances
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground text-base max-w-[480px] mx-auto"
      >
        Upgrade to Pro and unlock AI-powered insights, unlimited wallets, and
        advanced analytics.
      </motion.p>
    </div>

    {/* Pricing cards */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-14">
      {/* Free plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="bg-card border border-border rounded-[20px] p-8 flex flex-col"
      >
        <div className="mb-7">
          <div className="inline-flex items-center gap-1.5 mb-4">
            <Zap size={16} className="text-muted-foreground" />
            <span className="text-zinc-400 text-sm font-semibold">Free</span>
          </div>
          <div className="flex items-end gap-1.5 mb-2">
            <span className="text-foreground text-[42px] font-extrabold tracking-tight">
              $0
            </span>
            <span className="text-muted-foreground text-sm pb-1.5">/month</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Get started with essential budgeting tools, no credit card required.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full mb-7 rounded-xl text-zinc-400 border-border"
        >
          Current Plan
        </Button>

        <div className="flex-1">
          <div className="text-muted-foreground text-xs tracking-[0.8px] mb-3.5">
            INCLUDED FEATURES
          </div>
          <div className="flex flex-col gap-3">
            {freeFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: f.included
                      ? "rgba(16,185,129,0.12)"
                      : "rgba(113,113,122,0.08)",
                  }}
                >
                  {f.included ? (
                    <Check size={11} className="text-income" />
                  ) : (
                    <X size={10} className="text-zinc-600" />
                  )}
                </div>
                <span
                  className={`text-sm ${f.included ? "text-zinc-300" : "text-zinc-600"}`}
                >
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pro plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="bg-card border-2 border-gold rounded-[20px] p-8 flex flex-col relative overflow-hidden"
        style={{
          boxShadow:
            "0 0 40px rgba(191,160,113,0.1), 0 0 80px rgba(124,58,237,0.05)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(145deg, rgba(191,160,113,0.04) 0%, rgba(124,58,237,0.04) 100%)",
          }}
        />
        <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(124,58,237,0.12)_0%,transparent_70%)]" />

        <div className="absolute top-5 right-5 bg-gold text-background text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wide">
          MOST POPULAR
        </div>

        <div className="mb-7 relative">
          <div className="inline-flex items-center gap-1.5 mb-4">
            <Sparkles size={16} className="text-gold" />
            <span className="text-gold text-sm font-bold">Nummus Pro</span>
          </div>
          <div className="flex items-end gap-1.5 mb-2">
            <span className="text-foreground text-[42px] font-extrabold tracking-tight">
              $9
            </span>
            <span className="text-muted-foreground text-sm pb-1.5">/month</span>
            <span className="bg-income/10 text-income text-xs font-semibold px-2 py-0.5 rounded-md border border-income/20 pb-2">
              SAVE 30% ANNUAL
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Everything in Free, plus AI insights, unlimited wallets, and
            priority support.
          </p>
        </div>

        <Button
          className="w-full mb-7 rounded-xl text-foreground font-bold text-[15px] relative"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
            boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
          }}
        >
          Upgrade to Pro
        </Button>

        <div className="flex-1 relative">
          <div className="text-muted-foreground text-xs tracking-[0.8px] mb-3.5">
            EVERYTHING IN FREE, PLUS
          </div>
          <div className="flex flex-col gap-3">
            {proFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-brand/30"
                  style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
                >
                  <Check size={11} className="text-brand-muted" />
                </div>
                <span className="text-zinc-300 text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>

    {/* Testimonials */}
    <div className="mb-12">
      <h3 className="text-muted-foreground text-center mb-6 tracking-wide text-xs font-semibold">
        LOVED BY THOUSANDS OF USERS
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <p className="text-zinc-300 text-sm leading-relaxed mb-4">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
              <div
                className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-xs text-foreground font-bold shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                }}
              >
                {t.avatar}
              </div>
              <div>
                <div className="text-foreground text-sm font-semibold">
                  {t.name}
                </div>
                <div className="text-zinc-600 text-xs">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Guarantee */}
    <div className="bg-card border border-border rounded-2xl p-8 text-center">
      <div className="text-4xl mb-3">🛡️</div>
      <h3 className="text-foreground mb-2 font-semibold">
        30-day money-back guarantee
      </h3>
      <p className="text-muted-foreground text-sm mx-auto max-w-[400px]">
        Try Nummus Pro risk-free for 30 days. If you&apos;re not completely
        satisfied, we&apos;ll refund your payment — no questions asked.
      </p>
    </div>
  </div>
);

export default PricingTable;
