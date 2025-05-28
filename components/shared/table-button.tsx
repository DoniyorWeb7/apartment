'use client';
import React from 'react';
import { Button } from '../ui/button';
import { Pencil, Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
interface Props {
  className?: string;
}

export const TableButton: React.FC<Props> = () => {
  const { data: session } = useSession();
  return (
    <div className="flex gap-2">
      <Button
        variant={'default'}
        className="bg-red-600 hover:bg-red-800 w-[35px] h-[35px] cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
        }}>
        <Pencil />
      </Button>
      {session?.user?.role === 'ADMIN' && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="bg-blue-900 hover:bg-blue-950 w-[35px] h-[35px] cursor-pointer">
          <Trash />
        </Button>
      )}
    </div>
  );
};
