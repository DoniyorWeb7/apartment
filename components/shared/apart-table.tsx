'use client';
import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  // Row,
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
  const [isLoading, setIsLoading] = React.useState(true);

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
    setIsLoading(true);
    try {
      const aparts = await Api.apartments.getAll();
      setApart(aparts);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
    fetchOwners();
    fetchApart();
  }, []);

  // const priceBetweenFilter = (
  //   row: Row<any>,
  //   columnId: string,
  //   filterValue: { min?: number; max?: number },
  // ) => {
  //   const price = row.getValue(columnId);

  //   const min = filterValue.min ?? 0;
  //   const max = filterValue.max ?? Infinity;

  //   return price >= min && price <= max;
  // };

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
          Свободен: 'bg-blue-500',
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
      // filterFn: priceBetweenFilter,
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
          { label: 'Алмазар', value: 'Алмазар' },
          { label: 'Бектемир ', value: 'Бектемир' },
          { label: 'Мирабад', value: 'Мирабад' },
          { label: 'Мирзо-Улугбек', value: 'Мирзо-Улугбек' },
          { label: 'Сергели', value: 'Сергели' },
          { label: 'Чиланзар', value: 'Чиланзар' },
          { label: 'Шайхантаур', value: 'Шайхантаур' },
          { label: 'Юнусабад', value: 'Юнусабад' },
          { label: 'Яккасарай', value: 'Яккасарай' },
          { label: 'Яшнабад', value: 'Яшнабад' },
          { label: 'Учтепа', value: 'Учтепа' },
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
        return <TableButton onResApart={fetchApart} apart={apart} apartId={apart.id} />;
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

  const paginationRange = (() => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;

    const delta = 2; // Соседей вокруг текущей страницы
    const range: (number | '...')[] = [];
    range.push(1);

    if (currentPage > delta + 2) {
      range.push('...');
    }

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage < totalPages - delta - 1) {
      range.push('...');
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  })();

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
                  {isLoading ? 'Загрузка...' : 'Нет результат.'}
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

        {paginationRange.map((page, i) =>
          page === '...' ? (
            <span key={i} className="px-2">
              …
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={page === table.getState().pagination.pageIndex + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => table.setPageIndex((page as number) - 1)}>
              {page}
            </Button>
          ),
        )}

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

// : column.columnDef.meta?.filterVariant === 'range' ? (
//                         <div className="flex gap-2">
//                           <Input
//                             placeholder="от"
//                             type="number"
//                             value={(column.getFilterValue() as { min?: number })?.min ?? ''}
//                             onChange={(e) =>
//                               column.setFilterValue((old: any) => ({
//                                 ...old,
//                                 min: e.target.value ? parseFloat(e.target.value) : undefined,
//                               }))
//                             }
//                             className="h-8 w-full"
//                           />
//                           <Input
//                             placeholder="до"
//                             type="number"
//                             value={(column.getFilterValue() as { max?: number })?.max ?? ''}
//                             onChange={(e) =>
//                               column.setFilterValue((old: any) => ({
//                                 ...old,
//                                 max: e.target.value ? parseFloat(e.target.value) : undefined,
//                               }))
//                             }
//                             className="h-8 w-full"
//                           />
//                         </div>
//                       ) :
