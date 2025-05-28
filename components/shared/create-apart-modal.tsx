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
import { CreateCheckbox } from './create-checkbox';
import { Textarea } from '../ui/textarea';
import { ImageUploadInput } from './image-upload-input';
import { DateInput } from './date-input';
import { FormInputBlock } from './form-input-block';
import { ApartCreate } from '@/services/apartments';
import { User } from '@prisma/client';
import { Api } from '@/services/api-client';

interface Props {
  className?: string;
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

export const CreateApartModal: React.FC<Props> = ({}) => {
  const [images, setImages] = React.useState<File[]>([]);
  const [cover, setCover] = React.useState<File | null>(null);
  const [date, setDate] = React.useState<Date>();
  const [username, setUsername] = React.useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const users = await Api.users.getAll();
      setUsername(users);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  React.useEffect(() => {
    fetchUsers();
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
      variant: '',
      status: '',
      description: '',
      price: undefined,
    },
  });

  const onSubmit: SubmitHandler<MyForm> = async (data) => {
    const formData = new FormData();

    // Добавляем текстовые данные
    formData.append('status', data.status || 'Активна');
    formData.append('availability', date ? date.toISOString() : new Date().toISOString());
    formData.append('price', String(data.price ?? 0));
    formData.append('district', data.district || '');
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
      const res = await ApartCreate.create(formData);
      alert('Квартира успешно создана! ID: ' + res.data.id);
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      alert('Ошибка при отправке данных');
    }
  };

  // const onSubmit: SubmitHandler<MyForm> = async (data) => {э
  //   const formData = new FormData();
  //   formData.append('status', data.status || 'Активна');
  //   formData.append('availability', date ? date.toISOString() : new Date().toISOString());
  //   formData.append('price', String(data.price ?? 0));
  //   formData.append('district', data.district || '');
  //   formData.append('room', String(data.room || ''));
  //   formData.append('floor', String(data.floor || ''));
  //   formData.append('floorBuild', String(data.floorBuild || ''));
  //   formData.append('square', String(data.square || ''));
  //   formData.append('variant', String(data.variant || ''));
  //   formData.append('description', data.description || '');
  //   console.log('Отправляем images:', images);
  //   console.log('Отправляем cover:', cover);
  //   if (cover) {
  //     formData.append('cover', cover.name);
  //   }

  //   images.forEach((image) => {
  //     formData.append('images', image); // Ключ 'images' несколько раз для каждого файла
  //   });
  //   try {
  //     const res = await ApartCreate.create(formData);
  //     alert('Квартира успешно создана! ID: ' + res.data.id);
  //   } catch (error) {
  //     console.error('Ошибка при отправке формы:', error);
  //     alert('Ошибка при отправке данных');
  //   }
  //   console.log({ ...data, images, cover, date });
  // };

  const handleImageData = (imgs: File[], coverImage: File | null) => {
    setImages(imgs);
    setCover(coverImage);
  };

  const districtOptions = [
    { label: 'Алмазарский район', value: 'Алмазарский район' },
    { label: 'Бектемирский район', value: 'Бектемирский район' },
    { label: 'Мирабадский район', value: 'Мирабадский район' },
    { label: 'Мирзо-Улугбекский район', value: 'Мирзо-Улугбекский район' },
    { label: 'Сергелийский район', value: 'Сергелийский район' },
    { label: 'Чиланзарский район', value: 'Чиланзарский район' },
    { label: 'Шайхантаурский район', value: 'Шайхантаурский район' },
    { label: 'Юнусабадский район', value: 'Юнусабадский район' },
    { label: 'Яшнабадский район', value: 'Яшнабадский район' },
    { label: 'Учтепинский район', value: 'Учтепинский район' },
  ];

  const userTypeOptions = username.map((user) => ({
    label: user.username,
    value: user.username,
  }));

  const variantOptions = [
    { label: 'Предоплата', value: '1' },
    { label: 'Депозит', value: '2' },
  ];

  const statusOptions = [
    { label: 'Занят', value: '1' },
    { label: 'Свободен', value: '2' },
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
            {/* <Controller
              name="owner"
              control={control}
              rules={{ required: 'Выберите владельца ' }}
              render={({ field }) => (
                <SelectInput
                  title="Владелец"
                  nameLabel="Выберите владельца"
                  valueInput={field.value}
                  onChange={field.onChange}
                  error={errors.owner?.message}
                  options={ownerTypeOptions}
                />
              )}
            /> */}

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
            <FormInputBlock
              {...register('owner', {
                required: 'Поле объязательно',
                minLength: { value: 5, message: 'Минимум 5 символов' },
              })}
              label="Владелец"
              id="owner"
              type="text"
              placeholder="Владелец"
              error={errors.owner?.message}
            />
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
              type="text"
              placeholder="Площадь"
              error={errors.square?.message}
            />
            <p className="text-[12px]">кв.м</p>

            <div className="flex flex-col gap-3 mt-2 mb-3">
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
            </div>

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
                {...register('description', {
                  required: 'Введите описание',
                  minLength: { value: 10, message: 'Минимум 10 символов' },
                })}
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
              })}
              label="Цена"
              id="price"
              type="text"
              placeholder="Цена"
              error={errors.price?.message}
            />

            <DateInput date={date} setDate={setDate} />
            <ImageUploadInput onSubmit={handleImageData} />

            <Button type="submit">Save changes</Button>
          </form>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
