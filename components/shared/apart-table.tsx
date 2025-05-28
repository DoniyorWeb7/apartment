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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '../ui/dialog';
import { Apartment, User } from '@prisma/client';
import { Api } from '@/services/api-client';
import { TableButton } from './table-button';
import { PreviewGallery } from './apartment-gallery';

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

export function ApartTable() {
  const [apart, setApart] = React.useState<Apartment[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedApartment, setSelectedApartment] = React.useState<Apartment | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [userOptions, setUserOptions] = React.useState<User[]>([]);
  const statusOptions = [
    { label: 'Занят', value: '1' },
    { label: 'Свободен', value: '2' },
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

  React.useEffect(() => {
    fetchUsers();
  }, []);
  const columns: ColumnDef<Apartment>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      meta: { filterVariant: 'text' },
      cell: ({ row }) => <div className="uppercase">{row.getValue('id')}</div>,
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
          '1': 'bg-red-500',
          '2': 'bg-green-500',
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
    },
    {
      accessorKey: 'district',
      meta: {
        filterVariant: 'select',
        options: [
          'Алмазарский район',
          'Бектемирский район',
          'Мирабадский район',
          'Мирзо-Улугбекский район',
          'Сергелийский район',
          'Чиланзарский район',
          'Шайхантаурский район',
          'Юнусабадский район',
          'Яккасарайский район',
          'Яшнабадский район',
          'Учтепинский район',
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
    },
    {
      accessorKey: 'floor',
      meta: { filterVariant: 'number' },
      header: 'Этаж',
      cell: ({ row }) => <div className="capitalize">{row.getValue('floor')}</div>,
    },
    {
      accessorKey: 'user.username',
      meta: { filterVariant: 'select', options: userOptions.map((u) => u.username) },
      header: 'Сотрудник',
      cell: ({ row }) => <div className="capitalize">{row.original.user?.username ?? '—'}</div>,
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: () => <TableButton />,
    },
  ];
  React.useEffect(() => {
    async function fetchApart() {
      try {
        const aparts = await Api.apartments.getAll();
        setApart(aparts);
      } catch (error) {
        console.error(error);
      }
    }
    fetchApart();
  }, []);
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
                const filterVariant = (column.columnDef.meta as any)?.filterVariant;
                const options = (column.columnDef.meta as any)?.options ?? [];
                const imageInputHide = column.columnDef.header;
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
              table.getRowModel().rows.map((row) => (
                <Dialog key={row.id} open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <TableRow
                      onClick={() => {
                        setSelectedApartment(row.original);
                        setDialogOpen(true);
                      }}
                      className="cursor-pointer"
                      data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      {selectedApartment && (
                        <div className="space-y-2 overflow-auto h-[600px]">
                          <div className="flex flex-wrap">
                            {/* {(selectedApartment.images as string[])?.map((image, index) => (
                              <Image
                                width={300}
                                height={200}
                                className="rounded-md object-cover"
                                key={index}
                                src={image}
                                alt={`Apartment image ${index + 1}`}
                              />
                            ))} */}
                            <PreviewGallery images={selectedApartment.images as string[]} />
                          </div>
                          <p>
                            ID: <strong> {selectedApartment.id}</strong>
                          </p>
                          <p>
                            Сотрудник:
                            <strong> {selectedApartment.userId}</strong>
                          </p>
                          <hr />
                          <p className="mb-1">
                            <strong>Расположения:</strong>
                          </p>
                          <p>
                            Район: <strong> {selectedApartment.district}</strong>
                          </p>
                          <p>
                            Адрес: <strong> {selectedApartment.adress}</strong>
                          </p>
                          <hr />
                          <strong>Информации о квартиры:</strong>
                          <p>
                            Комнат: <strong> {selectedApartment.room}</strong>
                          </p>
                          <p>
                            Этаж: <strong> {selectedApartment.floor}</strong>
                          </p>
                          <p>
                            Этажнось:
                            <strong> {selectedApartment.floorBuild}</strong>
                          </p>
                          <p>
                            Площадь: <strong> {selectedApartment.square}</strong>
                          </p>
                          <hr />
                          <strong>Способ оплаты:</strong>
                          <p>
                            Предоплата:
                            <strong> {selectedApartment.variant === '1' ? 'Да' : 'Нет'}</strong>
                          </p>
                          <p>
                            Депозит:
                            <strong> {selectedApartment.variant === '2' ? 'Да' : 'Нет'}</strong>
                          </p>
                          <p>
                            Цена: <strong> ${selectedApartment.price}</strong>
                          </p>
                          <hr />
                          <p>
                            Доступно с:
                            <strong>
                              {'' + new Date(selectedApartment.availability).toLocaleDateString()}
                            </strong>
                          </p>
                          <p>
                            Дата обновления:
                            <strong>
                              {'' + new Date(selectedApartment.updateAt).toLocaleDateString()}
                            </strong>
                          </p>
                          <p>
                            Дата создания:
                            <strong>
                              {'' + new Date(selectedApartment.createAt).toLocaleDateString()}
                            </strong>
                          </p>
                          <hr />
                          <p>
                            Описание:
                            <strong>{selectedApartment.description}</strong>
                          </p>
                        </div>
                      )}
                    </DialogHeader>

                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
    </div>
  );
}
