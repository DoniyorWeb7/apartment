'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Payment } from './apart-table';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Pencil, Trash } from 'lucide-react';

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    meta: { filterVariant: 'text' },
    cell: ({ row }) => <div className="uppercase">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Статус',
    meta: { filterVariant: 'text' },
    cell: ({ row }) => {
      const status = row.getValue('status') as Payment['status'];
      const statusColor: Record<Payment['status'], string> = {
        'Mudat bitti': 'bg-red-500',
        Tolangan: 'bg-green-500',
      };
      return (
        <div
          className={cn(
            'capitalize  flex items-center justify-center text-white p-1 rounded-md text-[10px]',
            statusColor[status] || 'bg-gray-500',
          )}>
          {row.getValue('status')}
        </div>
      );
    },
  },
  {
    accessorKey: 'imageUrl',
    header: 'Изображения',
    cell: ({ row }) => (
      <div className="w-[150px] h-[80px] relative border border-[#828282] overflow-hidden rounded-md">
        <Image src={row.getValue('imageUrl')} fill className="object-cover" alt="" />
      </div>
    ),
  },
  {
    accessorKey: 'date',
    meta: { filterVariant: 'text' },
    header: 'Дата доступности',
    cell: ({ row }) => <div className="capitalize">{row.getValue('date')}</div>,
  },
  {
    accessorKey: 'amount',
    meta: { filterVariant: 'number' },
    header: 'Цена',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className="text-font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'adress',
    meta: { filterVariant: 'select', options: ['Miroobod', 'Olmazor'] },
    header: 'Район',
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
    meta: { filterVariant: 'text' },
    header: 'Этаж',
    cell: ({ row }) => <div className="capitalize">{row.getValue('floor')}</div>,
  },
  {
    accessorKey: 'employee',
    meta: { filterVariant: 'select', options: ['Aziz', 'Olim'] },
    header: 'Сотрудник',
    cell: ({ row }) => <div className="capitalize">{row.getValue('employee')}</div>,
  },
  {
    accessorKey: 'owner',
    meta: { filterVariant: 'select', options: ['Dilshod', 'Nikita'] },
    header: 'Владелец',
    cell: ({ row }) => <div className="capitalize">{row.getValue('owner')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: () => {
      return (
        <div className="flex gap-2">
          <Button
            variant={'default'}
            className="bg-red-600 hover:bg-red-800 w-[35px] h-[35px] cursor-pointer">
            <Pencil />
          </Button>
          <Button className="bg-blue-900 hover:bg-blue-950 w-[35px] h-[35px] cursor-pointer">
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
