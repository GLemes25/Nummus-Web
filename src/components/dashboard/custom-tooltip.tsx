"use client";

type CustomTooltipProps = {
  active?: boolean;
  payload?: { value: number; payload: { month: string } }[];
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const formatted = (payload[0].value ?? 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg px-3 py-2">
      <div className="text-gold font-semibold text-sm">R$ {formatted}</div>
      <div className="text-muted-foreground text-xs">
        {payload[0].payload.month}
      </div>
    </div>
  );
};

export default CustomTooltip;
