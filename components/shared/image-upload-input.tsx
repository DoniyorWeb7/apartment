/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface Props {
  onSubmit: (images: File[], cover: File | null) => void;
}

export const ImageUploadInput: React.FC<Props> = ({ onSubmit }) => {
  const [images, setImages] = React.useState<File[]>([]);
  const [cover, setCover] = React.useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      setImages(files);
      onSubmit(files, cover);
    }
  };

  const handleCoverSelect = (image: File) => {
    setCover(image);
    onSubmit(images, image);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-medium">Загрузите изображения (макс. 10)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {images.length > 0 && (
        <div>
          <p className="mb-2 font-medium">Выберите обложку:</p>
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                {/* <Image
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  fill
                  className={`w-full h-32 object-cover rounded-lg border-2 
                    ${cover?.name === image.name ? 'border-blue-500' : 'border-transparent'}`}
                /> */}

                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index}`}
                  className={`w-full h-32 object-cover rounded-lg border-2 
                  ${cover?.name === image.name ? 'border-blue-500' : 'border-transparent'}`}
                />
                <button
                  type="button"
                  onClick={() => handleCoverSelect(image)}
                  className={`absolute bottom-2 right-2 px-2 py-1 text-xs rounded
                    ${
                      cover?.name === image.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-300'
                    }`}>
                  {cover?.name === image.name ? 'Обложка' : 'Выбрать'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
