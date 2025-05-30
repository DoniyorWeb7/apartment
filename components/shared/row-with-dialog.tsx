import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { TableCell, TableRow } from '../ui/table';
import { flexRender, Row } from '@tanstack/react-table';
import { ApartmentWithUser } from './apart-table';
import { PreviewGallery } from './apartment-gallery';
import { Button } from '../ui/button';

export const RowWithDialog = ({ row }: { row: Row<ApartmentWithUser> }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <TableRow
          onClick={() => setIsDialogOpen(true)}
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
        <DialogTitle>Информации оо квартиры</DialogTitle>
        <DialogHeader>
          <div className="space-y-2 overflow-auto h-[600px]">
            <div className="flex flex-wrap">
              <PreviewGallery images={row.original.images as string[]} />
            </div>
            <p>
              ID: <strong>{row.original.id}</strong>
            </p>
            <p>
              Сотрудник:
              <strong> {row.original.userId}</strong>
            </p>
            <hr />
            <p className="mb-1">
              <strong>Расположения:</strong>
            </p>
            <p>
              Район: <strong> {row.original.district}</strong>
            </p>
            <p>
              Адрес: <strong> {row.original.adress}</strong>
            </p>
            <hr />
            <strong>Информации о квартиры:</strong>
            <p>
              Комнат: <strong> {row.original.room}</strong>
            </p>
            <p>
              Этаж: <strong> {row.original.floor}</strong>
            </p>
            <p>
              Этажнось:
              <strong> {row.original.floorBuild}</strong>
            </p>
            <p>
              Площадь: <strong> {row.original.square}</strong>
            </p>
            <hr />
            <strong>Способ оплаты:</strong>
            <p>
              Предоплата:
              <strong> {row.original.variant === '1' ? 'Да' : 'Нет'}</strong>
            </p>
            <p>
              Депозит:
              <strong> {row.original.variant === '2' ? 'Да' : 'Нет'}</strong>
            </p>
            <p>
              Цена: <strong> ${row.original.price}</strong>
            </p>
            <hr />
            <p>
              Доступно с:
              <strong>{'' + new Date(row.original.availability).toLocaleDateString()}</strong>
            </p>
            <p>
              Дата обновления:
              <strong>{'' + new Date(row.original.updateAt).toLocaleDateString()}</strong>
            </p>
            <p>
              Дата создания:
              <strong>{'' + new Date(row.original.createAt).toLocaleDateString()}</strong>
            </p>
            <hr />
            <p>
              Описание:
              <strong>{row.original.description}</strong>
            </p>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit">Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
