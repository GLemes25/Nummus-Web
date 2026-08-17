"use client";

import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpensesByCategory } from "@/hooks/use-expenses-by-category";
import type { ExpenseByCategory } from "@/types/api";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const formatCurrency = (value: number) =>
  (value ?? 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

type ChartEntry = ExpenseByCategory & { chartValue: number };

type CategoryTooltipProps = {
  active?: boolean;
  payload?: { value: number; payload: ChartEntry }[];
};

const CategoryTooltip = ({ active, payload }: CategoryTooltipProps) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;
  return (
    <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg px-3 py-2 text-xs">
      <div className="flex items-center gap-1.5 mb-1">
        <div
          className="w-2 h-2 rounded-xs shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-foreground font-medium">{entry.name}</span>
      </div>
      <span className="text-muted-foreground">
        R$ {formatCurrency(entry.value ?? 0)}
      </span>
    </div>
  );
};

const GHOST_ENTRY: ChartEntry = {
  name: "Nenhum gasto",
  value: 0,
  chartValue: 1,
  color: "#71717a",
  icon: "minus",
};

const ExpensesCategoryChart = () => {
  const { expenses, isLoading } = useExpensesByCategory();

  const currentMonthLabel = new Date().toLocaleDateString("pt-BR", {
    month: "long",
  });
  const currentMonthLabelCapitalized =
    currentMonthLabel.charAt(0).toUpperCase() + currentMonthLabel.slice(1);

  const validData = (expenses ?? []).filter((item) => Number(item.value) > 0);
  const chartData: ChartEntry[] =
    validData.length > 0
      ? validData.map((d) => ({ ...d, chartValue: Number(d.value) }))
      : [GHOST_ENTRY];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="mb-3.5">
        <h3 className="text-foreground m-0 mb-1 font-semibold">Gastos</h3>
        <p className="text-muted-foreground text-sm m-0">
          Por categoria · {currentMonthLabelCapitalized}
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="w-36 h-36 rounded-full" />
          <div className="w-full flex flex-col gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={validData.length > 0 ? 2 : 0}
                dataKey="chartValue"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`c-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CategoryTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {validData.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-2">
              {validData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ color: cat.color }} className="flex shrink-0">
                      <DynamicIcon name={cat.icon} size={13} />
                    </span>
                    <span className="text-zinc-400 text-xs">{cat.name}</span>
                  </div>
                  <span className="text-foreground text-xs font-medium">
                    R$ {formatCurrency(Number(cat.value ?? 0))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpensesCategoryChart;
