import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { TransactionFilters } from "./TransactionFilters";
import { ExportModal } from "./ExportModal";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Transaction,
  TransactionQuery,
  PaginatedResponse,
  TransactionFilters as FilterType,
} from "@shared/types";

export function AdvancedTransactionsTable() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterType>({});
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const loadTransactions = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      // No mock data - use database only

      const query: TransactionQuery = {
        page,
        limit,
        sortBy,
        sortOrder,
        search: search || undefined,
        ...filters,
      };

      const queryParams = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, value.toString());
        }
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`/api/transactions?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data: PaginatedResponse<Transaction> = await response.json();
          setTransactions(data.data);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        } else {
          throw new Error("Non-JSON response from transactions API");
        }
      } else {
        throw new Error(`Transactions API returned ${response.status}`);
      }
    } catch (error) {
      console.error("Transactions API error:", error);

      // Handle specific error cases
      if (error instanceof Response && error.status === 503) {
        setError(
          "Database connection required. Please contact administrator to set up MongoDB connection.",
        );
      } else if (
        error instanceof Error &&
        error.message.includes("Failed to fetch")
      ) {
        setError(
          "Unable to connect to server. Please check your internet connection.",
        );
      } else {
        setError("Failed to load transactions. Please try again later.");
      }

      setTransactions([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [token, page, limit, sortBy, sortOrder, search, filters]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearch("");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const formatAmount = (amount: number, category: string) => {
    const formatted = `$${amount.toFixed(2)}`;
    if (category === "Revenue") {
      return `+${formatted}`;
    } else {
      return `-${formatted}`;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === "Paid" ? "default" : "secondary";
    const className =
      status === "Paid"
        ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/20"
        : "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] hover:bg-[hsl(var(--warning))]/20";

    return (
      <Badge variant={variant} className={className}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transactions</CardTitle>
          <Button
            variant="outline"
            onClick={() => setIsExportModalOpen(true)}
            className="ml-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          <TransactionFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              setLimit(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="text-center py-8 text-destructive">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading transactions...</div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center gap-2">
                        ID {getSortIcon("id")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-2">
                        Date {getSortIcon("date")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("user_id")}
                    >
                      <div className="flex items-center gap-2">
                        User {getSortIcon("user_id")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center gap-2">
                        Category {getSortIcon("category")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center gap-2">
                        Amount {getSortIcon("amount")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        Status {getSortIcon("status")}
                      </div>
                    </TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell className="font-medium">
                          #{transaction.id}
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            </div>
                            {transaction.user_id}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.category === "Revenue"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {transaction.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              transaction.category === "Revenue"
                                ? "text-[hsl(var(--success))] font-medium"
                                : "text-muted-foreground font-medium"
                            }
                          >
                            {formatAmount(
                              transaction.amount,
                              transaction.category,
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {transaction.description || "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, total)} of {total} transactions
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (pageNum) =>
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          Math.abs(pageNum - page) <= 1,
                      )
                      .map((pageNum, index, array) => (
                        <React.Fragment key={pageNum}>
                          {index > 0 && array[index - 1] !== pageNum - 1 && (
                            <span className="px-2 text-muted-foreground">
                              ...
                            </span>
                          )}
                          <Button
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        filters={{
          ...filters,
          search: search || undefined,
        }}
      />
    </Card>
  );
}
