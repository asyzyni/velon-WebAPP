// Shared date helpers for working with the backend's "YYYY-MM-DD" (LocalDate) strings.
// Always parse these as local calendar dates rather than `new Date(str)` directly —
// the latter parses as UTC midnight and can shift a day depending on the viewer's timezone.

export function parseISODate(s: string): Date {
  if (!s || typeof s !== 'string') return new Date(NaN);
  const clean = s.split('T')[0].trim();
  const parts = clean.split('-');
  if (parts.length !== 3) return new Date(NaN);
  const [y, m, d] = parts.map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return new Date(NaN);
  return new Date(y, m - 1, d);
}

export function toISODate(d: Date): string {
  if (!(d instanceof Date) || isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatDateID(s: string): string {
  const d = parseISODate(s);
  if (isNaN(d.getTime())) return s || '-';
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateRangeID(startISO: string, endISO: string): string {
  if (!startISO && !endISO) return '-';
  if (!endISO) return formatDateID(startISO);
  if (!startISO) return formatDateID(endISO);
  return `${formatDateID(startISO)} - ${formatDateID(endISO)}`;
}

export function isSameMonth(dateISO: string, year: number, monthIndex: number): boolean {
  const d = parseISODate(dateISO);
  if (isNaN(d.getTime())) return false;
  return d.getFullYear() === year && d.getMonth() === monthIndex;
}
