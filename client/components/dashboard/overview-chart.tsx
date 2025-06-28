import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const { useState, useEffect } = React;

export function OverviewChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(
          `/api/transactions/chart-data?period=${period === "monthly" ? 12 : 60}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const chartData = await response.json();

          // Transform backend format to frontend format
          const transformed = chartData.map((item: any) => ({
            name: period === "monthly"
              ? item.month.slice(5) + " " + item.month.slice(0, 4) // "06 2025"
              : item.month.slice(0, 4), // Just year for yearly
            income: item.revenue || 0,
            expenses: item.expenses || 0,
          }));

          setData(transformed);
        } else {
          console.warn("Chart API returned error");
        }
      } catch (err: any) {
        console.warn("Chart API fetch failed:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, [period]);

  const totalIncome = data.reduce((sum, d) => sum + d.income, 0);

  return (
    <div className="rounded-lg bg-card p-6 border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Overview</h3>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--success))]" />
            <span className="text-sm text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--warning))]" />
            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>
          <select
            className="text-sm bg-background border border-border rounded px-2 py-1"
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value === "yearly" ? "yearly" : "monthly")
            }
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading chart...</p>
      ) : data.length === 0 ? (
        <p className="text-muted-foreground">No chart data available.</p>
      ) : (
        <div className="relative">
          <div className="absolute top-4 left-4 bg-[hsl(var(--success))] text-background px-3 py-1 rounded text-sm font-medium shadow">
            Income
            <div className="text-lg font-bold">
              ₹{totalIncome.toLocaleString("en-IN")}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) =>
                  `₹${value.toLocaleString("en-IN")}`
                }
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="hsl(var(--success))"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "hsl(var(--success))" }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="hsl(var(--warning))"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "hsl(var(--warning))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
