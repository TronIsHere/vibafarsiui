"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { cn, en, fa } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Pagination } from "./pagination";
import { Skeleton } from "./skeleton";
import { EmptyState } from "./empty-state";
import { Input } from "./input";

export interface Column<T> {
  key: keyof T & string;
  header: React.ReactNode;
  sortable?: boolean;
  /** Right-aligned digits, tabular figures; sorts numerically. */
  numeric?: boolean;
  /** Custom cell renderer. */
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  loading?: boolean;
  pageSize?: number;
  /** Keys searched by the toolbar filter. Omit to hide the search box. */
  searchKeys?: (keyof T & string)[];
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  toolbar?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

type Sort<T> = { key: keyof T & string; dir: "asc" | "desc" } | null;

/**
 * جدول داده. Client-side sort, text filter (Persian and Latin digits match each other),
 * تومان-friendly numeric columns, loading skeleton, empty state and pagination.
 */
export function DataTable<T extends Record<string, unknown>>({ rows, columns, rowKey, loading, pageSize = 8, searchKeys, searchPlaceholder = "جست‌وجو…", emptyTitle = "چیزی پیدا نشد", emptyDescription = "فیلتر را عوض کنید یا مورد جدیدی اضافه کنید.", toolbar, onRowClick, className }: DataTableProps<T>) {
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<Sort<T>>(null);
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    const needle = en(q.trim()).toLowerCase();
    if (!needle || !searchKeys) return rows;
    return rows.filter((r) => searchKeys.some((k) => en(String(r[k] ?? "")).toLowerCase().includes(needle)));
  }, [rows, q, searchKeys]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      if (col?.numeric || (typeof av === "number" && typeof bv === "number")) return (Number(av) - Number(bv)) * dir;
      if (av instanceof Date && bv instanceof Date) return (av.getTime() - bv.getTime()) * dir;
      return String(av ?? "").localeCompare(String(bv ?? ""), "fa") * dir;
    });
  }, [filtered, sort, columns]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pages);
  const view = sorted.slice((current - 1) * pageSize, current * pageSize);

  function toggleSort(key: keyof T & string) {
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));
  }

  return (
    <div className={cn("space-y-3", className)}>
      {(searchKeys || toolbar) && (
        <div className="flex flex-wrap items-center gap-2">
          {searchKeys && (
            <div className="w-full max-w-xs">
              <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder={searchPlaceholder} startAddon={<Search className="size-4" />} className="h-9" />
            </div>
          )}
          {toolbar}
          <span className="ms-auto text-xs text-muted-foreground">{fa(sorted.length)} مورد</span>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className={cn(c.numeric && "text-start", c.className)} aria-sort={sort?.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}>
                {c.sortable ? (
                  <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex cursor-pointer items-center gap-1 hover:text-foreground">
                    {c.header}
                    {sort?.key === c.key ? (sort.dir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />) : <ArrowUpDown className="size-3 opacity-50" />}
                  </button>
                ) : c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading &&
            Array.from({ length: Math.min(pageSize, 5) }, (_, i) => (
              <TableRow key={`s${i}`}>
                {columns.map((c) => <TableCell key={c.key}><Skeleton className="h-3 w-3/4" /></TableCell>)}
              </TableRow>
            ))}
          {!loading && view.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="p-0">
                <EmptyState title={emptyTitle} description={emptyDescription} className="rounded-none border-0" />
              </TableCell>
            </TableRow>
          )}
          {!loading && view.map((row) => (
            <TableRow key={rowKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined} className={cn(onRowClick && "cursor-pointer")}>
              {columns.map((c) => (
                <TableCell key={c.key} numeric={c.numeric} className={c.className}>
                  {c.cell ? c.cell(row) : String(row[c.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">صفحه‌ی {fa(current)} از {fa(pages)}</span>
          <Pagination page={current} total={pages} onChange={setPage} size="sm" />
        </div>
      )}
    </div>
  );
}
