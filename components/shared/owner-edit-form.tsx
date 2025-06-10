// components/edit-user-form.tsx
import { useForm } from 'react-hook-form';
import { Owner } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useHookFormMask } from 'use-mask-input';

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
  const registerWithMask = useHookFormMask(register);

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
      <Input {...registerWithMask('phone', '+999 99 999-99-99')} />

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
