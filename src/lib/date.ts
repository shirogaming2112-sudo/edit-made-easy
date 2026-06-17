/**
 * Date utilities — every visible date in the app should use MM/DD/YYYY.
 */
export function formatDateMDY(input: Date | string | null | undefined): string {
  if (!input) return '';
  const d = input instanceof Date ? input : new Date(input);
  if (isNaN(d.getTime())) return typeof input === 'string' ? input : '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export function parseDateMDY(s: string): Date | null {
  if (!s) return null;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2]));
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/** Convert any date-ish value (ISO, MDY, Date) to MM/DD/YYYY. */
export function toMDY(value: string | Date | null | undefined): string {
  if (!value) return '';
  if (typeof value === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) return value;
  return formatDateMDY(value);
}
