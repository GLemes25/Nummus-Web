'use client';

type CustomTooltipProps = {
  active?: boolean;
  payload?: { value: number; payload: { month: string } }[];
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-muted border border-zinc-700 rounded-lg px-3 py-2">
      <div className="text-gold font-semibold text-sm">${payload[0].value.toLocaleString()}</div>
      <div className="text-muted-foreground text-xs">{payload[0].payload.month}</div>
    </div>
  );
};

export default CustomTooltip;
