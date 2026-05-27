import React, { useId, useRef, useState } from 'react';
import { Camera, ImagePlus, X } from 'lucide-react';
import { readImageFileAsDataUrl } from './imageUploadUtils';

type ImageUploadVariant = 'banner' | 'card' | 'square';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  onClear?: () => void;
  hint?: string;
  variant?: ImageUploadVariant;
  id?: string;
}

const VARIANT_CLASS: Record<ImageUploadVariant, string> = {
  banner: 'aspect-[21/9] sm:aspect-[3/1]',
  card: 'aspect-[16/10]',
  square: 'aspect-square max-w-[140px]',
};

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  onClear,
  hint = 'JPG, PNG, WebP or GIF · max 5 MB',
  variant = 'card',
  id: idProp,
}) => {
  const autoId = useId();
  const inputId = idProp ?? `image-upload-${autoId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const openPicker = () => inputRef.current?.click();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      onChange(dataUrl);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    void handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    void handleFile(file);
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-xs font-semibold text-stone-700 dark:text-stone-300">
        {label}
      </label>

      <div
        className={`relative rounded-xl border border-dashed border-stone-300 dark:border-stone-600 overflow-hidden bg-stone-50 dark:bg-stone-900/50 ${VARIANT_CLASS[variant]}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {value ? (
          <>
            <img src={value} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-stone-900/0 hover:bg-stone-900/40 transition-colors group">
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                <button
                  type="button"
                  onClick={openPicker}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-stone-900 text-xs font-semibold shadow cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" aria-hidden />
                  Replace
                </button>
                {onClear && (
                  <button
                    type="button"
                    onClick={onClear}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-900/80 text-white text-xs font-semibold cursor-pointer"
                    aria-label="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-stone-500 dark:text-stone-400 hover:bg-stone-100/80 dark:hover:bg-stone-800/50 transition-colors cursor-pointer p-4"
          >
            <ImagePlus className="w-8 h-8 text-stone-400" aria-hidden />
            <span className="text-xs font-semibold">Upload image</span>
            <span className="text-[10px] text-stone-400">or drag and drop</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleInputChange}
      />

      {!value && (
        <button
          type="button"
          onClick={openPicker}
          className="text-xs font-semibold text-[#C51C13] dark:text-orange-400 hover:underline cursor-pointer"
        >
          Choose file
        </button>
      )}

      {hint && <p className="text-[10px] text-stone-500 dark:text-stone-400">{hint}</p>}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
