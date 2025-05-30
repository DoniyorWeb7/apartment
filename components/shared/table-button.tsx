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
interface Props {
  className?: string;
  apartId: number;
  apart: Apartment;
}

export const TableButton: React.FC<Props> = ({ apartId, apart }) => {
  const { data: session } = useSession();
  const handleUpdate = async (data: Partial<Apartment>) => {
    try {
      await apartUpdata(apart.id, data);
      toast.success('Пользователь изменен');
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
        <Button
          variant={'default'}
          className="bg-red-600 hover:bg-red-800 w-[35px] h-[35px] cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(apartId);
          }}>
          <Trash />
        </Button>
      )}
      {(session?.user?.role === 'ADMIN' || session?.user?.id === apart.userId.toString()) && (
        // <Button
        //   onClick={(e) => {
        //     e.stopPropagation();
        //   }}
        //   className="bg-blue-900 hover:bg-blue-950 w-[35px] h-[35px] cursor-pointer">
        //   <Trash />
        // </Button>

        <ApartEditDialog onUpdate={handleUpdate} apart={apart} />
      )}
    </div>
  );
};
