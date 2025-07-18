'use client';

import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import type { Apartment, Owner } from '@prisma/client';
import { SelectInput } from './select-input';
import { DateInput } from './date-input';
import { ImageUploadInput } from './image-upload-input';
import { FormInputBlock } from './form-input-block';
import { Textarea } from '../ui/textarea';
import { Api } from '@/services/api-client';
import toast from 'react-hot-toast';

interface EditApartmentFormProps {
  apartment: Apartment;
  onSubmit: (data: Partial<Apartment> & { images?: File[]; cover?: File | null }) => Promise<void>;
  onCancel: () => void;
}

export const EditApartmentForm = ({ apartment, onSubmit, onCancel }: EditApartmentFormProps) => {
  const [images, setImages] = React.useState<File[]>([]);
  const [cover, setCover] = React.useState<File | null>(null);
  const [date, setDate] = React.useState<Date | undefined>(new Date(apartment.availability));
  const [owner, setOwner] = React.useState<Owner[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const owner = await Api.owners.getAll();
        setOwner(owner);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Partial<Apartment>>({
    defaultValues: {
      status: apartment.status,
      price: apartment.price,
      district: apartment.district,
      adress: apartment.adress,
      room: apartment.room,
      floor: apartment.floor,
      floorBuild: apartment.floorBuild,
      square: apartment.square,
      // variant: apartment.variant,
      description: apartment.description,
      owner: apartment.owner,
    },
  });

  const districtOptions = [
    { label: 'Все', value: '' },
    { label: 'Алмазар', value: 'Алмазар' },
    { label: 'Бектемир ', value: 'Бектемир' },
    { label: 'Мирабад', value: 'Мирабад' },
    { label: 'Мирзо-Улугбек', value: 'Мирзо-Улугбек' },
    { label: 'Сергели', value: 'Сергели' },
    { label: 'Чиланзар', value: 'Чиланзар' },
    { label: 'Шайхантаур', value: 'Шайхантаур' },
    { label: 'Юнусабад', value: 'Юнусабад' },
    { label: 'Яккасарай', value: 'Яккасарай' },
    { label: 'Яшнабад', value: 'Яшнабад' },
    { label: 'Учтепа', value: 'Учтепа' },
  ];

  const ownerOptions = owner.map((owner) => ({
    label: `${owner.fullName} ${owner.phone}`,
    value: owner.phone,
  }));

  // const variantOptions = [
  //   { label: 'Предоплата', value: '1' },
  //   { label: 'Депозит', value: '2' },
  // ];

  const statusOptions = [
    { label: 'Занят', value: 'Занят' },
    { label: 'Свободен', value: 'Свободен' },
  ];

  const handleImageData = (imgs: File[], coverImage: File | null) => {
    setImages(imgs);
    setCover(coverImage);
  };

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        setIsSubmitting(true);
        try {
          const transformed = {
            ...data,
            availability: date,
            images,
            cover,
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await onSubmit(transformed as any);
        } catch (error) {
          toast.error('Ошибка при обновлении квартиры');
          console.error(error);
        } finally {
          setIsSubmitting(false);
        }
      })}
      className="space-y-4">
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <SelectInput
            title="Статус"
            nameLabel="Выберите статус"
            valueInput={field.value}
            onChange={field.onChange}
            options={statusOptions}
          />
        )}
      />

      <DateInput date={date} setDate={setDate} />

      <FormInputBlock
        {...register('price', {
          required: 'Поле обязательно',
          valueAsNumber: true,
        })}
        label="Цена"
        id="price"
        type="number"
        placeholder="Цена"
        error={errors.price?.message}
      />

      <Controller
        name="district"
        control={control}
        render={({ field }) => (
          <SelectInput
            title="Район"
            nameLabel="Выберите район"
            valueInput={field.value}
            onChange={field.onChange}
            options={districtOptions}
          />
        )}
      />

      <FormInputBlock
        {...register('adress', {
          required: 'Поле обязательно',
          minLength: { value: 5, message: 'Минимум 5 символов' },
        })}
        label="Адрес"
        id="adress"
        type="text"
        placeholder="Адрес"
        error={errors.adress?.message}
      />

      <Controller
        name="owner"
        control={control}
        render={({ field }) => (
          <SelectInput
            title="Владелец"
            nameLabel="Выберите владельца"
            valueInput={field.value}
            onChange={field.onChange}
            options={ownerOptions}
          />
        )}
      />

      <FormInputBlock
        {...register('room', {
          required: 'Поле обязательно',
          valueAsNumber: true,
        })}
        label="Комнаты"
        id="room"
        type="number"
        placeholder="Количество комнат"
        error={errors.room?.message}
      />

      <FormInputBlock
        {...register('floor', {
          required: 'Поле обязательно',
          valueAsNumber: true,
        })}
        label="Этаж"
        id="floor"
        type="number"
        placeholder="Этаж"
        error={errors.floor?.message}
      />

      <FormInputBlock
        {...register('floorBuild', {
          required: 'Поле обязательно',
          valueAsNumber: true,
        })}
        label="Этажей в доме"
        id="floorBuild"
        type="number"
        placeholder="Этажей в доме"
        error={errors.floorBuild?.message}
      />

      <FormInputBlock
        {...register('square', {
          required: 'Поле обязательно',
          valueAsNumber: true,
        })}
        label="Площадь"
        id="square"
        type="number"
        placeholder="Площадь"
        error={errors.square?.message}
      />

      {/* <Controller
        name="variant"
        control={control}
        render={({ field }) => (
          <SelectInput
            title="Вариант"
            nameLabel="Выберите вариант"
            valueInput={field.value}
            onChange={field.onChange}
            options={variantOptions}
          />
        )}
      /> */}

      <div className="grid w-full gap-1.5">
        <label htmlFor="description">Описание</label>
        <Textarea
          {...register('description')}
          placeholder="Введите описание квартиры"
          id="description"
        />
      </div>

      <ImageUploadInput onSubmit={handleImageData} />

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
