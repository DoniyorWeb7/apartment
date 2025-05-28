// import { Apartment } from '@prisma/client';
// import { ColumnDef } from '@tanstack/react-table';

// export const columnsApart: ColumnDef<Apartment>[] = [
//   {
//     accessorKey: 'id',
//     header: 'ID',
//     meta: { filterVariant: 'text' },
//     cell: ({ row }) => <div className="uppercase">{row.getValue('id')}</div>,
//   },
//   {
//     accessorKey: 'status',
//     header: 'Статус',
//     meta: { filterVariant: 'text' },
//     cell: ({ row }) => {
//       const status = row.getValue('status') as Apartment['status'];
//       const statusColor: Record<Apartment['status'], string> = {
//         rent: 'bg-red-500',
//         sale: 'bg-green-500',
//       };
//       return (
//         <div
//           className={cn(
//             'capitalize  flex items-center justify-center text-white p-1 rounded-md text-[10px]',
//             statusColor[status] || 'bg-gray-500',
//           )}>
//           {row.getValue('status')}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: 'coverImage',
//     header: 'Изображения',
//     cell: ({ row }) => {
//       const cover = row.original.coverImage;
//       return (
//         <div className="w-[150px] h-[80px] relative border border-[#828282] overflow-hidden rounded-md">
//           {cover ? (
//             <Image src={cover} fill className="object-cover" alt="Обложка" />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
//               Нет обложки
//             </div>
//           )}
//         </div>
//       );
//     },
//     enableColumnFilter: false,
//     enableGlobalFilter: false,
//   },
//   {
//     accessorKey: 'availability',
//     meta: { filterVariant: 'text' },
//     header: 'Дата доступности',
//     cell: ({ row }) => {
//       const value = row.getValue('availability') as string;
//       const formatted = new Intl.DateTimeFormat('ru-RU').format(new Date(value));
//       return <div className="capitalize">{formatted}</div>;
//     },
//   },
//   {
//     accessorKey: 'price',
//     meta: { filterVariant: 'number' },
//     header: 'Цена',
//     cell: ({ row }) => {
//       const price = parseFloat(row.getValue('price'));

//       const formatted = new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//       }).format(price);

//       return <div className="text-font-medium">{formatted}</div>;
//     },
//   },
//   {
//     accessorKey: 'district',
//     meta: { filterVariant: 'select', options: ['Miroobod', 'Olmazor'] },
//     header: 'Район',
//     cell: ({ row }) => <div className="capitalize">{row.getValue('district')}</div>,
//   },
//   {
//     accessorKey: 'adress',
//     meta: { filterVariant: 'text' },
//     header: 'Адресс',
//     cell: ({ row }) => <div className="capitalize">{row.getValue('adress')}</div>,
//   },
//   {
//     accessorKey: 'room',
//     meta: { filterVariant: 'text' },
//     header: 'Комнаты',
//     cell: ({ row }) => <div className="capitalize">{row.getValue('room')}</div>,
//   },
//   {
//     accessorKey: 'floor',
//     meta: { filterVariant: 'number' },
//     header: 'Этаж',
//     cell: ({ row }) => <div className="capitalize">{row.getValue('floor')}</div>,
//   },
//   {
//     accessorKey: 'user.username',
//     meta: { filterVariant: 'select', options: userOptions.map((u) => u.username) },
//     header: 'Сотрудник',
//     cell: ({ row }) => <div className="capitalize">{row.original.user?.username ?? '—'}</div>,
//   },

//   {
//     id: 'actions',
//     enableHiding: false,
//     cell: () => <TableButton />,
//   },
// ];
