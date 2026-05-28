import React from 'react';
import { Minus, Plus } from 'lucide-react';

const INPUT_CLASS =
  'w-full px-4 py-2.5 text-sm bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors';

interface DynamicStringListProps {
  id: string;
  label: string;
  hint?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addButtonLabel?: string;
  required?: boolean;
}

export const DynamicStringList: React.FC<DynamicStringListProps> = ({
  id,
  label,
  hint,
  values,
  onChange,
  placeholder = 'Enter name',
  addButtonLabel = 'Add another',
  required = false,
}) => {
  const updateAt = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  const addRow = () => onChange([...values, '']);

  const removeAt = (index: number) => {
    if (values.length <= 1) {
      onChange(['']);
      return;
    }
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2" id={id}>
      <div>
        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          {label}
          {required ? ' *' : ''}
        </label>
        {hint && (
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{hint}</p>
        )}
      </div>
      <ul className="space-y-2">
        {values.map((value, index) => (
          <li key={`${id}-row-${index}`} className="flex gap-2 items-center">
            <input
              type="text"
              value={value}
              onChange={(e) => updateAt(index, e.target.value)}
              placeholder={placeholder}
              className={INPUT_CLASS}
              aria-label={`${label} ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="shrink-0 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              aria-label={`Remove ${label} ${index + 1}`}
            >
              <Minus className="w-4 h-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C51C13] dark:text-orange-400 hover:underline cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" aria-hidden />
        {addButtonLabel}
      </button>
    </div>
  );
};

export function nonEmptyStrings(values: string[]): string[] {
  return values.map((v) => v.trim()).filter(Boolean);
}
