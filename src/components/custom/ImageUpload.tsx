
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UploadCloud, X, GripVertical } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface UploadableFile extends File {
  _id: string; // Unique ID for each file instance
}

interface SortableItemProps {
  file: UploadableFile;
  id: string;
  onRemove: (file: UploadableFile) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ file, id, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="relative w-24 h-24"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className="w-full h-full border rounded-lg overflow-hidden">
        {preview && <img src={preview} alt={`preview ${file.name}`} className="w-full h-full object-cover" />}
      </div>
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder image"
        className="absolute top-1/2 -left-2 -translate-y-1/2 bg-gray-700 text-white rounded-full p-1 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <button
        onClick={() => onRemove(file)}
        aria-label={`Remove ${file.name}`}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};


interface ImageUploadProps {
  onFilesUpdate: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFilesUpdate }) => {
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      toast({        title: 'File upload error',        description: 'You can only upload a maximum of 6 images.',        variant: 'destructive',      });
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFiles = await Promise.all(
        acceptedFiles.map(async file => {
          const compressedFile = await imageCompression(file, options);
          // Assign a unique ID to each file
          return Object.assign(compressedFile, { _id: Date.now().toString() + Math.random().toString(36).substr(2, 9) });
        })
      );
      const newFiles = [...files, ...compressedFiles].slice(0, 6);
      setFiles(newFiles);
      onFilesUpdate(newFiles);
    } catch (error) {
      console.error('Error compressing images:', error);
      toast({        title: 'Image compression error',        description: 'There was an error while compressing the images.',        variant: 'destructive',      });
    }
  }, [files, onFilesUpdate]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items) {
        const imageFiles = [];
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              imageFiles.push(file);
            }
          }
        }
        if (imageFiles.length > 0) {
          onDrop(imageFiles, []);
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/gif': [],
    },
    maxFiles: 6,
  });

  const removeFile = (fileToRemove: UploadableFile) => {
    const newFiles = files.filter(file => file._id !== fileToRemove._id);
    setFiles(newFiles);
    onFilesUpdate(newFiles);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        onFilesUpdate(newItems);
        return newItems;
      });
    }
  };

  return (
    <div className="grid gap-4">
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-green-500 bg-green-900/30' : 'border-gray-600 hover:border-green-500'}`}
      >
        <input {...getInputProps({ multiple: true, capture: 'environment' })} />
        <div className="flex flex-col items-center justify-center">
          <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
          {isDragActive ?
            <p className="text-green-400">Drop the files here ...</p> :
            <p className="text-gray-400">Drag & drop, click, or use camera</p>}
        </div>
      </div>
      {files.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={files.map(f => f._id)} strategy={rectSortingStrategy}>
            <motion.div
              className="flex flex-wrap gap-4"
              variants={{              hidden: { opacity: 0 },              show: {                opacity: 1,                transition: {                  staggerChildren: 0.05,                },              },            }}
              initial="hidden"
              animate="show"
            >
              {files.map((file) => (
                <SortableItem key={file._id} id={file._id} file={file} onRemove={removeFile} />
              ))}
            </motion.div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ImageUpload;
