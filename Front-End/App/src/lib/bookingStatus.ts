// Shared status metadata for booking statuses coming from the backend's BookingStatus enum
// (com.velon.model.entity.BookingStatus: WAITING_PAYMENT, CONFIRMED, CANCELLED, COMPLETED,
// REFUNDED, WAITING_CONFIRMATION). Used by the admin schedule and dashboard overview so both
// screens agree on what each status means and looks like.

export type BookingStatusKey =
  | 'WAITING_PAYMENT'
  | 'WAITING_CONFIRMATION'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface StatusStyle {
  label: string;
  bg: string;
  border: string;
  text: string;
}

export const BOOKING_STATUS_META: Record<BookingStatusKey, StatusStyle> = {
  WAITING_PAYMENT: { label: 'Menunggu Pembayaran', bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-800' },
  WAITING_CONFIRMATION: { label: 'Menunggu Konfirmasi', bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-800' },
  CONFIRMED: { label: 'Terkonfirmasi', bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800' },
  COMPLETED: { label: 'Selesai', bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700' },
  CANCELLED: { label: 'Dibatalkan', bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-800' },
  REFUNDED: { label: 'Dana Dikembalikan', bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-800' },
};

export const BOOKING_STATUS_ORDER: BookingStatusKey[] = [
  'WAITING_PAYMENT',
  'WAITING_CONFIRMATION',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
];

export function bookingStatusMeta(status: string): StatusStyle {
  return BOOKING_STATUS_META[status as BookingStatusKey] ?? BOOKING_STATUS_META.WAITING_PAYMENT;
}
