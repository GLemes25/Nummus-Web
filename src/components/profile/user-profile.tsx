"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
} from "lucide-react"
import { motion } from "motion/react"
import { useSession } from "@/lib/auth-client"

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
    label: "Conta",
    icon: User,
    iconColor: "#7C3AED",
    items: [
      { label: "Nome Completo", value: "Alex Johnson" },
      { label: "Endereço de e-mail", value: "alex@exemplo.com" },
      { label: "Número de telefone", value: "+1 (555) 012-3456" },
      { label: "Moeda", value: "USD — Dólar Americano" },
    ],
  },
  {
    label: "Segurança",
    icon: Lock,
    iconColor: "#F43F5E",
    items: [
      { label: "Alterar senha" },
      { label: "Autenticação de dois fatores", toggle: true, toggled: false },
      { label: "Login biométrico", toggle: true, toggled: true },
      { label: "Sessões ativas", value: "2 dispositivos" },
    ],
  },
  {
    label: "Notificações",
    icon: Bell,
    iconColor: "#BFA071",
    items: [
      { label: "Alertas de transação", toggle: true, toggled: true },
      { label: "Relatório semanal de gastos", toggle: true, toggled: true },
      { label: "Avisos de limite de orçamento", toggle: true, toggled: false },
      { label: "E-mails promocionais", toggle: true, toggled: false },
    ],
  },
  {
    label: "Preferências",
    icon: Globe,
    iconColor: "#06B6D4",
    items: [
      { label: "Idioma", value: "Português (BR)" },
      { label: "Formato de data", value: "DD/MM/AAAA" },
      { label: "Semana começa em", value: "Segunda-feira" },
      { label: "Modo escuro", toggle: true, toggled: true },
    ],
  },
];

const quickLinks = [
  { label: "Assinatura e Cobrança", icon: CreditCard, color: "#BFA071" },
  { label: "Exportar meus dados", icon: Download, color: "#10B981" },
  { label: "Privacidade e Segurança", icon: Shield, color: "#7C3AED" },
  { label: "Apps conectados", icon: Smartphone, color: "#06B6D4" },
  { label: "Ajuda e Suporte", icon: HelpCircle, color: "#71717a" },
];

const UserProfile = ({ onLogout }: UserProfileProps) => {
  const { data: sessionData } = useSession()
  const userName = sessionData?.user?.name ?? "Usuário"
  const userEmail = sessionData?.user?.email ?? ""
  const userInitials = userName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
  const memberSince = sessionData?.user?.createdAt
    ? new Date(sessionData.user.createdAt).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : ""

  return (
  <div className="p-6 pt-7 max-w-180">
    <h1 className="text-foreground m-0 mb-7 tracking-tight text-2xl font-bold">
      Perfil e Configurações
    </h1>

    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-2xl p-7 flex items-center gap-5 mb-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #18181b 0%, #1e1030 100%)",
      }}
    >
      <div className="absolute -top-8 -right-8 w-35 h-35 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(124,58,237,0.15)_0%,transparent_70%)]" />

      <div className="relative">
        <div
          className="w-18 h-18 rounded-full flex items-center justify-center text-[26px] text-foreground font-extrabold border-[3px] border-muted shrink-0"
          style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
        >
          {userInitials}
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-muted border-2 border-card text-muted-foreground p-0"
        >
          <Camera size={11} />
        </Button>
      </div>

      <div className="flex-1">
        <div className="text-foreground font-bold text-lg tracking-tight mb-0.5">
          {userName}
        </div>
        <div className="text-muted-foreground text-sm mb-2.5">
          {userEmail}
        </div>
        <div className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 rounded-full px-3 py-1">
          <Crown size={12} className="text-gold" />
          <span className="text-gold text-xs font-semibold tracking-wide">
            NUMMUS PRO
          </span>
        </div>
      </div>

      {memberSince && (
        <div className="text-right hidden sm:block">
          <div className="text-zinc-600 text-xs mb-0.5">Membro desde</div>
          <div className="text-zinc-400 text-sm capitalize">{memberSince}</div>
        </div>
      )}
    </motion.div>

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
            className="w-full flex items-center gap-3.5 px-5 py-3.5 h-auto justify-start rounded-none hover:bg-foreground/2"
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
                className={`flex items-center px-[18px] py-[13px] ${!item.toggle ? "hover:bg-foreground/2 cursor-pointer transition-colors" : ""}`}
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
          Sair
        </Button>

        <Button
          variant="outline"
          className="w-full text-zinc-700 border-border text-sm"
        >
          Excluir conta permanentemente
        </Button>
      </div>

      <div className="text-center mt-6 mb-2">
        <span className="text-zinc-700 text-xs">Nummus v2.4.1 · </span>
        <Button
          variant="link"
          size="sm"
          className="text-zinc-600 p-0 h-auto text-xs"
        >
          Política de Privacidade
        </Button>
        <span className="text-zinc-700 text-xs"> · </span>
        <Button
          variant="link"
          size="sm"
          className="text-zinc-600 p-0 h-auto text-xs"
        >
          Termos de Serviço
        </Button>
      </div>
    </motion.div>
  </div>
  )
}

export default UserProfile
