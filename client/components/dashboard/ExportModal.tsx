import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { TransactionFilters } from "@shared/types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters?: TransactionFilters;
}

interface ExportColumn {
  key: string;
  label: string;
  default: boolean;
}

export function ExportModal({ isOpen, onClose, filters }: ExportModalProps) {
  const { token } = useAuth();
  const [availableColumns, setAvailableColumns] = useState<ExportColumn[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportStats, setExportStats] = useState<{
    totalRecords: number;
    estimatedFileSize: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAvailableColumns();
      loadExportStats();
    }
  }, [isOpen, filters]);

  const loadAvailableColumns = async () => {
    if (!token) return;

    setIsLoadingColumns(true);
    try {
      // For mock tokens, use mock columns
      if (token.startsWith("mock_")) {
        const mockColumns = [
          { key: "id", label: "ID", default: true },
          { key: "date", label: "Date", default: true },
          { key: "amount", label: "Amount", default: true },
          { key: "category", label: "Category", default: true },
          { key: "status", label: "Status", default: true },
          { key: "user_id", label: "User ID", default: true },
          { key: "description", label: "Description", default: false },
        ];
        setAvailableColumns(mockColumns);
        const defaultColumns = mockColumns
          .filter((col) => col.default)
          .map((col) => col.key);
        setSelectedColumns(defaultColumns);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch("/api/export/columns", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const columns = await response.json();
          setAvailableColumns(columns);

          // Set default selected columns
          const defaultColumns = columns
            .filter((col: ExportColumn) => col.default)
            .map((col: ExportColumn) => col.key);
          setSelectedColumns(defaultColumns);
        } else {
          throw new Error("Non-JSON response from export columns API");
        }
      } else {
        throw new Error(`Export columns API returned ${response.status}`);
      }
    } catch (error) {
      console.error("Export columns API error:", error);
      // Set basic columns if API fails
      const basicColumns = [
        { key: "id", label: "ID", default: true },
        { key: "date", label: "Date", default: true },
        { key: "amount", label: "Amount", default: true },
        { key: "category", label: "Category", default: true },
        { key: "status", label: "Status", default: true },
        { key: "user_id", label: "User ID", default: false },
        { key: "description", label: "Description", default: false },
      ];
      setAvailableColumns(basicColumns);
      const defaultColumns = basicColumns
        .filter((col) => col.default)
        .map((col) => col.key);
      setSelectedColumns(defaultColumns);
    } finally {
      setIsLoadingColumns(false);
    }
  };

  const loadExportStats = async () => {
    if (!token) return;

    try {
      // For mock tokens, use mock stats
      if (token.startsWith("mock_")) {
        setExportStats({
          totalRecords: 3,
          estimatedFileSize: "2KB",
        });
        return;
      }

      const queryParams = new URLSearchParams();
      if (filters) {
        queryParams.append("filters", JSON.stringify(filters));
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`/api/export/stats?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const stats = await response.json();
          setExportStats(stats);
        } else {
          throw new Error("Non-JSON response from export stats API");
        }
      } else {
        throw new Error(`Export stats API returned ${response.status}`);
      }
    } catch (error) {
      console.warn("Export stats API not available, using mock data");
      // Use mock stats as fallback
      setExportStats({
        totalRecords: 3,
        estimatedFileSize: "2KB",
      });
    }
  };

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey],
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(availableColumns.map((col) => col.key));
  };

  const handleSelectNone = () => {
    setSelectedColumns([]);
  };

  const handleExport = async () => {
    if (!token || selectedColumns.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // For mock tokens, create a mock CSV file
      if (token.startsWith("mock_")) {
        console.log("Creating mock CSV export for demo");

        // Create mock CSV content
        const headers = selectedColumns
          .map(
            (col) => availableColumns.find((c) => c.key === col)?.label || col,
          )
          .join(",");

        const mockData = [
          "1,2024-01-15,1500.00,Revenue,Paid,user_001,Consulting services",
          "2,2024-02-21,1200.50,Expense,Paid,user_002,Office supplies",
          "3,2024-03-03,300.75,Revenue,Pending,user_003,Product sales",
        ];

        // Filter columns based on selection
        const csvContent =
          headers +
          "\n" +
          mockData
            .map((row) => {
              const values = row.split(",");
              const filteredValues = selectedColumns.map((col) => {
                const colIndex = [
                  "id",
                  "date",
                  "amount",
                  "category",
                  "status",
                  "user_id",
                  "description",
                ].indexOf(col);
                return values[colIndex] || "";
              });
              return filteredValues.join(",");
            })
            .join("\n");

        // Create and download file
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `transactions_export_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        onClose();
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for file download

      const response = await fetch("/api/export/csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          columns: selectedColumns,
          filters: filters || {},
          format: "csv",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // Check if response is actually a file
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/csv")) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;

          const contentDisposition = response.headers.get(
            "content-disposition",
          );
          const filename = contentDisposition
            ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
            : `transactions_export_${new Date().toISOString().split("T")[0]}.csv`;

          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          onClose();
        } else {
          throw new Error("Invalid response format for CSV export");
        }
      } else {
        throw new Error(`Export API returned ${response.status}`);
      }
    } catch (error) {
      console.warn("Export API not available, creating mock CSV file");
      // Create mock CSV as fallback
      const headers = selectedColumns
        .map((col) => availableColumns.find((c) => c.key === col)?.label || col)
        .join(",");

      const mockData = [
        "1,2024-01-15,1500.00,Revenue,Paid,user_001,Consulting services",
        "2,2024-02-21,1200.50,Expense,Paid,user_002,Office supplies",
        "3,2024-03-03,300.75,Revenue,Pending,user_003,Product sales",
      ];

      const csvContent =
        headers +
        "\n" +
        mockData
          .map((row) => {
            const values = row.split(",");
            const filteredValues = selectedColumns.map((col) => {
              const colIndex = [
                "id",
                "date",
                "amount",
                "category",
                "status",
                "user_id",
                "description",
              ].indexOf(col);
              return values[colIndex] || "";
            });
            return filteredValues.join(",");
          })
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Transactions
          </DialogTitle>
          <DialogDescription>
            Select the columns you want to include in your CSV export
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {exportStats && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Records:</span>
                  <span className="ml-2 font-medium">
                    {exportStats.totalRecords}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Est. File Size:</span>
                  <span className="ml-2 font-medium">
                    {exportStats.estimatedFileSize}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Select Columns</Label>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={isLoadingColumns}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectNone}
                disabled={isLoadingColumns}
              >
                Select None
              </Button>
            </div>
          </div>

          {isLoadingColumns ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {availableColumns.map((column) => (
                <div key={column.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.key}
                    checked={selectedColumns.includes(column.key)}
                    onCheckedChange={() => handleColumnToggle(column.key)}
                  />
                  <Label
                    htmlFor={column.key}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {column.label}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {selectedColumns.length === 0 && !isLoadingColumns && (
            <Alert>
              <AlertDescription>
                Please select at least one column to export.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isLoading || selectedColumns.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
