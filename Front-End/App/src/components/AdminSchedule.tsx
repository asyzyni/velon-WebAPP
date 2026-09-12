import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Car as CarIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  X,
} from 'lucide-react';
import { getAllCars, type Car } from '../api/carApi';
import {
  getAllBookings,
  approveBooking,
  cancelBooking,
  markBookingAsCompleted,
} from '../api/adminBookingApi';
import { parseISODate, toISODate, formatDateRangeID, MONTHS_ID } from '../lib/date';
import { BOOKING_STATUS_META, BOOKING_STATUS_ORDER, bookingStatusMeta } from '../lib/bookingStatus';

/* ================= TYPES ================= */

interface RawBooking {
  id: number;
  carId: number;
  userId: number;
  userName?: string;
  carName?: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  status: string;
  totalPrice: number;
}

/* ================= CONSTANTS ================= */

const DOW = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const DAY_WIDTH = 34;
const LABEL_WIDTH = 220;

/* ================= COMPONENT ================= */

export default function AdminSchedule() {
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<RawBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const isMounted = useRef(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [carsData, bookingsData] = await Promise.all([
        getAllCars(),
        getAllBookings(),
      ]);
      if (!isMounted.current) return;
      setCars(Array.isArray(carsData) ? carsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (err) {
      if (!isMounted.current) return;
      console.error('Failed to load schedule data:', err);
      setError('Gagal memuat data jadwal. Coba muat ulang halaman.');
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    load();
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* ---------- month math ---------- */

  const today = new Date();
  const todayISO = toISODate(today);

  const viewDate = useMemo(() => {
    return new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthOffset]);

  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDow = new Date(year, monthIndex, 1).getDay();
  const isCurrentMonth = year === today.getFullYear() && monthIndex === today.getMonth();

  const days = useMemo(() => {
    const arr: { num: number; dow: string; isWeekend: boolean; isToday: boolean }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = (firstDow + (d - 1)) % 7;
      arr.push({
        num: d,
        dow: DOW[dow],
        isWeekend: dow === 0 || dow === 6,
        isToday: isCurrentMonth && d === today.getDate(),
      });
    }
    return arr;
  }, [daysInMonth, firstDow, isCurrentMonth]);

  /* ---------- "today" summary (independent of the month being viewed) ---------- */

  const pickupsToday = bookings.filter(
    b => b.startDate?.split('T')[0] === todayISO && b.status === 'CONFIRMED'
  ).length;
  const returnsToday = bookings.filter(
    b => b.endDate?.split('T')[0] === todayISO && b.status === 'CONFIRMED'
  ).length;
  const waitingConfirmation = bookings.filter(
    b => b.status === 'WAITING_CONFIRMATION'
  ).length;

  /* ---------- clip a booking's range to the visible month ---------- */

  const clampToMonth = (b: RawBooking): { startDay: number; endDay: number } | null => {
    const monthStart = new Date(year, monthIndex, 1);
    const monthEnd = new Date(year, monthIndex, daysInMonth);
    const start = parseISODate(b.startDate);
    const end = parseISODate(b.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    if (end < start) return null;
    if (end < monthStart || start > monthEnd) return null;
    const clippedStart = start < monthStart ? monthStart : start;
    const clippedEnd = end > monthEnd ? monthEnd : end;
    return { startDay: clippedStart.getDate(), endDay: clippedEnd.getDate() };
  };

  const carsRendered = useMemo(() => {
    return cars.map(car => {
      const carBookings = bookings
        .filter(b => Number(b.carId) === Number(car.id))
        .map(b => ({ booking: b, range: clampToMonth(b) }))
        .filter((x): x is { booking: RawBooking; range: { startDay: number; endDay: number } } => x.range !== null)
        .map(({ booking, range }) => {
          const meta = bookingStatusMeta(booking.status);
          const left = (range.startDay - 1) * DAY_WIDTH + 2;
          const width = (range.endDay - range.startDay + 1) * DAY_WIDTH - 4;
          return { booking, meta, left, width };
        });
      return { car, bookings: carBookings };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    });
  }, [cars, bookings, year, monthIndex, daysInMonth]);

  const selectedBooking = bookings.find(b => b.id === selectedId) ?? null;
  const selectedCar = selectedBooking
    ? cars.find(c => Number(c.id) === Number(selectedBooking.carId)) ?? null
    : null;

  const runAction = async (fn: () => Promise<unknown>) => {
    setActionBusy(true);
    try {
      await fn();
      if (!isMounted.current) return;
      await load();
      if (isMounted.current) {
        setSelectedId(null);
      }
    } catch (err) {
      if (!isMounted.current) return;
      console.error('Booking action failed:', err);
      setError('Aksi gagal dijalankan. Coba lagi.');
    } finally {
      if (isMounted.current) {
        setActionBusy(false);
      }
    }
  };

  /* ================= RENDER ================= */

  if (loading) {
    return <div className="text-gray-500 text-sm py-12 text-center">Memuat jadwal...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Jadwal Armada</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Today summary strip */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#023EBA]/10 text-[#023EBA] flex items-center justify-center flex-shrink-0">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl text-gray-900 leading-tight">{pickupsToday}</p>
            <p className="text-xs text-gray-500">Diambil Hari Ini</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl text-gray-900 leading-tight">{returnsToday}</p>
            <p className="text-xs text-gray-500">Dikembalikan Hari Ini</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl text-gray-900 leading-tight">{waitingConfirmation}</p>
            <p className="text-xs text-gray-500">Menunggu Konfirmasi</p>
          </div>
        </div>
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMonthOffset(o => o - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-sm font-medium text-gray-900 min-w-[140px] text-center">
              {MONTHS_ID[monthIndex]} {year}
            </div>
            <button
              onClick={() => setMonthOffset(o => o + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMonthOffset(0)}
              className="ml-1 px-3 py-1.5 rounded-lg border border-[#023EBA] text-[#023EBA] text-sm hover:bg-[#023EBA]/5"
            >
              Hari Ini
            </button>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {BOOKING_STATUS_ORDER.map(key => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm border ${BOOKING_STATUS_META[key].bg} ${BOOKING_STATUS_META[key].border}`} />
                <span className="text-xs text-gray-500">{BOOKING_STATUS_META[key].label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <div style={{ minWidth: 'max-content' }}>
            {/* Day header row */}
            <div className="flex border-b border-gray-100">
              <div style={{ width: LABEL_WIDTH }} className="flex-shrink-0" />
              {days.map(d => (
                <div
                  key={d.num}
                  style={{ width: DAY_WIDTH }}
                  className={`flex-shrink-0 text-center py-2 border-r border-gray-50 ${
                    d.isToday ? 'bg-indigo-50' : d.isWeekend ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className={`text-sm font-semibold ${d.isToday ? 'text-[#023EBA]' : 'text-gray-700'}`}>
                    {d.num}
                  </div>
                  <div className="text-[9px] uppercase text-gray-400">{d.dow}</div>
                </div>
              ))}
            </div>

            {/* Car rows */}
            {cars.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400">Belum ada data mobil.</div>
            )}
            {carsRendered.map(({ car, bookings: carBookings }) => (
              <div key={car.id} className="flex border-b border-gray-100">
                <div style={{ width: LABEL_WIDTH }} className="flex-shrink-0 flex items-center gap-3 px-4 py-2.5">
                  <div className="w-10 h-10 rounded-lg bg-[#023EBA]/10 text-[#023EBA] flex items-center justify-center flex-shrink-0">
                    <CarIcon className="w-[18px] h-[18px]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{car.namaMobil}</div>
                    <div className="text-xs text-gray-500 truncate">{car.jenisMobil} • {car.kapasitas} Kursi</div>
                  </div>
                </div>
                <div
                  style={{ width: daysInMonth * DAY_WIDTH, height: 64 }}
                  className="relative flex-shrink-0"
                >
                  {days.map((d, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: idx * DAY_WIDTH,
                        width: DAY_WIDTH,
                        borderRight: '1px solid #F9FAFB',
                        background: d.isToday ? '#F0F5FF' : undefined,
                      }}
                    />
                  ))}
                  {carBookings.length === 0 && (
                    <div className="absolute inset-0 flex items-center pl-4">
                      <span className="text-xs text-gray-400 italic">Tidak ada booking</span>
                    </div>
                  )}
                  {carBookings.map(({ booking, meta, left, width }) => (
                    <button
                      key={booking.id}
                      onClick={() => setSelectedId(booking.id)}
                      title={`Booking #${booking.id} • ${booking.userName || `User #${booking.userId}`}`}
                      style={{ position: 'absolute', top: 10, bottom: 10, left, width }}
                      className={`rounded-lg border-[1.5px] px-2.5 flex items-center text-xs font-semibold overflow-hidden whitespace-nowrap text-ellipsis hover:shadow-md hover:-translate-y-px transition-all ${meta.bg} ${meta.border} ${meta.text} ${
                        booking.status === 'CANCELLED' ? 'opacity-60 line-through' : ''
                      }`}
                    >
                      {booking.userName || `User #${booking.userId}`}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selectedBooking && (
        <>
          <div
            className="fixed inset-0 bg-black/35 z-40"
            onClick={() => setSelectedId(null)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-[380px] bg-white shadow-2xl z-50 p-6 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900 font-semibold">Detail Booking</h3>
              <button
                onClick={() => setSelectedId(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-900">
                {selectedBooking.carName || (selectedCar ? selectedCar.namaMobil : `Mobil #${selectedBooking.carId}`)}
              </div>
              <span
                className={`inline-flex mt-2 px-2.5 py-1 rounded-md text-xs font-semibold border ${bookingStatusMeta(selectedBooking.status).bg} ${bookingStatusMeta(selectedBooking.status).border} ${bookingStatusMeta(selectedBooking.status).text}`}
              >
                {bookingStatusMeta(selectedBooking.status).label}
              </span>
            </div>

            <div className="border-t border-gray-100" />

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Penyewa</span>
                <span className="text-gray-900 font-medium">
                  {selectedBooking.userName || `User #${selectedBooking.userId}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal</span>
                <span className="text-gray-900 font-medium text-right">
                  {formatDateRangeID(selectedBooking.startDate, selectedBooking.endDate)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-500">Total</span>
                <span className="text-[#023EBA] font-semibold">
                  Rp {(selectedBooking.totalPrice || 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="mt-auto flex gap-2">
              {(selectedBooking.status === 'WAITING_PAYMENT' || selectedBooking.status === 'WAITING_CONFIRMATION') && (
                <>
                  <button
                    disabled={actionBusy}
                    onClick={() => runAction(() => approveBooking(String(selectedBooking.id)))}
                    className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-medium disabled:opacity-50 hover:bg-green-700 transition-colors"
                  >
                    Konfirmasi
                  </button>
                  <button
                    disabled={actionBusy}
                    onClick={() => runAction(() => cancelBooking(String(selectedBooking.id)))}
                    className="flex-1 py-2 rounded-lg border border-red-500 text-red-600 text-sm font-medium disabled:opacity-50 hover:bg-red-50 transition-colors"
                  >
                    Batalkan
                  </button>
                </>
              )}
              {selectedBooking.status === 'CONFIRMED' && (
                <>
                  <button
                    disabled={actionBusy}
                    onClick={() => runAction(() => markBookingAsCompleted(String(selectedBooking.id)))}
                    className="flex-1 py-2 rounded-lg bg-[#023EBA] text-white text-sm font-medium disabled:opacity-50 hover:bg-blue-800 transition-colors"
                  >
                    Tandai Selesai
                  </button>
                  <button
                    disabled={actionBusy}
                    onClick={() => runAction(() => cancelBooking(String(selectedBooking.id)))}
                    className="flex-1 py-2 rounded-lg border border-red-500 text-red-600 text-sm font-medium disabled:opacity-50 hover:bg-red-50 transition-colors"
                  >
                    Batalkan
                  </button>
                </>
              )}
              {(selectedBooking.status === 'COMPLETED' || selectedBooking.status === 'CANCELLED' || selectedBooking.status === 'REFUNDED') && (
                <button
                  onClick={() => setSelectedId(null)}
                  className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Tutup
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
