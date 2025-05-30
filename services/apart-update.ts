import { Apartment } from '@prisma/client';
import { axiosInstance } from './instance';

export const apartUpdata = async (apartId: number, data: Partial<Apartment>) => {
  const response = await axiosInstance.put(`apartments/${apartId}`, data);
  return response.data;
};
