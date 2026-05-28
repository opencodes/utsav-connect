import rawData from './data/india-states-districts.json';

type RawStateEntry = {
  state: string;
  districts: string[];
};

type RawData = {
  states: RawStateEntry[];
};

const data = rawData as RawData;

export type LocationOption = {
  value: string;
  label: string;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildCatalog(): {
  states: LocationOption[];
  districtsByState: Record<string, LocationOption[]>;
  stateLabelByValue: Record<string, string>;
  districtLabelByValue: Record<string, Record<string, string>>;
} {
  const states: LocationOption[] = [];
  const districtsByState: Record<string, LocationOption[]> = {};
  const stateLabelByValue: Record<string, string> = {};
  const districtLabelByValue: Record<string, Record<string, string>> = {};

  for (const entry of data.states) {
    const stateValue = slugify(entry.state);
    states.push({ value: stateValue, label: entry.state });
    stateLabelByValue[stateValue] = entry.state;
    districtLabelByValue[stateValue] = {};

    districtsByState[stateValue] = entry.districts.map((district) => {
      const districtValue = slugify(district);
      districtLabelByValue[stateValue][districtValue] = district;
      return { value: districtValue, label: district };
    });

    districtsByState[stateValue].sort((a, b) => a.label.localeCompare(b.label));
  }

  states.sort((a, b) => a.label.localeCompare(b.label));

  return { states, districtsByState, stateLabelByValue, districtLabelByValue };
}

const catalog = buildCatalog();

export const INDIAN_STATES: LocationOption[] = catalog.states;

export function getDistrictsForState(stateValue: string): LocationOption[] {
  if (!stateValue) return [];
  return catalog.districtsByState[stateValue] ?? [];
}

export function getStateLabel(stateValue: string): string {
  return catalog.stateLabelByValue[stateValue] ?? stateValue;
}

export function getDistrictLabel(stateValue: string, districtValue: string): string {
  return catalog.districtLabelByValue[stateValue]?.[districtValue] ?? districtValue;
}

export function formatStateDistrict(stateValue: string, districtValue: string): string {
  const district = getDistrictLabel(stateValue, districtValue);
  const state = getStateLabel(stateValue);
  if (!district && !state) return '';
  if (!state) return district;
  if (!district) return state;
  return `${district}, ${state}`;
}

/** Primary location string stored on vendor listing (district + state). */
export function primaryLocationFromValues(stateValue: string, districtValue: string): string {
  return formatStateDistrict(stateValue, districtValue);
}

/** Resolve state/district from API fields (supports legacy `city`-only records). */
export function resolveStateDistrictFromVendor(vendor: {
  state?: string;
  district?: string;
  city?: string;
}): { state: string; district: string } {
  if (vendor.state && vendor.district) {
    return { state: vendor.state, district: vendor.district };
  }
  const legacy = (vendor.city ?? vendor.district ?? '').trim();
  if (!legacy) return { state: '', district: '' };

  for (const state of INDIAN_STATES) {
    const match = getDistrictsForState(state.value).find((d) => d.value === legacy);
    if (match) return { state: state.value, district: match.value };
  }

  return { state: '', district: legacy };
}
