import * as React from "react";
import { cn } from "./utils";
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal
} from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Skeleton } from "./skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

/* ==========================================================================
   Types
   ========================================================================== */

export type SortDirection = "asc" | "desc" | null;

export interface Column<T> {
  id: string;
  header: string | React.ReactNode;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: "left" | "center" | "right";
  className?: string;
  cell?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  loadingRows?: number;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  // Sorting
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (column: string, direction: SortDirection) => void;
  // Selection
  selectable?: boolean;
  selectedRows?: Set<number>;
  onSelectionChange?: (selected: Set<number>) => void;
  // Pagination
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  // Search
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  // Actions
  actions?: React.ReactNode;
  rowActions?: (row: T, index: number) => React.ReactNode;
  // Styling
  className?: string;
  compact?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string | number;
}

/* ==========================================================================
   Data Table Component
   ========================================================================== */

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  loading = false,
  loadingRows = 5,
  emptyMessage = "Nenhum dado encontrado",
  emptyIcon,
  sortColumn,
  sortDirection,
  onSort,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  pagination = false,
  pageSize = 10,
  currentPage = 1,
  totalItems,
  onPageChange,
  searchable = false,
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange,
  actions,
  rowActions,
  className,
  compact = false,
  striped = false,
  hoverable = true,
  stickyHeader = false,
  maxHeight,
}: DataTableProps<T>) {
  // Local state for uncontrolled mode
  const [localSearch, setLocalSearch] = React.useState(searchValue);
  const [localPage, setLocalPage] = React.useState(currentPage);
  const [localSort, setLocalSort] = React.useState<{
    column: string | null;
    direction: SortDirection;
  }>({ column: sortColumn ?? null, direction: sortDirection ?? null });

  // Use controlled or uncontrolled values
  const search = onSearchChange ? searchValue : localSearch;
  const page = onPageChange ? currentPage : localPage;
  const sort = onSort ? { column: sortColumn, direction: sortDirection } : localSort;

  // Handlers
  const handleSearch = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setLocalSearch(value);
    }
  };

  const handleSort = (columnId: string) => {
    const column = columns.find((c) => c.id === columnId);
    if (!column?.sortable) return;

    let newDirection: SortDirection = "asc";
    if (sort.column === columnId) {
      if (sort.direction === "asc") newDirection = "desc";
      else if (sort.direction === "desc") newDirection = null;
    }

    if (onSort) {
      onSort(columnId, newDirection);
    } else {
      setLocalSort({ column: newDirection ? columnId : null, direction: newDirection });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setLocalPage(newPage);
    }
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedRows.size === data.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map((_, i) => i)));
    }
  };

  const handleSelectRow = (index: number) => {
    if (!onSelectionChange) return;
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    onSelectionChange(newSelected);
  };

  // Calculate pagination
  const total = totalItems ?? data.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  // Filter and sort data (for uncontrolled mode)
  let displayData = data;
  if (!onSearchChange && localSearch) {
    displayData = data.filter((row) =>
      Object.values(row as object).some((value) =>
        String(value).toLowerCase().includes(localSearch.toLowerCase())
      )
    );
  }
  if (!onSort && localSort.column && localSort.direction) {
    const column = columns.find((c) => c.id === localSort.column);
    if (column?.accessorKey) {
      const key = column.accessorKey;
      displayData = [...displayData].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const comparison = String(aVal).localeCompare(String(bVal));
        return localSort.direction === "desc" ? -comparison : comparison;
      });
    }
  }
  if (!onPageChange && pagination) {
    displayData = displayData.slice(startIndex, endIndex);
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      {(searchable || actions) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          {searchable && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          )}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Selection info */}
      {selectable && selectedRows.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 bg-[var(--brand-primary)]/10 dark:bg-[var(--brand-primary)]/20 rounded-lg">
          <span className="text-sm text-[var(--brand-primary)] font-medium">
            {selectedRows.size} {selectedRows.size === 1 ? "item selecionado" : "itens selecionados"}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectionChange?.(new Set())}
            className="text-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
          >
            Limpar seleção
          </Button>
        </div>
      )}

      {/* Table */}
      <div
        className={cn(
          "rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
          maxHeight && "overflow-auto"
        )}
        style={{ maxHeight }}
      >
        <Table>
          <TableHeader className={cn(stickyHeader && "sticky top-0 z-10")}>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedRows.size === data.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                  />
                </TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    column.sortable && "cursor-pointer select-none",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div
                    className={cn(
                      "flex items-center gap-1.5",
                      column.align === "center" && "justify-center",
                      column.align === "right" && "justify-end"
                    )}
                  >
                    {column.header}
                    {column.sortable && (
                      <span className="text-gray-400">
                        {sort.column === column.id ? (
                          sort.direction === "asc" ? (
                            <ChevronUp className="size-4" />
                          ) : sort.direction === "desc" ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronsUpDown className="size-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="size-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
              {rowActions && <TableHead className="w-12" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from({ length: loadingRows }).map((_, i) => (
                <TableRow key={i}>
                  {selectable && (
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-full max-w-[200px]" />
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : displayData.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                    {emptyIcon}
                    <p>{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              displayData.map((row, index) => (
                <TableRow
                  key={row.id ?? index}
                  className={cn(
                    striped && index % 2 === 1 && "bg-gray-50/50 dark:bg-gray-800/50",
                    hoverable && "hover:bg-gray-50 dark:hover:bg-gray-800/70",
                    selectable && selectedRows.has(index) && "bg-[var(--brand-primary)]/5 dark:bg-[var(--brand-primary)]/10"
                  )}
                >
                  {selectable && (
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={() => handleSelectRow(index)}
                        className="rounded border-gray-300 dark:border-gray-600 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        compact && "py-2",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right",
                        column.className
                      )}
                    >
                      {column.cell
                        ? column.cell(row, index)
                        : column.accessorFn
                        ? column.accessorFn(row)
                        : column.accessorKey
                        ? String(row[column.accessorKey] ?? "")
                        : null}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {rowActions(row, index)}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && !loading && displayData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {startIndex + 1} a {Math.min(endIndex, total)} de {total} resultados
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className="size-8"
              >
                <ChevronsLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="size-8"
              >
                <ChevronLeft className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(pageNum)}
                    className="size-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="size-8"
              >
                <ChevronRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                className="size-8"
              >
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   Helper Components for Row Actions
   ========================================================================== */

export { DropdownMenuItem, DropdownMenuSeparator };
