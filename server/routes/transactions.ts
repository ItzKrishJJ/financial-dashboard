import { Router, Response } from "express";
import { Transaction } from "../models/Transaction";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import {
  TransactionQuery,
  PaginatedResponse,
  DashboardStats,
} from "@shared/types";
import { Transaction as TransactionType } from "@shared/types";

const router = Router();

// Get transactions with filtering, sorting, and pagination
router.get(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const query: TransactionQuery = req.query as any;

      if (!req.app.locals.isMongoConnected) {
        const response: PaginatedResponse<TransactionType> = {
          data: [],
          total: 0,
          page: Math.max(1, Number(query.page) || 1),
          limit: Math.min(100, Math.max(1, Number(query.limit) || 10)),
          totalPages: 0,
        };
        res.json(response);
        return;
      }

      const {
        page = 1,
        limit = 10,
        sortBy = "date",
        sortOrder = "desc",
        dateFrom,
        dateTo,
        amountFrom,
        amountTo,
        category,
        status,
        user_id,
        search,
      } = query;

      const filters: any = {};

      if (dateFrom || dateTo) {
        filters.date = {};
        if (dateFrom) filters.date.$gte = new Date(dateFrom);
        if (dateTo) filters.date.$lte = new Date(dateTo);
      }

      if (amountFrom !== undefined || amountTo !== undefined) {
        filters.amount = {};
        if (amountFrom !== undefined) filters.amount.$gte = Number(amountFrom);
        if (amountTo !== undefined) filters.amount.$lte = Number(amountTo);
      }

      if (category) filters.category = category;
      if (status) filters.status = status;
      if (user_id) filters.user_id = user_id;

      if (search) {
        filters.$or = [
          { user_id: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
        ];
      }

      const sortObj: any = {};
      sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.min(100, Math.max(1, Number(limit)));
      const skip = (pageNum - 1) * limitNum;

      const [transactions, total] = await Promise.all([
        Transaction.find(filters)
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Transaction.countDocuments(filters),
      ]);

      const response: PaginatedResponse<TransactionType> = {
        data: transactions.map((t) => ({
          ...t,
          _id: t._id.toString(),
          date: new Date(t.date).toISOString(),
        })) as TransactionType[],
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      };

      res.json(response);
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get dashboard statistics
router.get(
  "/stats",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.app.locals.isMongoConnected) {
        const stats: DashboardStats = {
          totalRevenue: 0,
          totalExpenses: 0,
          netIncome: 0,
          transactionCount: 0,
          revenueGrowth: 0,
          expenseGrowth: 0,
        };
        res.json(stats);
        return;
      }

      const now = new Date();
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const [currentRevenue, currentExpenses, currentCount] = await Promise.all([
        Transaction.aggregate([
          { $match: { category: "Revenue", status: "Paid", date: { $gte: currentMonth } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Transaction.aggregate([
          { $match: { category: "Expense", status: "Paid", date: { $gte: currentMonth } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Transaction.countDocuments({ date: { $gte: currentMonth } }),
      ]);

      const [lastRevenue, lastExpenses] = await Promise.all([
        Transaction.aggregate([
          { $match: { category: "Revenue", status: "Paid", date: { $gte: lastMonth, $lte: lastMonthEnd } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Transaction.aggregate([
          { $match: { category: "Expense", status: "Paid", date: { $gte: lastMonth, $lte: lastMonthEnd } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]);

      const totalRevenue = currentRevenue[0]?.total || 0;
      const totalExpenses = currentExpenses[0]?.total || 0;
      const lastRevenueTotal = lastRevenue[0]?.total || 0;
      const lastExpensesTotal = lastExpenses[0]?.total || 0;

      const stats: DashboardStats = {
        totalRevenue,
        totalExpenses,
        netIncome: totalRevenue - totalExpenses,
        transactionCount: currentCount,
        revenueGrowth:
          lastRevenueTotal > 0
            ? ((totalRevenue - lastRevenueTotal) / lastRevenueTotal) * 100
            : 0,
        expenseGrowth:
          lastExpensesTotal > 0
            ? ((totalExpenses - lastExpensesTotal) / lastExpensesTotal) * 100
            : 0,
      };

      res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get chart data for dashboard
router.get(
  "/chart-data",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.app.locals.isMongoConnected) {
        res.json([]);
        return;
      }

      const { period = "12" } = req.query;
      const months = Math.min(24, Math.max(1, Number(period)));

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      startDate.setDate(1);

      const chartData = await Transaction.aggregate([
        { $match: { date: { $gte: startDate }, status: "Paid" } },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              category: "$category",
            },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      const monthlyMap: { [month: string]: { revenue: number; expenses: number } } = {};

      chartData.forEach((item) => {
        const key = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
        if (!monthlyMap[key]) {
          monthlyMap[key] = { revenue: 0, expenses: 0 };
        }
        if (item._id.category === "Revenue") {
          monthlyMap[key].revenue += item.total;
        } else if (item._id.category === "Expense") {
          monthlyMap[key].expenses += item.total;
        }
      });

      const result = Object.entries(monthlyMap).map(([month, values]) => ({
        month,
        revenue: values.revenue,
        expenses: values.expenses,
      }));

      res.json(result);
    } catch (error) {
      console.error("Get chart data error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Create new transaction
router.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const transactionData = req.body;
      const lastTransaction = await Transaction.findOne().sort({ id: -1 });
      const nextId = (lastTransaction?.id || 0) + 1;

      const transaction = new Transaction({
        ...transactionData,
        id: nextId,
        date: new Date(transactionData.date),
      });

      await transaction.save();

      res.status(201).json({
        ...transaction.toObject(),
        _id: transaction._id.toString(),
        date: transaction.date.toISOString(),
      });
    } catch (error) {
      console.error("Create transaction error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
