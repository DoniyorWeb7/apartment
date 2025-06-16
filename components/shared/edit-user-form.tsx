// components/edit-user-form.tsx
import { useForm } from 'react-hook-form';
import { User } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Label } from '../ui/label';
import { useHookFormMask } from 'use-mask-input';

interface EditUserFormProps {
  user: User;
  onSubmit: (data: Partial<User>) => Promise<void>;
  onCancel: () => void;
  onResUser: () => void;
}

export const EditUserForm = ({ user, onSubmit, onCancel, onResUser }: EditUserFormProps) => {
  const { register, handleSubmit } = useForm<Partial<User>>({
    defaultValues: {
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      passport: user.passport,
      password: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const registerWithMask = useHookFormMask(register);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        setIsSubmitting(true);
        try {
          await onSubmit(data);
          onResUser();
        } finally {
          setIsSubmitting(false);
        }
      })}
      className="space-y-4">
      <Label htmlFor="username">Username</Label>
      <Input id="username" {...register('username')} />
      <Label htmlFor="fullName">Имя</Label>
      <Input id="fullName" {...register('fullName')} />
      <Label htmlFor="phone">Телефон</Label>
      <Input id="phone" {...registerWithMask('phone', ['+999 99 999-99-99'])} />
      <Label htmlFor="passport">Пасспорт</Label>
      <Input id="passport" {...register('passport')} />
      <Label htmlFor="password">Пароль</Label>
      <Input id="password" {...register('password')} />

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
