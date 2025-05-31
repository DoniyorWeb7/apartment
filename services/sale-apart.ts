import { SaleApartment } from '@prisma/client';
import { ApiRoutes } from './constants';
import { axiosInstance } from './instance';

export const getAll = async (): Promise<SaleApartment[]> => {
  return (await axiosInstance.get<SaleApartment[]>(ApiRoutes.SALE_APART)).data;
};

export const SaleApartCreate = {
  create: async (data: any) => {
    return axiosInstance.post('/saleApart', data);
  },
};
