import axios from 'axios';

export const ApartDelete = async (apartId: number): Promise<void> => {
  console.log("'Попытка удалить квартиры с ID:', ", apartId);

  try {
    await axios.delete(`api/apartments/${apartId}`);
  } catch (error) {
    console.error('Ошибка при удалении:', error);
    throw error;
  }
};
