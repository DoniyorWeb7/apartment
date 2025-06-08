/* eslint-disable @next/next/no-img-element */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { GripVertical, X } from 'lucide-react';

interface Props {
  image: File;
  isCover: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export const SortableImageCard: React.FC<Props> = ({ image, isCover, onSelect, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: image.name,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative group border rounded-lg overflow-hidden">
      <div
        {...listeners}
        className="absolute top-1 left-1 cursor-grab bg-white/80 p-1 rounded shadow z-10">
        <GripVertical size={16} />
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center z-10 hover:bg-red-600"
        title="Удалить">
        <X size={15} />
      </button>

      <img
        src={URL.createObjectURL(image)}
        alt="preview"
        className={`w-full h-32 object-cover border-2 ${
          isCover ? 'border-blue-500' : 'border-transparent'
        }`}
      />

      <button
        type="button"
        onClick={onSelect}
        className={`absolute bottom-2 right-2 px-2 py-1 text-xs rounded z-10 ${
          isCover ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-300'
        }`}>
        {isCover ? 'Обложка' : 'Выбрать'}
      </button>
    </div>
  );
};
