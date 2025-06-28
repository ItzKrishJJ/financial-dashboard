import { Router, Response } from "express";
import { Transaction } from "../models/Transaction";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { ExportConfig, TransactionFilters } from "@shared/types";
import { createObjectCsvStringifier } from "csv-writer";
import path from "path";
import fs from "fs";

const router = Router();

// Available columns for export
const AVAILABLE_COLUMNS = {
  id: { id: "id", title: "ID" },
  date: { id: "date", title: "Date" },
  amount: { id: "amount", title: "Amount" },
  category: { id: "category", title: "Category" },
  status: { id: "status", title: "Status" },
  user_id: { id: "user_id", title: "User ID" },
  user_profile: { id: "user_profile", title: "User Profile" },
  description: { id: "description", title: "Description" },
  createdAt: { id: "createdAt", title: "Created At" },
  updatedAt: { id: "updatedAt", title: "Updated At" },
};

// Get available export columns
router.get(
  "/columns",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const columns = Object.entries(AVAILABLE_COLUMNS).map(
        ([key, config]) => ({
          key,
          label: config.title,
          default: [
            "id",
            "date",
            "amount",
            "category",
            "status",
            "user_id",
          ].includes(key),
        }),
      );

      res.json(columns);
    } catch (error) {
      console.error("Get export columns error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Export transactions to CSV
router.post(
  "/csv",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { columns, filters }: ExportConfig = req.body;

      if (!columns || columns.length === 0) {
        res.status(400).json({ error: "At least one column must be selected" });
        return;
      }

      // Validate columns
      const invalidColumns = columns.filter(
        (col) => !AVAILABLE_COLUMNS[col as keyof typeof AVAILABLE_COLUMNS],
      );
      if (invalidColumns.length > 0) {
        res
          .status(400)
          .json({ error: `Invalid columns: ${invalidColumns.join(", ")}` });
        return;
      }

      // Build filter object (same as in transactions route)
      const filterObj: any = {};

      if (filters) {
        // Date range filter
        if (filters.dateFrom || filters.dateTo) {
          filterObj.date = {};
          if (filters.dateFrom)
            filterObj.date.$gte = new Date(filters.dateFrom);
          if (filters.dateTo) filterObj.date.$lte = new Date(filters.dateTo);
        }

        // Amount range filter
        if (
          filters.amountFrom !== undefined ||
          filters.amountTo !== undefined
        ) {
          filterObj.amount = {};
          if (filters.amountFrom !== undefined)
            filterObj.amount.$gte = Number(filters.amountFrom);
          if (filters.amountTo !== undefined)
            filterObj.amount.$lte = Number(filters.amountTo);
        }

        // Other filters
        if (filters.category) filterObj.category = filters.category;
        if (filters.status) filterObj.status = filters.status;
        if (filters.user_id) filterObj.user_id = filters.user_id;

        // Search filter
        if (filters.search) {
          filterObj.$or = [
            { user_id: { $regex: filters.search, $options: "i" } },
            { description: { $regex: filters.search, $options: "i" } },
            { category: { $regex: filters.search, $options: "i" } },
            { status: { $regex: filters.search, $options: "i" } },
          ];
        }
      }

      // Fetch transactions
      const transactions = await Transaction.find(filterObj)
        .sort({ date: -1 })
        .lean();

      // Prepare CSV headers
      const csvHeaders = columns.map(
        (col) => AVAILABLE_COLUMNS[col as keyof typeof AVAILABLE_COLUMNS],
      );

      // Transform data for CSV
      const csvData = transactions.map((transaction) => {
        const row: any = {};
        columns.forEach((col) => {
          let value = transaction[col as keyof typeof transaction];

          // Format specific fields
          if (col === "date" || col === "createdAt" || col === "updatedAt") {
            value = value ? new Date(value).toISOString() : "";
          } else if (col === "amount") {
            value = Number(value).toFixed(2);
          }

          row[col] = value || "";
        });
        return row;
      });

      // Create CSV string
      const csvStringifier = createObjectCsvStringifier({
        header: csvHeaders,
      });

      const csvString =
        csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(csvData);

      // Set response headers for file download
      const filename = `transactions_export_${new Date().toISOString().split("T")[0]}.csv`;
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );
      res.setHeader("Content-Length", Buffer.byteLength(csvString));

      res.send(csvString);
    } catch (error) {
      console.error("CSV export error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Get export statistics
router.get(
  "/stats",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { filters }: { filters?: TransactionFilters } = req.query as any;

      // Build filter object
      const filterObj: any = {};

      if (filters) {
        // Apply same filters as export
        if (filters.dateFrom || filters.dateTo) {
          filterObj.date = {};
          if (filters.dateFrom)
            filterObj.date.$gte = new Date(filters.dateFrom);
          if (filters.dateTo) filterObj.date.$lte = new Date(filters.dateTo);
        }

        if (
          filters.amountFrom !== undefined ||
          filters.amountTo !== undefined
        ) {
          filterObj.amount = {};
          if (filters.amountFrom !== undefined)
            filterObj.amount.$gte = Number(filters.amountFrom);
          if (filters.amountTo !== undefined)
            filterObj.amount.$lte = Number(filters.amountTo);
        }

        if (filters.category) filterObj.category = filters.category;
        if (filters.status) filterObj.status = filters.status;
        if (filters.user_id) filterObj.user_id = filters.user_id;

        if (filters.search) {
          filterObj.$or = [
            { user_id: { $regex: filters.search, $options: "i" } },
            { description: { $regex: filters.search, $options: "i" } },
            { category: { $regex: filters.search, $options: "i" } },
            { status: { $regex: filters.search, $options: "i" } },
          ];
        }
      }

      const totalRecords = await Transaction.countDocuments(filterObj);

      res.json({
        totalRecords,
        estimatedFileSize: `${Math.round((totalRecords * 150) / 1024)}KB`, // Rough estimate
      });
    } catch (error) {
      console.error("Export stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
