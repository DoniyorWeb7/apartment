'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Owner } from '@prisma/client';
import { Api } from '@/services/api-client';
import { CreateOwnerModal } from './create-owner-modal';
import { OwnerDelete } from '@/services/owners';
import { DeleteButton } from './deleting-user-btn';
import { ownerUpdate } from '@/services/owner-update';
import { OwnerEditDialog } from './owner-edit-dialog';
import toast from 'react-hot-toast';

export type Payment = {
  id: string;
  fullName: string;
  phone: string;
  createAt: Date;
  updateAt: Date;
};

export const columns: ColumnDef<Owner>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { filterVariant: 'text' },
    cell: ({ row }) => <div className="uppercase">{row.getValue('id')}</div>,
  },

  {
    accessorKey: 'fullName',
    meta: { filterVariant: 'text' },
    header: 'Имя',
    cell: ({ row }) => <div className="capitalize">{row.getValue('fullName')}</div>,
  },

  {
    accessorKey: 'phone',
    meta: { filterVariant: 'text' },
    header: 'Номер телефона',
    cell: ({ row }) => <div className="capitalize">{row.getValue('phone')}</div>,
  },

  {
    accessorKey: 'createAt',
    meta: { filterVariant: 'text' },
    header: 'Дата создания',
    cell: ({ row }) => {
      const date: Date = row.getValue('createAt');
      const formatted = new Intl.DateTimeFormat('ru-RU').format(new Date(date));
      return <div className="capitalize">{formatted}</div>;
    },
  },

  {
    accessorKey: 'updateAt',
    meta: { filterVariant: 'text' },
    header: 'Дата обновления',
    cell: ({ row }) => {
      const date: Date = row.getValue('updateAt');
      const formatted = new Intl.DateTimeFormat('ru-RU').format(new Date(date));
      return <div className="capitalize">{formatted}</div>;
    },
  },

  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const owner = row.original;

      const handelUpdate = async (data: Partial<Owner>) => {
        try {
          await ownerUpdate(owner.id, data);
          toast.success('Владелец изменен');
        } catch (error) {
          toast.error('Ошибка при изменение владельца');
          console.error('Ошибка при обновлении владелец:', error);
        }
      };

      const handleDelete = async (ownerId: number) => {
        try {
          await OwnerDelete(ownerId);
          toast.success('Владелец Удален');
        } catch (err) {
          toast.error('Ошибка при удлаение владельца');
          console.error('Failed to delete user:', err);
        }
      };
      return (
        <div className="flex gap-2">
          <DeleteButton userId={owner.id} onDelete={handleDelete} />
          <OwnerEditDialog onUpdate={handelUpdate} owner={owner} />
        </div>
      );
    },
  },
];

export function OwnerTable() {
  const [data, setData] = React.useState<Owner[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  async function fetchOwners() {
    try {
      const owners = await Api.owners.getAll();
      setData(owners);
    } catch (error) {
      console.error(error);
    }
  }
  React.useEffect(() => {
    fetchOwners();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableColumnFilters: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}

            <TableRow>
              {table.getAllLeafColumns().map((column) => {
                const filterVariant = (column.columnDef.meta as any)?.filterVariant;
                const options = (column.columnDef.meta as any)?.options ?? [];
                return (
                  <TableHead key={column.id}>
                    {column.getCanFilter() ? (
                      filterVariant === 'select' ? (
                        <select
                          className="h-8 w-full border rounded px-2"
                          value={(column.getFilterValue() as string) ?? ''}
                          onChange={(e) => column.setFilterValue(e.target.value)}>
                          <option value="">Все</option>
                          {options.map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          placeholder={
                            typeof column.columnDef.header === 'string'
                              ? column.columnDef.header
                              : 'Фильтр'
                          }
                          value={(column.getFilterValue() ?? '') as string}
                          onChange={(e) => column.setFilterValue(e.target.value)}
                          className="h-8 w-full"
                        />
                      )
                    ) : null}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Выбрано {table.getFilteredSelectedRowModel().rows.length} из{' '}
          {table.getFilteredRowModel().rows.length} строк.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
      <CreateOwnerModal onAddedOwner={fetchOwners} />
    </div>
  );
}
