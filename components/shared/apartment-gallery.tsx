'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
interface Props {
  images: string[];
}

export const PreviewGallery = ({ images }: Props) => {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const handleClick = (index: number) => {
    setStartIndex(index);
    setOpen(true);
  };

  return (
    <>
      {/* Превью картинки */}
      <div className="flex flex-wrap gap-3">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Apartment image ${index + 1}`}
            width={120}
            height={80}
            className="rounded-md object-cover cursor-pointer"
            onClick={() => handleClick(index)}
          />
        ))}
      </div>

      {/* Модальное окно */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden ">
          <DialogTitle className="pt-5 pl-5">Gallery</DialogTitle>
          <Swiper
            initialSlide={startIndex}
            navigation
            pagination={{ clickable: true }}
            keyboard
            modules={[Navigation, Pagination, Keyboard]}
            className="w-full h-[70vh]">
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="flex justify-center items-center h-full">
                  <Image
                    src={img}
                    alt={`Slide ${index + 1}`}
                    width={1000}
                    height={600}
                    className="object-contain max-h-[80vh] w-auto"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </DialogContent>
      </Dialog>
    </>
  );
};
