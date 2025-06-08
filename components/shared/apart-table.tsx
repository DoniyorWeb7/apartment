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
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Apartment, Owner, User } from '@prisma/client';
import { Api } from '@/services/api-client';
import { TableButton } from './table-button';
import { RowWithDialog } from './row-with-dialog';
import { SelectInput } from './select-input';
import { CreateApartModal } from './create-apart-modal';

export type Payment = {
  id: string;
  amount: number;
  date: string;
  status: 'Mudat bitti' | 'Tolangan';
  imageUrl: string;
  adress: string;
  room: number;
  floor: number;
  employee: string;
  owner: {
    fullName: string;
    phone: string;
  };
};

export type ApartmentWithUser = Apartment & {
  user?: User; // Make it optional if it might not always be present
};

export interface CustomColumnMeta {
  filterVariant?: 'text' | 'select' | 'date';
  options?: { label: string; value: string }[];
}

export function ApartTable() {
  const [apart, setApart] = React.useState<ApartmentWithUser[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [userOptions, setUserOptions] = React.useState<User[]>([]);
  const [ownerOptions, setOwnerOptions] = React.useState<Owner[]>([]);

  const statusOptions = [
    { label: 'Занят', value: 'Занят' },
    { label: 'Свободен', value: 'Свободен' },
  ];
  const fetchUsers = async () => {
    try {
      const users = await Api.users.getAll();
      setUserOptions(users);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const fetchOwners = async () => {
    try {
      const owner = await Api.owners.getAll();
      setOwnerOptions(owner);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const fetchApart = async () => {
    try {
      const aparts = await Api.apartments.getAll();
      setApart(aparts);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchUsers();
    fetchOwners();
    fetchApart();
  }, []);
  const columns: ColumnDef<ApartmentWithUser>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      meta: { filterVariant: 'text' },
      cell: ({ row }) => <div className="uppercase">{row.getValue('id')}</div>,
      filterFn: (row, id, value) => {
        const val = row.getValue(id);
        return String(val).includes(String(value));
      },
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      meta: { filterVariant: 'text', options: statusOptions },
      cell: ({ row }) => {
        const statusValue = row.getValue('status') as string;

        const statusLabel =
          statusOptions.find((option) => option.value === statusValue)?.label ?? '—';

        const statusColorMap: Record<string, string> = {
          Занят: 'bg-red-500',
          Свободен: 'bg-green-500',
        };
        return (
          <div
            className={cn(
              'capitalize flex items-center justify-center text-white p-1 rounded-md text-[10px]',
              statusColorMap[statusValue] || 'bg-gray-500',
            )}>
            {statusLabel}
          </div>
        );
      },
    },
    {
      accessorKey: 'coverImage',
      header: 'Изображения',
      cell: ({ row }) => {
        const cover = row.original.coverImage;
        return (
          <div className="w-[150px] h-[80px] relative border border-[#828282] overflow-hidden rounded-md">
            {cover ? (
              <Image src={cover} fill className="object-cover" alt="Обложка" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                Нет обложки
              </div>
            )}
          </div>
        );
      },
      enableColumnFilter: false,
      enableGlobalFilter: false,
    },
    {
      accessorKey: 'availability',
      meta: { filterVariant: 'text' },
      header: 'Дата доступности',
      cell: ({ row }) => {
        const value = row.getValue('availability') as string;
        const formatted = new Intl.DateTimeFormat('ru-RU').format(new Date(value));
        return <div className="capitalize">{formatted}</div>;
      },
      filterFn: (row, id, value) => {
        const rowDate = new Date(row.getValue(id)).toLocaleDateString('ru-RU');
        return rowDate.includes(value);
      },
    },

    {
      accessorKey: 'price',
      meta: { filterVariant: 'number' },
      header: 'Цена',
      cell: ({ row }) => {
        const price = parseFloat(row.getValue('price'));

        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(price);

        return <div className="text-font-medium">{formatted}</div>;
      },
      filterFn: (row, id, value) => {
        const rowValue = row.getValue(id);
        return String(rowValue).includes(String(value)); // Приводим к строке
      },
    },
    {
      accessorKey: 'district',
      meta: {
        filterVariant: 'select',
        options: [
          { label: 'Все', value: '' },
          { label: 'Алмазарский', value: 'Алмазарский' },
          { label: 'Бектемирский ', value: 'Бектемирский' },
          { label: 'Мирабадский', value: 'Мирабадский' },
          { label: 'Мирзо-Улугбекский', value: 'Мирзо-Улугбекский' },
          { label: 'Сергелийский', value: 'Сергелийский' },
          { label: 'Чиланзарский', value: 'Чиланзарский' },
          { label: 'Шайхантаурский', value: 'Шайхантаурский' },
          { label: 'Юнусабадский', value: 'Юнусабадский' },
          { label: 'Яккасарайский', value: 'Яккасарайский' },
          { label: 'Яшнабадский', value: 'Яшнабадский' },
          { label: 'Учтепинский', value: 'Учтепинский' },
        ],
      },
      header: 'Район',
      cell: ({ row }) => <div className="capitalize">{row.getValue('district')}</div>,
    },
    {
      accessorKey: 'adress',
      meta: { filterVariant: 'text' },
      header: 'Адресс',
      cell: ({ row }) => <div className="capitalize">{row.getValue('adress')}</div>,
    },
    {
      accessorKey: 'room',
      meta: { filterVariant: 'text' },
      header: 'Комнаты',
      cell: ({ row }) => <div className="capitalize">{row.getValue('room')}</div>,
      filterFn: (row, id, value) => {
        const val = row.getValue(id);
        return String(val).includes(String(value));
      },
    },
    {
      accessorKey: 'floor',
      meta: { filterVariant: 'number' },
      header: 'Этаж',
      cell: ({ row }) => <div className="capitalize">{row.getValue('floor')}</div>,
      filterFn: (row, id, value) => {
        const val = row.getValue(id);
        return String(val).includes(String(value));
      },
    },
    {
      accessorKey: 'user.username',
      meta: {
        filterVariant: 'select',
        options: [
          { label: 'Все', value: '' },
          ...userOptions.map((user) => ({
            label: user.username,
            value: user.username,
          })),
        ],
      },
      header: 'Сотрудник',
      cell: ({ row }) => <div className="capitalize">{row.original.user?.username ?? '—'}</div>,
    },
    {
      accessorKey: 'owner',
      meta: {
        filterVariant: 'select',
        options: [
          { label: 'Все', value: '' },
          ...ownerOptions.map((owner) => ({
            label: `${owner.fullName}  ${owner.phone}`,
            value: owner.phone,
          })),
        ],
      },
      header: 'Владелец',
      cell: ({ row }) => <div className="capitalize">{row.getValue('owner')}</div>,
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const apart = row.original;
        return <TableButton onEditedApart={fetchApart} apart={apart} apartId={apart.id} />;
      },
    },
  ];

  const table = useReactTable<Apartment>({
    data: apart,
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
                const filterVariant = (column.columnDef.meta as CustomColumnMeta)?.filterVariant;
                const options = (column.columnDef.meta as CustomColumnMeta)?.options ?? [];
                const imageInputHide = column.columnDef.header;
                return (
                  <TableHead key={column.id}>
                    {column.getCanFilter() ? (
                      filterVariant === 'select' ? (
                        <SelectInput
                          key={column.id}
                          title=""
                          className=" h-[32px]"
                          nameLabel="Выберите"
                          valueInput={(column.getFilterValue() as string) ?? ''}
                          onChange={(value) => column.setFilterValue(value)}
                          options={options}
                        />
                      ) : imageInputHide === 'Изображения' ? null : (
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
              table.getRowModel().rows.map((row) => <RowWithDialog key={row.id} row={row} />)
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
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          {'<'}
        </Button>

        {Array.from({ length: table.getPageCount() }).map((_, i) => (
          <Button
            key={i}
            variant={i === table.getState().pagination.pageIndex ? 'default' : 'outline'}
            size="sm"
            onClick={() => table.setPageIndex(i)}>
            {i + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          {'>'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}>
          {'>>'}
        </Button>
      </div>
      <CreateApartModal onApartAdded={fetchApart} />
    </div>
  );
}
