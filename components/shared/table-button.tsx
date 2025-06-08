'use client';
import React from 'react';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ApartDelete } from '@/services/apart-delete';
import toast from 'react-hot-toast';
import { apartUpdata } from '@/services/apart-update';
import { Apartment } from '@prisma/client';
import { ApartEditDialog } from './apart-edit-dialog';
import { SendTelegramBtn } from './send-telegram-btn';
interface Props {
  className?: string;
  apartId: number;
  apart: Apartment;
  onEditedApart: () => void;
}

export const TableButton: React.FC<Props> = ({ apartId, apart, onEditedApart }) => {
  const { data: session } = useSession();
  const handleUpdate = async (
    data: Partial<Apartment> & {
      images?: File[]; // Измените JsonValue на File[]
      cover?: File | null; // Измените coverImage на cover и тип на File | null
    },
  ) => {
    try {
      await apartUpdata(apart.id, data);
      toast.success('Пользователь изменен');
      onEditedApart();
    } catch (error) {
      toast.error('Ошибка при изменения пользователя');
      console.error('Ошибка при обновлении пользователя:', error);
    }
  };
  const handleDelete = async (apartId: number) => {
    try {
      await ApartDelete(apartId);
      toast.success('Пользователь Удален');
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
            className="bg-red-600 hover:bg-red-800 w-[35px] h-[35px] cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(apartId);
            }}>
            <Trash />
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
          <ApartEditDialog onUpdate={handleUpdate} apart={apart} />
        </>
      )}
    </div>
  );
};
