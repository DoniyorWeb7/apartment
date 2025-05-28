import { Apartment } from '@prisma/client';
import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';

export const getAll = async (): Promise<Apartment[]> => {
  return (await axiosInstance.get<Apartment[]>(ApiRoutes.APARTMENTS)).data;
};

export const ApartCreate = {
  create: async (data: any) => {
    return axiosInstance.post('/apartments', data);
  },
};
