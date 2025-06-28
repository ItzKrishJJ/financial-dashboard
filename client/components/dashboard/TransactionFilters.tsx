import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import { TransactionFilters as FilterType } from "@shared/types";

interface TransactionFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onClearFilters: () => void;
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (
    key: keyof FilterType,
    value: string | number | undefined,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value === "" ? undefined : value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "",
  );

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== "",
  ).length;

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {/* Date Range */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Date Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="dateFrom" className="text-xs">
                From
              </Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo" className="text-xs">
                To
              </Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Amount Range */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Amount Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="amountFrom" className="text-xs">
                Min Amount
              </Label>
              <Input
                id="amountFrom"
                type="number"
                placeholder="0.00"
                value={filters.amountFrom || ""}
                onChange={(e) =>
                  updateFilter(
                    "amountFrom",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="amountTo" className="text-xs">
                Max Amount
              </Label>
              <Input
                id="amountTo"
                type="number"
                placeholder="10000.00"
                value={filters.amountTo || ""}
                onChange={(e) =>
                  updateFilter(
                    "amountTo",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Category and Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Category & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Category</Label>
              <Select
                value={filters.category || "all"}
                onValueChange={(value) =>
                  updateFilter("category", value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="Revenue">Revenue</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  updateFilter("status", value === "all" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* User ID */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">User</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Filter by user ID"
              value={filters.user_id || ""}
              onChange={(e) => updateFilter("user_id", e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Transaction Filters</SheetTitle>
          <SheetDescription>
            Apply filters to refine your transaction view
          </SheetDescription>
        </SheetHeader>
        <FilterContent />
      </SheetContent>
    </Sheet>
  );
}
