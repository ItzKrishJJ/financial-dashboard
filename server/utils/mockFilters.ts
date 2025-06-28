import { Transaction, TransactionQuery } from "@shared/types";

export const filterMockTransactions = (
  transactions: Transaction[],
  query: TransactionQuery,
): { filtered: Transaction[]; total: number } => {
  let filtered = [...transactions];

  // Date range filter
  if (query.dateFrom) {
    filtered = filtered.filter(
      (t) => new Date(t.date) >= new Date(query.dateFrom!),
    );
  }
  if (query.dateTo) {
    filtered = filtered.filter(
      (t) => new Date(t.date) <= new Date(query.dateTo!),
    );
  }

  // Amount range filter
  if (query.amountFrom !== undefined) {
    filtered = filtered.filter((t) => t.amount >= query.amountFrom!);
  }
  if (query.amountTo !== undefined) {
    filtered = filtered.filter((t) => t.amount <= query.amountTo!);
  }

  // Category filter
  if (query.category) {
    filtered = filtered.filter((t) => t.category === query.category);
  }

  // Status filter
  if (query.status) {
    filtered = filtered.filter((t) => t.status === query.status);
  }

  // User ID filter
  if (query.user_id) {
    filtered = filtered.filter((t) => t.user_id === query.user_id);
  }

  // Search filter
  if (query.search) {
    const searchLower = query.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.user_id.toLowerCase().includes(searchLower) ||
        (t.description && t.description.toLowerCase().includes(searchLower)) ||
        t.category.toLowerCase().includes(searchLower) ||
        t.status.toLowerCase().includes(searchLower),
    );
  }

  const total = filtered.length;

  // Sorting
  const sortBy = query.sortBy || "date";
  const sortOrder = query.sortOrder || "desc";

  filtered.sort((a, b) => {
    let aVal = a[sortBy as keyof Transaction];
    let bVal = b[sortBy as keyof Transaction];

    // Handle date sorting
    if (sortBy === "date") {
      aVal = new Date(aVal as string).getTime();
      bVal = new Date(bVal as string).getTime();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  filtered = filtered.slice(skip, skip + limit);

  return { filtered, total };
};
