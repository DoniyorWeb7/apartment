import axios from 'axios';
import Image from 'next/image';
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
  images?: string[]; // Изменили тип на массив строк
};

interface Props {
  className?: string;
  apartment: ApartmenTg;
}

export const SendTelegramBtn: React.FC<Props> = ({ className, apartment }) => {
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<boolean | null>(null);
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

      const res = await axios.post('/api/telegram/withoutPhoneNumber', payload);

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
      className={`bg-blue-500 hover:bg-blue-800 text-white px-3 py-2 rounded-sm disabled:opacity-50 cursor-pointer w-[40px] h-[36px]  ${className}`}>
      {loading ? (
        <span className="flex  items-center gap-2">
          <span className="animate-spin">↻</span>
        </span>
      ) : (
        <div className="flex items-center justify-center gap-1">
          t <Image src="/tg.png" width={500} height={500} alt="" />
        </div>
      )}
    </button>
  );
};
