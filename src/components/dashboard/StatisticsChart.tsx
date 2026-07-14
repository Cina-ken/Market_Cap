"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function StatisticsChart({
  data,
}: {
  data: { date: string; value: number }[];
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-panel p-5 xl:h-full">
      <h3 className="text-sm font-semibold text-ink">Statistics</h3>
      <div className="mt-2 h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="statFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e0384d" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#e0384d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={(d) =>
                new Date(d).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })
              }
              tickLine={false}
              axisLine={false}
              minTickGap={32}
              tick={{ fill: "#8b8b9a", fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(v) => `${v / 1000}k`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#8b8b9a", fontSize: 12 }}
            />
            <Tooltip
              formatter={(v) => [`$${Number(v).toFixed(2)}`, "Value"]}
              labelFormatter={(d) =>
                new Date(d).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                })
              }
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #ececf2",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#e0384d"
              strokeWidth={2}
              fill="url(#statFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
