import * as React from "react";

const { useEffect, useState } = React;

const defaultTransactions = [
  {
    id: 1,
    user: "Matheus Ferrero",
    time: "10 hours ago",
    amount: "+$54.00",
    type: "income",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    user: "Floyd Miles",
    time: "Transfer to",
    amount: "-$39.65",
    type: "expense",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    user: "Jerome Bell",
    time: "Transfer to",
    amount: "-$29.78",
    type: "expense",
    avatar: "/placeholder.svg",
  },
];

export function RecentTransactions() {
  const [transactions, setTransactions] = useState(defaultTransactions);

  useEffect(() => {
    // Try to load recent transactions from API
    const loadRecentTransactions = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token || token.startsWith("mock_")) {
          // Skip API call for mock tokens
          console.log("Using default transaction data for demo");
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(
          "/api/transactions?limit=3&sortBy=date&sortOrder=desc",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            const recentTx = data.data.slice(0, 3).map((tx: any) => ({
              id: tx.id,
              user: tx.user_id,
              time: new Date(tx.date).toLocaleDateString(),
              amount:
                tx.category === "Revenue"
                  ? `+$${tx.amount.toFixed(2)}`
                  : `-$${tx.amount.toFixed(2)}`,
              type: tx.category === "Revenue" ? "income" : "expense",
              avatar: "/placeholder.svg",
            }));
            setTransactions(recentTx);
          }
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.warn("Transactions API timeout, using default data");
        } else {
          console.warn(
            "Recent transactions API not available, using default data",
          );
        }
      }
    };

    loadRecentTransactions();
  }, []);
  return (
    <div className="rounded-lg bg-card p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">
          Recent Transaction
        </h3>
        <button className="text-sm text-primary hover:underline">
          See all
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-primary"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  {transaction.user}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.time}
                </p>
              </div>
            </div>
            <div
              className={`text-sm font-medium ${
                transaction.type === "income"
                  ? "text-[hsl(var(--success))]"
                  : "text-card-foreground"
              }`}
            >
              {transaction.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
