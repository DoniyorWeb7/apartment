import { Owner } from '@prisma/client';
import { axiosInstance } from './instance';

export const ownerUpdate = async (ownerId: number, data: Partial<Owner>) => {
  const response = await axiosInstance.put(`/owners/${ownerId}`, data);
  return response.data;
};
