// components/edit-user-form.tsx
import { useForm } from 'react-hook-form';
import { User } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React from 'react';

interface EditUserFormProps {
  user: User;
  onSubmit: (data: Partial<User>) => Promise<void>;
  onCancel: () => void;
}

export const EditUserForm = ({ user, onSubmit, onCancel }: EditUserFormProps) => {
  const { register, handleSubmit } = useForm<Partial<User>>({
    defaultValues: {
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      passport: user.passport,
      password: user.password,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        setIsSubmitting(true);
        try {
          await onSubmit(data);
        } finally {
          setIsSubmitting(false);
        }
      })}
      className="space-y-4">
      <Input {...register('username')} />
      <Input {...register('fullName')} />
      <Input {...register('phone')} />
      <Input {...register('passport')} />

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
