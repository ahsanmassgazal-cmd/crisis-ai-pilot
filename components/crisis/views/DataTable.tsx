"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Ltr } from "@/components/common/Ltr";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  pageSize?: number;
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Filter records...",
  pageSize = 10,
  className = "",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [density, setDensity] = useState<"compact" | "comfortable">("comfortable");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full px-3 py-1.5 rounded-input border border-app-border bg-app-surface text-app-text outline-none focus:border-brand-600 transition-colors placeholder:text-app-muted"
          />
        </div>

        <div className="flex items-center gap-2 justify-end">
          {/* Density Toggle */}
          <button
            onClick={() => setDensity(density === "compact" ? "comfortable" : "compact")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-input border border-app-border bg-app-surface text-app-muted hover:text-app-text transition-colors"
            title="Toggle Row Density"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="capitalize">{density}</span>
          </button>
        </div>
      </div>

      {/* TanStack Table Container */}
      <div className="rounded-card border border-app-border bg-app-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="border-b border-app-border bg-app-surface-subtle/70 text-app-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className="py-3 px-3.5 text-start font-bold uppercase tracking-wider text-[10px]"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-center gap-1 hover:text-app-text"
                                : "flex items-center gap-1",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <ArrowUpDown className="w-3 h-3 text-app-muted/60" />
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-app-border">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-app-surface-subtle transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`px-3.5 text-app-text ${
                          density === "compact" ? "py-2 text-[11px]" : "py-3.5 text-xs"
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-app-muted"
                  >
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-app-border bg-app-surface-subtle/50 flex items-center justify-between text-xs text-app-muted">
          <div>
            Showing{" "}
            <strong>
              <Ltr>{table.getState().pagination.pageIndex * pageSize + 1}</Ltr>
            </strong>{" "}
            to{" "}
            <strong>
              <Ltr>
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </Ltr>
            </strong>{" "}
            of{" "}
            <strong>
              <Ltr>{table.getFilteredRowModel().rows.length}</Ltr>
            </strong>{" "}
            entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 rounded border border-app-border disabled:opacity-30 hover:bg-app-surface text-app-text"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 dir-aware-flip" />
            </button>
            <span className="text-[11px] font-mono">
              Page <Ltr>{table.getState().pagination.pageIndex + 1}</Ltr> of{" "}
              <Ltr>{table.getPageCount() || 1}</Ltr>
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 rounded border border-app-border disabled:opacity-30 hover:bg-app-surface text-app-text"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4 dir-aware-flip" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
