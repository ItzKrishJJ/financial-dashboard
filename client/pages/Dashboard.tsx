import * as React from "react";

const { useState, useEffect } = React;
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AdvancedTransactionsTable } from "@/components/dashboard/AdvancedTransactionsTable";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardStats } from "@shared/types";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!token) return;

      try {
        // No mock data - use database only

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch("/api/transactions/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            setStats(data);
          } else {
            throw new Error("Non-JSON response from stats API");
          }
        } else {
          throw new Error(`Stats API returned ${response.status}`);
        }
      } catch (error) {
        console.error("Failed to load stats:", error);
        // Don't use fallback data - let the UI show empty/zero state
        setStats({
          totalRevenue: 0,
          totalExpenses: 0,
          netIncome: 0,
          transactionCount: 0,
          revenueGrowth: 0,
          expenseGrowth: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? "+" : "";
    return `${sign}${growth.toFixed(1)}%`;
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={stats ? formatCurrency(stats.totalRevenue) : "Loading..."}
            subtitle={
              stats
                ? `${formatGrowth(stats.revenueGrowth)} from last month`
                : undefined
            }
          />
          <StatCard
            title="Total Expenses"
            value={stats ? formatCurrency(stats.totalExpenses) : "Loading..."}
            subtitle={
              stats
                ? `${formatGrowth(stats.expenseGrowth)} from last month`
                : undefined
            }
          />
          <StatCard
            title="Net Income"
            value={stats ? formatCurrency(stats.netIncome) : "Loading..."}
            subtitle={
              stats && stats.netIncome >= 0 ? "Profitable" : "Operating at loss"
            }
            highlighted={stats ? stats.netIncome >= 0 : false}
          />
          <StatCard
            title="Transactions"
            value={stats ? stats.transactionCount.toString() : "Loading..."}
            subtitle="This month"
            highlighted
          />
        </div>

        {/* Chart and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OverviewChart />
          </div>
          <div>
            <RecentTransactions />
          </div>
        </div>

        {/* Advanced Transactions Table */}
        <AdvancedTransactionsTable />
      </div>
    </DashboardLayout>
  );
}
