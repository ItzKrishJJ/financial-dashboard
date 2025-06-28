import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { AdvancedTransactionsTable } from "@/components/dashboard/AdvancedTransactionsTable";

export default function Transactions() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Transactions">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-foreground mb-2">
              All Transactions
            </h2>
            <p className="text-muted-foreground">
              View, filter, and export all your financial transactions.
            </p>
          </div>
          <AdvancedTransactionsTable />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
