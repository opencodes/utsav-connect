import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { readImageFileAsDataUrl } from './imageUploadUtils';

interface ServiceImagePickerProps {
  image: string;
  serviceName: string;
  onImageChange: (dataUrl: string) => void;
  layout?: 'banner' | 'thumbnail';
}

export const ServiceImagePicker: React.FC<ServiceImagePickerProps> = ({
  image,
  serviceName,
  onImageChange,
  layout = 'banner',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const pickImage = () => inputRef.current?.click();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      onImageChange(dataUrl);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    }
  };

  if (layout === 'thumbnail') {
    return (
      <div className="shrink-0">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-600 group">
          <img src={image} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={pickImage}
            className="absolute inset-0 flex items-center justify-center bg-stone-900/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label={`Change photo for ${serviceName}`}
          >
            <Camera className="w-4 h-4 text-white" aria-hidden />
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        {error && <p className="text-[10px] text-red-600 mt-1 max-w-[4rem]">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="relative -mx-4 -mt-4 mb-3 h-32 sm:h-36 overflow-hidden rounded-t-xl group">
        <img src={image} alt="" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={pickImage}
          className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-white text-xs font-semibold shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" aria-hidden />
          Change photo
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 px-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
