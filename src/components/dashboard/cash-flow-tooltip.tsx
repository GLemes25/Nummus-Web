"use client";

import type { TooltipContentProps } from "recharts";

const seriesLabels: Record<string, string> = {
  income: "Receitas",
  expense: "Despesas",
};

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const CashFlowTooltip = ({
  active,
  payload,
  label,
}: Partial<TooltipContentProps<number, string>>) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border/50 bg-popover px-3 py-2 shadow-xl">
      <div className="text-foreground text-xs font-medium mb-1.5">{label}</div>
      <div className="flex flex-col gap-1">
        {payload.map((item) => (
          <div
            key={String(item.dataKey ?? item.name)}
            className="flex items-center gap-2 text-xs"
          >
            <span
              className="w-2 h-2 rounded-xs shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">
              {seriesLabels[String(item.dataKey)] ?? item.name}
            </span>
            <span className="ml-auto font-mono font-medium text-foreground">
              R$ {formatCurrency(Number(item.value ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CashFlowTooltip;
