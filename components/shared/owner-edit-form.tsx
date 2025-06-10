// components/edit-user-form.tsx
import { useForm } from 'react-hook-form';
import { Owner } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React from 'react';

interface EditUserFormProps {
  owner: Owner;
  onSubmit: (data: Partial<Owner>) => Promise<void>;
  onCancel: () => void;
  onResOwner: () => void;
}

export const EditOwnerForm = ({ owner, onSubmit, onCancel, onResOwner }: EditUserFormProps) => {
  const { register, handleSubmit } = useForm<Partial<Owner>>({
    defaultValues: {
      fullName: owner.fullName,
      phone: owner.phone,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        setIsSubmitting(true);
        try {
          await onSubmit(data);
          onResOwner();
        } finally {
          setIsSubmitting(false);
        }
      })}
      className="space-y-4">
      <Input {...register('fullName')} />
      <Input {...register('phone')} />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохраняется...' : 'Сохранить изменения'}
        </Button>
      </div>
    </form>
  );
};
