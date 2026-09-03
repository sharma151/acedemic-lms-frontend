"use client";

import React, { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ColumnDef<T> {
  header: ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;

  // Pagination
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

function getPageItems(
  currentPage: number,
  totalPages: number
): (number | "ellipsis-left" | "ellipsis-right")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | "ellipsis-left" | "ellipsis-right")[] = [1];

  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  if (windowStart > 2) items.push("ellipsis-left");
  for (let p = windowStart; p <= windowEnd; p++) items.push(p);
  if (windowEnd < totalPages - 1) items.push("ellipsis-right");

  items.push(totalPages);

  return items;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage = "No results found.",
  onRowClick,
  className,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="rounded-md border bg-white dark:bg-slate-950">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
            <TableRow>
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className={cn("whitespace-nowrap font-medium text-slate-700 dark:text-slate-300", col.headerClassName)}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center text-slate-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900")}
                >
                  {columns.map((col, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={cn("py-3", col.className)}
                    >
                      {col.cell
                        ? col.cell(row, rowIndex)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? "")
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="whitespace-nowrap">Items per page</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => onPageSizeChange?.(Number(val))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {totalItems !== undefined && (
              <span className="hidden sm:inline-block ml-4">
                Total: {totalItems.toLocaleString()}
              </span>
            )}
          </div>

          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) onPageChange?.(currentPage - 1);
                  }}
                  className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>

              {getPageItems(currentPage, totalPages).map((page, index) => {
                if (page === "ellipsis-left" || page === "ellipsis-right") {
                  return (
                    <PaginationItem key={`${page}-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                const isActive = page === currentPage;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={isActive}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isActive) onPageChange?.(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) onPageChange?.(currentPage + 1);
                  }}
                  className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
