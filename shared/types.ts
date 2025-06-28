export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  profilePhoto?: string;
  createdAt: Date;
}

export interface Transaction {
  _id: string;
  id: number;
  date: string;
  amount: number;
  category: "Revenue" | "Expense";
  status: "Paid" | "Pending";
  user_id: string;
  user_profile: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  amountFrom?: number;
  amountTo?: number;
  category?: string;
  status?: string;
  user_id?: string;
  search?: string;
}

export interface TransactionQuery extends TransactionFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ExportConfig {
  columns: string[];
  format: "csv";
  filters?: TransactionFilters;
}

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  revenueGrowth: number;
  expenseGrowth: number;
}
