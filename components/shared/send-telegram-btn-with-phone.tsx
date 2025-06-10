import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';

type ApartmenTg = {
  id: number;
  price: number;
  district: string;
  adress: string;
  room: number;
  floor: number;
  floorBuild: number;
  square: number;
  phone?: string;
  images?: string[]; // Изменили тип на массив строк
};

interface Props {
  className?: string;
  apartment: ApartmenTg;
}

export const SendTelegramBtnWithPhone: React.FC<Props> = ({ className, apartment }) => {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<boolean | null>(null);
  console.log(apartment);
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      setLoading(true);
      setSuccess(null);

      const imagesArray = Array.isArray(apartment.images)
        ? apartment.images
        : typeof apartment.images === 'string'
        ? [apartment.images]
        : [];

      const payload = {
        ...apartment,
        images: imagesArray,
      };

      const res = await axios.post('/api/telegram/withPhoneNumber', payload);

      if (res.data.success) {
        setSuccess(true);
        toast.success('Объявление отправлено в Telegram!');
        console.log(success);
      } else {
        setSuccess(false);
        toast.error(res.data.error || 'Ошибка при отправке');
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      setSuccess(false);
      toast.error(
        axios.isAxiosError(error)
          ? error.response?.data?.error || error.message
          : 'Не удалось отправить объявление',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded disabled:opacity-50 cursor-pointer ${className}`}>
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">↻</span>
        </span>
      ) : (
        '📞'
      )}
    </button>
  );
};
