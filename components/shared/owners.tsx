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
import { Owner } from '@prisma/client';
import { Api } from '@/services/api-client';
import { DeleteButton } from './deleting-user-btn';
import toast from 'react-hot-toast';
import { CreateOwnerModal } from './create-owner-modal';
import { OwnerEditDialog } from './edit-owner-dialog';
import { OwnerDelete } from '@/services/owners';
import { ownerUpdate } from '@/services/owner-update';

export interface CustomColumnMeta {
  filterVariant?: 'text' | 'select' | 'date';
  options?: { label: string; value: string }[];
}

export function OwnerTable() {
  const [data, setData] = React.useState<Owner[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchOwner = async () => {
    setIsLoading(true);
    try {
      const owner = await Api.owners.getAll();
      setData(owner);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOwner();
  }, []);

  const columns: ColumnDef<Owner>[] = [
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
      header: 'Номер',
      cell: ({ row }) => <div className="capitalize">{row.getValue('phone')}</div>,
    },

    {
      accessorKey: 'createAt',
      meta: { filterVariant: 'text' },
      header: 'Дата создание',
      cell: ({ row }) => {
        const value = row.getValue('createAt') as string;
        const formatted = new Intl.DateTimeFormat('ru-RU').format(new Date(value));
        return <div className="capitalize">{formatted}</div>;
      },
    },

    {
      accessorKey: 'updataAt',
      meta: { filterVariant: 'text' },
      header: 'Дата обновление',
      cell: ({ row }) => {
        const value = row.getValue('updataAt') as string;
        const formatted = new Intl.DateTimeFormat('ru-RU').format(new Date(value));
        return <div className="capitalize">{formatted}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const owner = row.original;

        const handleUpdate = async (data: Partial<Owner>) => {
          try {
            await ownerUpdate(owner.id, data);
            toast.success('Пользователь изменен');
          } catch (error) {
            toast.error('Ошибка при изменения пользователя');
            console.error('Ошибка при обновлении пользователя:', error);
          }
        };

        const handleDelete = async (ownerId: number) => {
          try {
            await OwnerDelete(ownerId);
            toast.success('Пользователь Удален');
          } catch (error) {
            toast.error('Ошибка при удаление пользователя');
            console.error('Failed to delete user:', error);
          }
        };

        return (
          <div className="flex gap-2">
            <DeleteButton onResData={fetchOwner} userId={owner.id} onDelete={handleDelete} />
            <OwnerEditDialog onResOwner={fetchOwner} owner={owner} onUpdate={handleUpdate} />
          </div>
        );
      },
    },
  ];

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

  console.log(table.getRowModel());

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
                const filterVariant = (column.columnDef.meta as CustomColumnMeta)?.filterVariant;
                const options = (column.columnDef.meta as CustomColumnMeta)?.options ?? [];
                return (
                  <TableHead key={column.id}>
                    {column.getCanFilter() ? (
                      filterVariant === 'select' ? (
                        <select
                          className="h-8 w-full border rounded px-2"
                          value={(column.getFilterValue() as string) ?? ''}
                          onChange={(e) => column.setFilterValue(e.target.value)}>
                          <option value="">Все</option>
                          {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
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
                // <Dialog key={row.id}>
                //   <DialogTrigger asChild>
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                // </DialogTrigger>
                //   <DialogContent className="sm:max-w-[425px]">
                //     <DialogHeader>
                //       <DialogTitle>
                //         <div>Modal Content</div>
                //       </DialogTitle>
                //     </DialogHeader>

                //     <DialogFooter>
                //       <Button type="submit">Save changes</Button>
                //     </DialogFooter>
                //   </DialogContent>
                // </Dialog>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? 'Загрузка...' : 'Нет результат.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
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
      <CreateOwnerModal onAddedOwner={fetchOwner} />
    </div>
  );
}
