"use client";

import CustomTooltip from "@/components/dashboard/custom-tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useNetWorthTrend } from "@/hooks/use-net-worth-trend";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const BalanceTrendChart = () => {
  const { trend, isLoading } = useNetWorthTrend();

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="mb-5">
        <h3 className="text-foreground m-0 mb-1 font-semibold">
          Tendência de Saldo
        </h3>
        <p className="text-muted-foreground text-sm m-0">
          Patrimônio líquido nos últimos 6 meses
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="w-full h-50" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={trend}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#52525b", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#7C3AED"
              strokeWidth={2.5}
              fill="url(#balGrad)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#7C3AED",
                stroke: "#18181b",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BalanceTrendChart;
