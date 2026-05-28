import React, { useMemo } from 'react';
import {
  getDistrictsForState,
  getDistrictLabel,
  getStateLabel,
  INDIAN_STATES,
} from '../../indiaLocations';

const SELECT_CLASS =
  'w-full px-4 py-2.5 text-sm bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-colors';

const LABEL_CLASS = 'text-xs font-semibold text-stone-700 dark:text-stone-300';

export interface StateDistrictSelectProps {
  idPrefix?: string;
  state: string;
  district: string;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
  required?: boolean;
  stateLabel?: string;
  districtLabel?: string;
}

export const StateDistrictSelect: React.FC<StateDistrictSelectProps> = ({
  idPrefix = 'location',
  state,
  district,
  onStateChange,
  onDistrictChange,
  required = true,
  stateLabel = 'State *',
  districtLabel = 'District *',
}) => {
  const districts = useMemo(() => getDistrictsForState(state), [state]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStateChange(e.target.value);
    onDistrictChange('');
  };

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-state`} className={LABEL_CLASS}>
          {stateLabel}
          {!required && (
            <span className="font-normal text-stone-500 dark:text-stone-400"> (optional)</span>
          )}
        </label>
        <select
          id={`${idPrefix}-state`}
          value={state}
          onChange={handleStateChange}
          required={required}
          className={SELECT_CLASS}
        >
          <option value="">Select state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor={`${idPrefix}-district`} className={LABEL_CLASS}>
          {districtLabel}
          {!required && (
            <span className="font-normal text-stone-500 dark:text-stone-400"> (optional)</span>
          )}
        </label>
        <select
          id={`${idPrefix}-district`}
          value={district}
          onChange={(e) => onDistrictChange(e.target.value)}
          required={required}
          disabled={!state}
          className={`${SELECT_CLASS} disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <option value="">
            {state ? 'Select district' : 'Select state first'}
          </option>
          {districts.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
        {state && districts.length > 0 && (
          <p className="text-[10px] text-stone-500 dark:text-stone-400">
            {districts.length} districts in {getStateLabel(state)}
          </p>
        )}
      </div>
    </div>
  );
};

export { getDistrictLabel, getStateLabel };
