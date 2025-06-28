import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function Wallet() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Wallet">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Wallet
            </h2>
            <p className="text-muted-foreground">This page is coming soon.</p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
