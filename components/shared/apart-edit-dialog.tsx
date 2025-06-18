import { Apartment } from '@prisma/client';
import { Pencil } from 'lucide-react';
import React from 'react';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { EditApartmentForm } from './edit-apart-form';
interface UserEditDialogProps {
  apart: Apartment;
  onUpdate: (
    data: Partial<Apartment> & {
      images?: File[];
      cover?: File | null;
    },
  ) => Promise<void>;
}

export const ApartEditDialog = ({ apart, onUpdate }: UserEditDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-800 cursor-pointer"
          variant="default"
          size="icon">
          <Pencil className="h-4 w-4 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[600px] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <DialogTitle>Изменить квартиру</DialogTitle>
        <EditApartmentForm
          apartment={apart}
          onSubmit={async (data) => {
            await onUpdate(data);
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
