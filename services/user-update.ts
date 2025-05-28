import { User } from '@prisma/client';
import { axiosInstance } from './instance';

export const userUpdate = async (userId: number, data: Partial<User>) => {
  const response = await axiosInstance.put(`/users/${userId}`, data);
  return response.data;
};
