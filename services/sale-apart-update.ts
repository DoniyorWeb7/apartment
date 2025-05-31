import { SaleApartment } from '@prisma/client';
import { axiosInstance } from './instance';

export const saleApartUpdata = async (
  apartId: number,
  data: Partial<SaleApartment> & { images?: File[]; cover?: File | null },
) => {
  const formData = new FormData();

  // Добавляем текстовые данные
  formData.append('status', data.status || '');
  formData.append('availability', data.availability?.toISOString() || new Date().toISOString());
  formData.append('price', String(data.price || 0));
  formData.append('district', data.district || '');
  formData.append('adress', data.adress || '');
  formData.append('room', String(data.room || ''));
  formData.append('floor', String(data.floor || ''));
  formData.append('floorBuild', String(data.floorBuild || ''));
  formData.append('square', String(data.square || ''));
  formData.append('variant', data.variant || '');
  formData.append('description', data.description || '');
  formData.append('owner', data.owner || '');

  // Добавляем файлы, если они есть
  if (data.cover) {
    formData.append('cover', data.cover);
  }

  if (data.images) {
    data.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const response = await axiosInstance.put(`saleApart/${apartId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
