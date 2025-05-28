'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { DateInput } from './date-input';
import { RadioSelect } from './radio-select';
import { UserCreate } from '@/services/users';
import toast from 'react-hot-toast';

interface Props {
  className?: string;
  onUserAdded: () => void;
}

// export interface MyForm {
//   nickname: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   passport: string;
//   datePassport: Date;
//   createAt: Date;
// }

const schema = z.object({
  username: z.string().min(1, 'Введите ник'),
  fullName: z.string().min(1, 'Введите ФИО'),
  email: z.string().email('Неверный email'),
  phone: z.string().min(5, 'Неверный номер'),
  password: z.string().min(10, 'Неверный пароль'),
  passport: z.string().min(1, 'Введите паспорт'),
  availabilityPas: z.date().optional(),
  role: z.enum(['ADMIN', 'USER'], {
    required_error: 'You need to select a notification type.',
  }),
  // createAt: z.date({ required_error: 'Выберите дату' }),
});

export type MyForm = z.infer<typeof schema>;

export const CreateUserModal: React.FC<Props> = ({ onUserAdded }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MyForm>({
    mode: 'onTouched',
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
      passport: '',
      role: 'USER',
      availabilityPas: new Date(),
    },
  });

  const onSubmit: SubmitHandler<MyForm> = async (data) => {
    const formData = {
      username: data.username,
      fullName: data.fullName,
      phone: data.phone,
      password: data.password,
      passport: data.passport,
      availabilityPas: data.availabilityPas,
      role: data.role,
    };
    try {
      setIsLoading(true);
      await UserCreate.create(formData);
      toast.success('Ползователь добавлен');
      onUserAdded();
    } catch (error) {
      toast.error('Ошибка при добавление пользователя');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        className="fixed bottom-10 right-10 w-[50px] h-[50px] rounded-sm cursor-pointer"
        asChild>
        <Button className="text-[20px] leading-0" variant="default">
          +
        </Button>
      </DialogTrigger>
      <DialogContent className=" h-[650px]">
        <DialogHeader>
          <DialogTitle>Создать новую пользователя</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInputBlock
              {...register('username', {
                required: 'Поле объязательно',
                minLength: { value: 5, message: 'Минимум 5 символов' },
              })}
              label="Псевдоним"
              id="username"
              type="text"
              placeholder="Псевдоним пользователя"
              error={errors.username?.message}
            />

            <FormInputBlock
              {...register('fullName', {
                required: 'Поле объязательно',
              })}
              label="Имя"
              id="fullName"
              type="text"
              placeholder="Имя пользователя"
              error={errors.fullName?.message}
            />

            <FormInputBlock
              {...register('email', {
                required: 'Поле объязательно',
              })}
              label="Почта"
              id="floor"
              type="text"
              placeholder="Почта"
              error={errors.email?.message}
            />

            <FormInputBlock
              {...register('password', {
                required: 'Поле объязательно',
              })}
              label="Пароль"
              id="password"
              type="text"
              placeholder="Пароль"
              error={errors.password?.message}
            />

            <FormInputBlock
              {...register('phone', {
                required: 'Поле объязательно',
              })}
              label="Номер телефон"
              id="floorBuild"
              type="text"
              placeholder="Номер пользователя"
              error={errors.phone?.message}
            />

            <FormInputBlock
              {...register('passport', {
                required: 'Поле объязательно',
              })}
              label="Номер Пасспорта"
              id="square"
              type="text"
              placeholder="Номер Пасспорт пользователя"
              error={errors.passport?.message}
            />

            <RadioSelect
              value={watch('role')}
              onChange={(value) =>
                setValue('role', value as 'ADMIN' | 'USER', { shouldValidate: true })
              }
              error={errors.role?.message}
            />
            <DateInput
              date={watch('availabilityPas')}
              setDate={(date) => {
                setValue('availabilityPas', date, { shouldValidate: true });
              }}
            />
            {errors.availabilityPas && (
              <p className="text-sm text-red-500 mt-1">{errors.availabilityPas.message}</p>
            )}

            <Button type="submit">Save changes</Button>
          </form>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
