import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';

interface DeleteButtonProps {
  userId: number;
  onDelete: (userId: number) => Promise<void>;
  onResData: () => void;
}

export const DeleteButton = ({ userId, onDelete, onResData }: DeleteButtonProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  console.log('Владелец', userId);
  const handleClick = async () => {
    const confirm = window.confirm('Точно удалить пользователя?');
    if (!confirm) return;

    setIsDeleting(true);
    try {
      await onDelete(userId);
      onResData();
    } catch (err) {
      console.log(err);
      alert('Ошибка при удалении');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      className="cursor-pointer bg-red-700 hover:bg-red-800"
      variant="default"
      size="icon"
      onClick={handleClick}
      disabled={isDeleting}>
      {isDeleting ? '...' : <Trash className="h-4 w-4" />}
    </Button>
  );
};
