"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Camera,
  ChevronRight,
  CreditCard,
  Crown,
  Download,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Shield,
  Smartphone,
  User,
} from "lucide-react";
import { motion } from "motion/react";

type UserProfileProps = {
  onLogout: () => void;
};

type SettingSection = {
  label: string;
  icon: React.ElementType;
  iconColor: string;
  items: {
    label: string;
    value?: string;
    toggle?: boolean;
    toggled?: boolean;
  }[];
};

const sections: SettingSection[] = [
  {
    label: "Account",
    icon: User,
    iconColor: "#7C3AED",
    items: [
      { label: "Full Name", value: "Alex Johnson" },
      { label: "Email address", value: "alex@example.com" },
      { label: "Phone number", value: "+1 (555) 012-3456" },
      { label: "Currency", value: "USD — US Dollar" },
    ],
  },
  {
    label: "Security",
    icon: Lock,
    iconColor: "#F43F5E",
    items: [
      { label: "Change password" },
      { label: "Two-factor authentication", toggle: true, toggled: false },
      { label: "Biometric login", toggle: true, toggled: true },
      { label: "Active sessions", value: "2 devices" },
    ],
  },
  {
    label: "Notifications",
    icon: Bell,
    iconColor: "#BFA071",
    items: [
      { label: "Transaction alerts", toggle: true, toggled: true },
      { label: "Weekly spending report", toggle: true, toggled: true },
      { label: "Budget limit warnings", toggle: true, toggled: false },
      { label: "Promotional emails", toggle: true, toggled: false },
    ],
  },
  {
    label: "Preferences",
    icon: Globe,
    iconColor: "#06B6D4",
    items: [
      { label: "Language", value: "English (US)" },
      { label: "Date format", value: "MM/DD/YYYY" },
      { label: "Week starts on", value: "Monday" },
      { label: "Dark mode", toggle: true, toggled: true },
    ],
  },
];

const quickLinks = [
  { label: "Subscription & Billing", icon: CreditCard, color: "#BFA071" },
  { label: "Export my data", icon: Download, color: "#10B981" },
  { label: "Privacy & Security", icon: Shield, color: "#7C3AED" },
  { label: "Connected apps", icon: Smartphone, color: "#06B6D4" },
  { label: "Help & Support", icon: HelpCircle, color: "#71717a" },
];

const UserProfile = ({ onLogout }: UserProfileProps) => (
  <div className="p-6 pt-7 max-w-[720px]">
    <h1 className="text-foreground m-0 mb-7 tracking-tight text-2xl font-bold">
      Profile & Settings
    </h1>

    {/* Avatar + info card */}
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-2xl p-7 flex items-center gap-5 mb-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #18181b 0%, #1e1030 100%)",
      }}
    >
      <div className="absolute -top-8 -right-8 w-[140px] h-[140px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_70%)]" />

      {/* Avatar */}
      <div className="relative">
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-[26px] text-foreground font-extrabold border-[3px] border-muted shrink-0"
          style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
        >
          AJ
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-muted border-2 border-card text-muted-foreground p-0"
        >
          <Camera size={11} />
        </Button>
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="text-foreground font-bold text-lg tracking-tight mb-0.5">
          Alex Johnson
        </div>
        <div className="text-muted-foreground text-sm mb-2.5">
          alex@example.com
        </div>
        <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 rounded-full px-3 py-1">
          <Crown size={12} className="text-gold" />
          <span className="text-gold text-xs font-semibold tracking-wide">
            NUMMUS PRO
          </span>
        </div>
      </div>

      {/* Member since */}
      <div className="text-right hidden sm:block">
        <div className="text-zinc-600 text-xs mb-0.5">Member since</div>
        <div className="text-zinc-400 text-sm">January 2025</div>
      </div>
    </motion.div>

    {/* Quick links */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="bg-card border border-border rounded-xl overflow-hidden mb-5"
    >
      {quickLinks.map((link, i) => {
        const Icon = link.icon;
        return (
          <Button
            key={link.label}
            variant="ghost"
            className="w-full flex items-center gap-3.5 px-5 py-3.5 h-auto justify-start rounded-none hover:bg-foreground/[0.02]"
            style={{
              borderBottom:
                i < quickLinks.length - 1 ? "1px solid #1f1f22" : "none",
            }}
          >
            <div
              className="w-9 h-9 rounded-[9px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: link.color + "18" }}
            >
              <Icon size={16} style={{ color: link.color }} />
            </div>
            <span className="text-foreground text-sm flex-1 text-left">
              {link.label}
            </span>
            <ChevronRight size={15} className="text-zinc-600" />
          </Button>
        );
      })}
    </motion.div>

    {/* Settings sections */}
    {sections.map((section, si) => {
      const SectionIcon = section.icon;
      return (
        <motion.div
          key={section.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + si * 0.06 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2 mb-2 pl-1">
            <div
              className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center"
              style={{ backgroundColor: section.iconColor + "20" }}
            >
              <SectionIcon size={12} style={{ color: section.iconColor }} />
            </div>
            <span className="text-muted-foreground text-xs font-semibold tracking-[0.8px]">
              {section.label.toUpperCase()}
            </span>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {section.items.map((item, ii) => (
              <div
                key={item.label}
                className={`flex items-center px-[18px] py-[13px] ${!item.toggle ? "hover:bg-foreground/[0.02] cursor-pointer transition-colors" : ""}`}
                style={{
                  borderBottom:
                    ii < section.items.length - 1
                      ? "1px solid #1f1f22"
                      : "none",
                }}
              >
                <span className="text-foreground text-sm flex-1">
                  {item.label}
                </span>
                {item.toggle !== undefined ? (
                  <Switch defaultChecked={item.toggled} />
                ) : (
                  <div className="flex items-center gap-2">
                    {item.value && (
                      <span className="text-muted-foreground text-sm">
                        {item.value}
                      </span>
                    )}
                    <ChevronRight size={14} className="text-zinc-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      );
    })}

    {/* Danger zone */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.38 }}
      className="mt-2"
    >
      <div className="flex flex-col gap-2.5">
        <Button
          onClick={onLogout}
          variant="destructive"
          className="w-full gap-2"
        >
          <LogOut size={16} />
          Sign Out
        </Button>

        <Button
          variant="outline"
          className="w-full text-zinc-700 border-border text-sm"
        >
          Delete account permanently
        </Button>
      </div>

      <div className="text-center mt-6 mb-2">
        <span className="text-zinc-700 text-xs">Nummus v2.4.1 · </span>
        <Button
          variant="link"
          size="sm"
          className="text-zinc-600 p-0 h-auto text-xs"
        >
          Privacy Policy
        </Button>
        <span className="text-zinc-700 text-xs"> · </span>
        <Button
          variant="link"
          size="sm"
          className="text-zinc-600 p-0 h-auto text-xs"
        >
          Terms of Service
        </Button>
      </div>
    </motion.div>
  </div>
);

export default UserProfile;
