'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Apartment } from '@prisma/client';

interface EditApartmentFormProps {
  apartment: Apartment;
  onSubmit: (data: Partial<Apartment>) => Promise<void>;
  onCancel: () => void;
}

export const EditApartmentForm = ({ apartment, onSubmit, onCancel }: EditApartmentFormProps) => {
  const { register, handleSubmit } = useForm<
    Omit<Partial<Apartment>, 'availability'> & { availability?: string }
  >({
    defaultValues: {
      status: apartment.status,
      availability: apartment.availability?.toString().slice(0, 10),
      price: apartment.price,
      district: apartment.district,
      adress: apartment.adress,
      room: apartment.room,
      floor: apartment.floor,
      floorBuild: apartment.floorBuild,
      square: apartment.square,
      variant: apartment.variant,
      description: apartment.description,
      owner: apartment.owner,
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        setIsSubmitting(true);
        try {
          const transformed: Partial<Apartment> = {
            ...data,
            availability: data.availability ? new Date(data.availability) : undefined,
          };
          await onSubmit(transformed);
        } finally {
          setIsSubmitting(false);
        }
      })}
      className="space-y-4">
      <Input {...register('status')} placeholder="Статус" />
      <Input {...register('availability')} type="date" />
      <Input {...register('price')} type="number" placeholder="Цена" />
      <Input {...register('district')} placeholder="Район" />
      <Input {...register('adress')} placeholder="Адрес" />
      <Input {...register('room')} type="number" placeholder="Комнаты" />
      <Input {...register('floor')} type="number" placeholder="Этаж" />
      <Input {...register('floorBuild')} type="number" placeholder="Этажей в доме" />
      <Input {...register('square')} type="number" placeholder="Площадь" />
      <Input {...register('variant')} placeholder="Вариант" />
      <Input {...register('description')} placeholder="Описание" />
      <Input {...register('owner')} placeholder="Владелец" />

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
