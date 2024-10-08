"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, Suspense, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AddTaskForm from "./components/add-task-form";
import { Task } from "./columns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setTotal: Dispatch<SetStateAction<number>>;
  total: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  setTasks,
  total,
  setTotal,
}: DataTableProps<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const queryParams = useSearchParams();
  const page = queryParams.get("page");
  const totalPage = Math.ceil(total / 10);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex justify-between items-center py-4 gap-5">
        <Input
          placeholder="Filter title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="self-end">
            <Button>Create</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70%] overflow-scroll">
            <SheetHeader>
              <SheetTitle>Create Task</SheetTitle>
              <SheetDescription>
                Keep the Momentum: Add a Task and Stay on Track!
              </SheetDescription>
            </SheetHeader>
            <AddTaskForm
              setOpen={setOpen}
              setTasks={setTasks}
              setTotal={setTotal}
            />
          </SheetContent>
        </Sheet>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
                  );
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPage > 1 && (
        <Pagination className="mt-5 flex justify-end">
          <PaginationContent>
            {Number(page) > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  href={page ? `?page=${Number(page) - 1}` : ""}
                />
              </PaginationItem>
            )}
            {Array.from({ length: totalPage }, (_, index) => (
              <PaginationItem key={`pagination-item-${index}`}>
                <PaginationLink
                  isActive={
                    !page
                      ? index === 0
                        ? true
                        : false
                      : Number(page) === index + 1
                  }
                  href={`?page=${index + 1}`}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {Number(page) < totalPage && (
              <PaginationItem>
                <PaginationNext href={`?page=${Number(page) + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </Suspense>
  );
}
