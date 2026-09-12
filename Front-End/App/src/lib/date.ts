// Shared date helpers for working with the backend's "YYYY-MM-DD" (LocalDate) strings.
// Always parse these as local calendar dates rather than `new Date(str)` directly —
// the latter parses as UTC midnight and can shift a day depending on the viewer's timezone.

export function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function toISODate(d: Date): string {
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
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateRangeID(startISO: string, endISO: string): string {
  return `${formatDateID(startISO)} - ${formatDateID(endISO)}`;
}

export function isSameMonth(dateISO: string, year: number, monthIndex: number): boolean {
  const d = parseISODate(dateISO);
  return d.getFullYear() === year && d.getMonth() === monthIndex;
}
