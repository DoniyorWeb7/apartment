import axios from 'axios';

export const deleteUser = async (userId: number): Promise<void> => {
  console.log('Попытка удалить пользователя с ID:', userId);
  try {
    await axios.delete(`api/users/${userId}`);
  } catch (error) {
    console.error('Ошибка при удалении:', error);
    throw error;
  }
};
