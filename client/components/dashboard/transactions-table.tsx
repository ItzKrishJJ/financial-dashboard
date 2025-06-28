import React from "react";
import { Search, Calendar } from "lucide-react";

const transactions = [
  {
    id: 1,
    name: "Matheus Ferrero",
    date: "Sat 20 Apr 2020",
    amount: "+$80.09",
    status: "Completed",
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Floyd Miles",
    date: "Fri 19 Apr 2020",
    amount: "-$7.03",
    status: "Completed",
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Jerome Bell",
    date: "Tue 19 Apr 2020",
    amount: "-$30.09",
    status: "Pending",
    avatar: "/placeholder.svg",
  },
];

export function TransactionsTable() {
  return (
    <div className="rounded-lg bg-card border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-card-foreground">
            Transactions
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for anything..."
                className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>10 May - 20 May</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Date
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Amount
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-primary"></div>
                    </div>
                    <span className="text-sm font-medium text-card-foreground">
                      {transaction.name}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {transaction.date}
                </td>
                <td className="p-4">
                  <span
                    className={`text-sm font-medium ${
                      transaction.amount.startsWith("+")
                        ? "text-[hsl(var(--success))]"
                        : transaction.amount.startsWith("-") &&
                            transaction.status === "Completed"
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                          : "text-card-foreground"
                    }`}
                  >
                    {transaction.amount}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      transaction.status === "Completed"
                        ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]"
                        : "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
