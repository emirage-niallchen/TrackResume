"use client"

import React, { useRef, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TableMeta<TData> {
  onView?: (data: TData) => void
  onEdit?: (data: TData) => void
  onDelete?: (data: TData) => void
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  loading?: boolean
  meta?: TableMeta<TData>
  selectedRowIds?: string[]
  onSelectedRowIdsChange?: (ids: string[]) => void
}

export function DataTable<TData extends { id: string }>({
  columns,
  data,
  loading,
  meta,
  selectedRowIds,
  onSelectedRowIdsChange,
}: DataTableProps<TData>) {
  const headerCheckboxRef = useRef<HTMLInputElement>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
    state: selectedRowIds ? { rowSelection: Object.fromEntries(selectedRowIds.map(id => [id, true])) } : undefined,
    enableRowSelection: !!onSelectedRowIdsChange,
    onRowSelectionChange: onSelectedRowIdsChange
      ? (updater) => {
          // updater can be a function or an object
          const next: any = typeof updater === 'function' ? updater(table.getState().rowSelection) : updater;
          const ids = Object.keys(next).filter((id) => next[id]);
          onSelectedRowIdsChange(ids);
        }
      : undefined,
    getRowId: (row) => (row as any).id,
  });

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
    }
  }, [table]);

  if (loading) {
    return <div className="text-center py-4">加载中...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {onSelectedRowIdsChange && (
                <TableHead>
                  <input
                    type="checkbox"
                    ref={headerCheckboxRef}
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                  />
                </TableHead>
              )}
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {onSelectedRowIdsChange && (
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={row.getIsSelected()}
                      onChange={row.getToggleSelectedHandler()}
                    />
                  </TableCell>
                )}
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                暂无数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 