'use client';
import React from 'react';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Apartment } from '@prisma/client';
import { ApartEditDialog } from './apart-edit-dialog';
import { SendTelegramBtn } from './send-telegram-btn';
import { saleApartUpdata } from '@/services/sale-apart-update';
import { saleApartDelete } from '@/services/sale-apart-delete';
import { SendTelegramBtnWithPhone } from './send-telegram-btn-with-phone';
interface Props {
  className?: string;
  apartId: number;
  apart: Apartment;
  onResApart: () => void;
}

export const SaleTableButton: React.FC<Props> = ({ apartId, apart, onResApart }) => {
  const { data: session } = useSession();
  const handleUpdate = async (
    data: Partial<Apartment> & {
      images?: File[];
      cover?: File | null;
    },
  ) => {
    try {
      await saleApartUpdata(apart.id, data);
      toast.success('Данные квартиры обновлены');
      onResApart();
    } catch (error) {
      toast.error('Ошибка при обновлении данных');
      console.error('Ошибка:', error);
    }
  };
  const handleDelete = async (apartId: number) => {
    try {
      await saleApartDelete(apartId);
      toast.success('Пользователь Удален');
      onResApart();
    } catch (error) {
      toast.error('Ошибка при удаление пользователя');
      console.error('Failed to delete user:', error);
    }
  };
  return (
    <div className="flex gap-2">
      {session?.user?.role === 'ADMIN' && (
        <div>
          <Button
            variant={'default'}
            className="bg-blue-600 hover:bg-blue-800 w-[35px] h-[35px] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(apartId);
            }}>
            <Trash className="text-white" />
          </Button>
        </div>
      )}
      {(session?.user?.role === 'ADMIN' || session?.user?.id === apart.userId.toString()) && (
        <>
          <SendTelegramBtn
            apartment={{
              id: apart.id,
              price: apart.price,
              district: apart.district,
              adress: apart.adress,
              room: apart.room,
              floor: apart.floor,
              floorBuild: apart.floorBuild,
              square: apart.square,
              images: apart.images as string[], // Приведение типа
            }}
          />

          <SendTelegramBtnWithPhone
            apartment={{
              id: apart.id,
              price: apart.price,
              district: apart.district,
              adress: apart.adress,
              room: apart.room,
              floor: apart.floor,
              floorBuild: apart.floorBuild,
              square: apart.square,
              phone: apart.owner,
              images: apart.images as string[], // Приведение типа
            }}
          />
          <ApartEditDialog onUpdate={handleUpdate} apart={apart} />
        </>
      )}
    </div>
  );
};
