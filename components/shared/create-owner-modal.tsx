'use client';

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { FormInputBlock } from './form-input-block';
import { OwnerCreate } from '@/services/owners';
import toast from 'react-hot-toast';

import { useHookFormMask } from 'use-mask-input';

interface Props {
  className?: string;
  onAddedOwner: () => void;
}

export interface MyForm {
  fullName: string;
  phone: string;
}

export const CreateOwnerModal: React.FC<Props> = ({ onAddedOwner }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MyForm>({
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      phone: '',
    },
  });

  const onSubmit: SubmitHandler<MyForm> = async (data) => {
    const formData = {
      fullName: data.fullName,
      phone: data.phone,
    };
    try {
      await OwnerCreate.create(formData);
      onAddedOwner();
      toast.success('Владелец добавлен');
    } catch (error) {
      toast.error('Ошибка при добавление владельца');
      console.log('Ошибка при добавление владельца', error);
    }
  };

  const registerWithMask = useHookFormMask(register);
  return (
    <Dialog>
      <DialogTrigger
        className="fixed bottom-10 right-10 w-[50px] h-[50px] rounded-sm cursor-pointer"
        asChild>
        <Button className="text-[20px] leading-0" variant="default">
          +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новую пользователя</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInputBlock
              {...register('fullName', {
                required: 'Поле объязательно',
                minLength: { value: 5, message: 'Минимум 5 символов' },
              })}
              label="Имя"
              id="nickname"
              type="text"
              placeholder="Имя пользователя"
              error={errors.fullName?.message}
            />

            <FormInputBlock
              {...registerWithMask('phone', ['+999 99 999-99-99'], {
                required: true,
              })}
              label="Номер телефона"
              id="fullName"
              type="text"
              placeholder="+998 99 123 45 67"
              error={errors.phone?.message}
            />

            <Button type="submit">Save changes</Button>
          </form>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
