import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableImageCard } from './SortableImageCard';
interface Props {
  onSubmit: (images: File[], cover: File | null) => void;
}

export const ImageUploadInput: React.FC<Props> = ({ onSubmit }) => {
  const [images, setImages] = React.useState<File[]>([]);
  const [cover, setCover] = React.useState<File | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      setImages(files);
      onSubmit(files, cover);
    }
  };

  const handleDeleteImage = (imageToDelete: File) => {
    const updatedImages = images.filter((img) => img.name !== imageToDelete.name);
    const newCover = cover?.name === imageToDelete.name ? null : cover;
    setImages(updatedImages);
    setCover(newCover);
    onSubmit(updatedImages, newCover);
  };

  const handleCoverSelect = (image: File) => {
    setCover(image);
    onSubmit(images, image);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.name === active.id);
      const newIndex = images.findIndex((img) => img.name === over.id);
      const newImages = arrayMove(images, oldIndex, newIndex);
      setImages(newImages);
      onSubmit(newImages, cover);
    }
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
              items={images.map((img) => img.name)}
              strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-3 gap-3">
                {images.map((image) => (
                  <SortableImageCard
                    key={image.name}
                    image={image}
                    isCover={cover?.name === image.name}
                    onSelect={() => handleCoverSelect(image)}
                    onDelete={() => handleDeleteImage(image)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};
