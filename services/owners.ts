import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { Owner } from '@prisma/client';
interface OwnerData {
  fullName: string;
  phone: string;
}
export const getAll = async (): Promise<Owner[]> => {
  return (await axiosInstance.get<Owner[]>(ApiRoutes.OWNERS)).data;
};

export const OwnerCreate = {
  create: async (data: OwnerData) => {
    return axiosInstance.post('/owner', data);
  },
};

export const OwnerDelete = async (ownerId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/owner/${ownerId}`);
  } catch (error) {
    console.error('Ошибка при удалении:', error);
    throw error;
  }
};
