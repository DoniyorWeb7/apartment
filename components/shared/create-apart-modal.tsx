'use client';

import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { SelectInput } from './select-input';
import { Textarea } from '../ui/textarea';
import { ImageUploadInput } from './image-upload-input';
import { DateInput } from './date-input';
import { FormInputBlock } from './form-input-block';
import { ApartCreate } from '@/services/apartments';
import { Owner, User } from '@prisma/client';
import { Api } from '@/services/api-client';
import toast from 'react-hot-toast';

interface Props {
  className?: string;
  onApartAdded: () => void;
}

export interface MyForm {
  user?: string;
  owner?: string;
  district?: string;
  adress?: string;
  room?: string;
  floor?: number;
  floorBuild?: number;
  square?: number;
  variant?: string;
  status?: string;
  description?: string;
  price?: number;
}

export const CreateApartModal: React.FC<Props> = ({ onApartAdded }) => {
  const [images, setImages] = React.useState<File[]>([]);
  const [cover, setCover] = React.useState<File | null>(null);
  const [date, setDate] = React.useState<Date>();
  const [username, setUsername] = React.useState<User[]>([]);
  const [owner, setOwner] = React.useState<Owner[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const fetchUsers = async () => {
    try {
      const users = await Api.users.getAll();
      setUsername(users);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const fetchOwners = async () => {
    try {
      const owner = await Api.owners.getAll();
      setOwner(owner);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  React.useEffect(() => {
    fetchUsers();
    fetchOwners();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MyForm>({
    mode: 'onTouched',
    defaultValues: {
      user: '',
      owner: '',
      district: '',
      adress: '',
      room: '',
      floor: undefined,
      floorBuild: undefined,
      square: undefined,
      variant: 'No',
      status: '',
      description: '',
      price: undefined,
    },
  });

  const onSubmit: SubmitHandler<MyForm> = async (data) => {
    const formData = new FormData();

    formData.append('status', data.status || 'Активна');
    formData.append('availability', date ? date.toISOString() : new Date().toISOString());
    formData.append('price', String(data.price ?? 0));
    formData.append('district', data.district || '');
    formData.append('owner', data.owner || '');
    formData.append('adress', data.adress || '');
    formData.append('room', String(data.room || ''));
    formData.append('floor', String(data.floor || ''));
    formData.append('floorBuild', String(data.floorBuild || ''));
    formData.append('square', String(data.square || ''));
    formData.append('variant', String(data.variant || ''));
    formData.append('description', data.description || '');

    // Добавляем изображения
    if (cover) {
      formData.append('cover', cover); // Добавляем файл обложки
    }

    images.forEach((image) => {
      formData.append('images', image); // Добавляем каждый файл изображения
    });

    try {
      setIsLoading(true);
      const res = await ApartCreate.create(formData);
      toast.success('Квартира успешно создана! ID: ' + res.data.id);
      onApartAdded();
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      toast.error('Ошибка при отправке данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageData = (imgs: File[], coverImage: File | null) => {
    setImages(imgs);
    setCover(coverImage);
  };

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

  const userTypeOptions = username.map((user) => ({
    label: user.username,
    value: user.username,
  }));

  const ownerTypeOptions = owner.map((owner) => ({
    label: `${owner.fullName}  ${owner.phone}`,
    value: owner.phone,
  }));

  const statusOptions = [
    { label: 'Занят', value: 'Занят' },
    { label: 'Свободен', value: 'Свободен' },
  ];

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
          <DialogTitle>Создать новую квартиру</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-scroll">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="user"
              control={control}
              rules={{ required: 'Выберите владельца пользователя' }}
              render={({ field }) => (
                <SelectInput
                  title="Пользователь как владелец"
                  nameLabel="Выберите владельца пользователя"
                  valueInput={field.value}
                  onChange={field.onChange}
                  error={errors.user?.message}
                  options={userTypeOptions}
                />
              )}
            />

            <Controller
              name="owner"
              control={control}
              rules={{ required: 'Выберите владельца пользователя' }}
              render={({ field }) => (
                <SelectInput
                  title="Пользователь как владелец"
                  nameLabel="Выберите владельца пользователя"
                  valueInput={field.value}
                  onChange={field.onChange}
                  error={errors.owner?.message}
                  options={ownerTypeOptions}
                />
              )}
            />

            <Controller
              name="district"
              control={control}
              rules={{ required: 'Выберите Район' }}
              render={({ field }) => (
                <SelectInput
                  title="Район"
                  nameLabel="Выберите"
                  valueInput={field.value}
                  onChange={field.onChange}
                  error={errors.district?.message}
                  options={districtOptions}
                />
              )}
            />
            {/* <FormInputBlock
              {...register('owner', {
                required: 'Поле объязательно',
                minLength: { value: 5, message: 'Минимум 5 символов' },
              })}
              label="Владелец"
              id="owner"
              type="text"
              placeholder="Владелец"
              error={errors.owner?.message}
            /> */}
            <FormInputBlock
              {...register('adress', {
                required: 'Поле объязательно',
                minLength: { value: 5, message: 'Минимум 5 символов' },
              })}
              label="Адрес"
              id="adress"
              type="text"
              placeholder="Адрес"
              error={errors.adress?.message}
            />

            <FormInputBlock
              {...register('room', {
                required: 'Поле объязательно',
              })}
              label="Количество комнат"
              id="room"
              type="text"
              placeholder="Количество комнат"
              error={errors.room?.message}
            />

            <FormInputBlock
              {...register('floor', {
                required: 'Поле объязательно',
              })}
              label="Этаж"
              id="floor"
              type="text"
              placeholder="Этаж"
              error={errors.floor?.message}
            />

            <FormInputBlock
              {...register('floorBuild', {
                required: 'Поле объязательно',
              })}
              label="Этажность здания"
              id="floorBuild"
              type="text"
              placeholder="Этажность здания"
              error={errors.floorBuild?.message}
            />

            <FormInputBlock
              {...register('square', {
                required: 'Поле объязательно',
              })}
              label="Площадь"
              id="square"
              type="number"
              placeholder="Площадь"
              error={errors.square?.message}
            />
            <p className="text-[12px]">кв.м</p>

            {/* <div className="flex flex-col gap-3 mt-2 mb-3">
              <Controller
                name="variant"
                control={control}
                rules={{ required: 'Выберите вариант' }}
                render={({ field }) => (
                  <SelectInput
                    title="Вариант"
                    nameLabel="Выберите вариант"
                    valueInput={field.value}
                    onChange={(val) => field.onChange(val)}
                    error={errors.variant?.message}
                    options={variantOptions}
                  />
                )}
              />
            </div> */}

            <Controller
              name="status"
              control={control}
              rules={{ required: 'Выберите статус' }}
              render={({ field }) => (
                <SelectInput
                  title="Статус"
                  nameLabel="Выберите статус"
                  valueInput={field.value}
                  onChange={(val) => field.onChange(val)}
                  error={errors.status?.message}
                  options={statusOptions}
                />
              )}
            />

            <div className="grid w-full gap-3">
              <Label htmlFor="message">Описание</Label>
              <Textarea
                {...register('description')}
                placeholder="Введите здесь свое описание."
                id="message"
              />
            </div>
            <div className="text-red-500 text-[14px]">
              {errors?.square && <p>{errors?.description?.message || 'Error!'}</p>}
            </div>

            <FormInputBlock
              {...register('price', {
                required: 'Поле объязательно',
                valueAsNumber: true,
                validate: (value) => /^\d+$/.test(String(value)) || 'Только цифры',
              })}
              label="Цена"
              id="price"
              type="text"
              placeholder="Цена"
              error={errors.price?.message}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, '');
              }}
            />

            <DateInput date={date} setDate={setDate} />
            <ImageUploadInput onSubmit={handleImageData} />

            <Button
              className={isLoading ? 'bg-gray-500 hover:bg-gray-500 pointer-events-none' : ''}
              type="submit">
              {isLoading ? 'Сохрянается' : 'Сохранить'}
            </Button>
          </form>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
