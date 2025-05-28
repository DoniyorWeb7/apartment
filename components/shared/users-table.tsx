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
import { User } from '@prisma/client';
import { Api } from '@/services/api-client';
import { CreateUserModal } from './create-user-modal';
import { DeleteButton } from './deleting-user-btn';
import { deleteUser } from '@/services/user-delete';
import { userUpdate } from '@/services/user-update';
import { UserEditDialog } from './user-edit-btn';
import toast from 'react-hot-toast';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { filterVariant: 'text' },
    cell: ({ row }) => <div className="uppercase">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'username',
    meta: { filterVariant: 'text' },
    header: 'Псевдоним',
    cell: ({ row }) => <div className="capitalize">{row.getValue('username')}</div>,
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
    accessorKey: 'passport',
    meta: { filterVariant: 'text' },
    header: 'Номер пасспорт',
    cell: ({ row }) => <div className="capitalize">{row.getValue('passport')}</div>,
  },
  {
    accessorKey: 'availabilityPas',
    meta: { filterVariant: 'text' },
    header: 'Дата создания пасспорта',
    cell: ({ row }) => {
      const value = row.getValue('availabilityPas') as string;
      const formatted = new Intl.DateTimeFormat('ru-RU').format(new Date(value));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    accessorKey: 'createAt',
    meta: { filterVariant: 'text' },
    header: 'Дата создания',
    cell: ({ row }) => {
      const value = row.getValue('createAt') as string;
      const formatted = new Intl.DateTimeFormat('ru-RU').format(new Date(value));
      return <div className="capitalize">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      const handleUpdate = async (data: Partial<User>) => {
        try {
          await userUpdate(user.id, data);
          toast.success('Пользователь изменен');
        } catch (error) {
          toast.error('Ошибка при изменения пользователя');
          console.error('Ошибка при обновлении пользователя:', error);
        }
      };

      const handleDelete = async (userId: number) => {
        try {
          await deleteUser(userId);
          toast.success('Пользователь Удален');
        } catch (error) {
          toast.error('Ошибка при удаление пользователя');
          console.error('Failed to delete user:', error);
        }
      };

      return (
        <div className="flex gap-2">
          <DeleteButton userId={user.id} onDelete={handleDelete} />
          <UserEditDialog user={user} onUpdate={handleUpdate} />
        </div>
      );
    },
  },
];

export function UsersTable() {
  const [data, setData] = React.useState<User[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const users = await Api.users.getAll();
      setData(users);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
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
      <CreateUserModal onUserAdded={fetchUsers} />
    </div>
  );
}
