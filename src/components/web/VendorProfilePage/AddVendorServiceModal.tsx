import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, X } from 'lucide-react';
import type { VendorServiceItem } from '../VendorDetailPage/vendorServicesData';
import { ImageUploadField } from './ImageUploadField';
import vendorPlaceholder from '../../../assets/vendor-placeholder.png';

const INPUT_CLASS =
  'w-full px-4 py-2.5 text-sm bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500';

const LABEL_CLASS = 'text-xs font-semibold text-stone-700 dark:text-stone-300';

export interface NewServiceDraft {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

const EMPTY_DRAFT = (): NewServiceDraft => ({
  name: '',
  description: '',
  price: '',
  category: '',
  image: vendorPlaceholder,
});

interface AddVendorServiceModalProps {
  open: boolean;
  categoryOptions: string[];
  saving?: boolean;
  onClose: () => void;
  onAdd: (service: VendorServiceItem) => void | Promise<void>;
}

export const AddVendorServiceModal: React.FC<AddVendorServiceModalProps> = ({
  open,
  categoryOptions,
  saving = false,
  onClose,
  onAdd,
}) => {
  const [draft, setDraft] = useState<NewServiceDraft>(EMPTY_DRAFT());
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setDraft(EMPTY_DRAFT());
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleClose = () => {
    if (saving) return;
    setDraft(EMPTY_DRAFT());
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim() || !draft.description.trim() || !draft.category) {
      setError('Please fill in service name, category, and description.');
      return;
    }
    const price = Number(draft.price.replace(/,/g, ''));
    if (!Number.isFinite(price) || price <= 0) {
      setError('Enter a valid price greater than zero.');
      return;
    }
    try {
      await onAdd({
        id: `custom-${Date.now()}`,
        name: draft.name.trim(),
        description: draft.description.trim(),
        price,
        category: draft.category,
        rating: 0,
        ratingCount: 0,
        image: draft.image || vendorPlaceholder,
      });
      setDraft(EMPTY_DRAFT());
      setError('');
      onClose();
    } catch {
      // Parent sets error message; keep modal open for corrections.
    }
  };

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-service-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        onClick={handleClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-stone-100 dark:border-stone-700 sticky top-0 bg-white dark:bg-stone-800 z-10">
          <h2
            id="add-service-title"
            className="heading-card text-lg text-stone-900 dark:text-white flex items-center gap-2"
          >
            <Plus className="w-5 h-5 text-[#C51C13] dark:text-orange-400" aria-hidden />
            Add a service
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p
              className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-lg px-3 py-2"
              role="alert"
            >
              {error}
            </p>
          )}

          <ImageUploadField
            label="Service photo"
            value={draft.image}
            onChange={(image) => setDraft((prev) => ({ ...prev, image }))}
            variant="card"
            id="add-service-image"
            hint="Optional. The placeholder will be used if no photo is uploaded."
          />

          <div className="space-y-1.5">
            <label htmlFor="add-service-name" className={LABEL_CLASS}>
              Service name *
            </label>
            <input
              id="add-service-name"
              name="name"
              type="text"
              value={draft.name}
              onChange={handleChange}
              placeholder="e.g. Full-day banquet package"
              className={INPUT_CLASS}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="add-service-category" className={LABEL_CLASS}>
                Category *
              </label>
              <select
                id="add-service-category"
                name="category"
                value={draft.category}
                onChange={handleChange}
                className={INPUT_CLASS}
              >
                <option value="">Select category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="add-service-price" className={LABEL_CLASS}>
                Price (₹) *
              </label>
              <input
                id="add-service-price"
                name="price"
                type="number"
                min={1}
                step={1}
                value={draft.price}
                onChange={handleChange}
                placeholder="15000"
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="add-service-description" className={LABEL_CLASS}>
              Description *
            </label>
            <textarea
              id="add-service-description"
              name="description"
              rows={3}
              value={draft.description}
              onChange={handleChange}
              placeholder="What is included, duration, capacity, etc."
              className={`${INPUT_CLASS} resize-none`}
            />
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400">
            New services appear on your dashboard after save. Public listing updates after a quick
            review.
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#C51C13] hover:bg-[#A2110A] text-white text-sm font-semibold transition-colors cursor-pointer sm:ml-auto disabled:opacity-60"
            >
              <Plus className="w-4 h-4" aria-hidden />
              {saving ? 'Saving…' : 'Add service'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
