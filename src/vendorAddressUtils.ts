export type VendorAddressFields = {
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  pinCode: string;
  state: string;
  district: string;
};

export function formatBusinessAddress(fields: VendorAddressFields): string {
  const parts = [
    fields.addressLine1.trim(),
    fields.addressLine2.trim(),
    fields.landmark.trim(),
    fields.pinCode.trim() ? `PIN ${fields.pinCode.trim()}` : '',
  ].filter(Boolean);
  return parts.join(', ');
}

export function isBusinessAddressComplete(fields: VendorAddressFields): boolean {
  return (
    Boolean(fields.addressLine1.trim()) &&
    Boolean(fields.pinCode.trim()) &&
    /^\d{6}$/.test(fields.pinCode.trim()) &&
    Boolean(fields.state.trim()) &&
    Boolean(fields.district.trim())
  );
}
