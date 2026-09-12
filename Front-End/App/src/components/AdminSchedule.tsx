import { useState, useEffect, useMemo } from 'react';
import { getAllCars, type Car as CarType } from '../api/carApi';
import { getAllBookings } from '../api/adminBookingApi';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Car,
  User,
  X,
} from 'lucide-react';

export interface RawBooking {
  id: number;
  carId: number;
  userId: number;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  userName?: string;
  carName?: string;
  paymentToken?: string;
}

export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateKey = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AdminSchedule() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [bookings, setBookings] = useState<RawBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calendar window: 14 days starting from startDateOffset
  const [startDateOffset, setStartDateOffset] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Start 2 days prior to today for nice context
    const d = new Date(today);
    d.setDate(d.getDate() - 2);
    return d;
  });

  const [selectedBooking, setSelectedBooking] = useState<RawBooking | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [carsData, bookingsData] = await Promise.all([
        getAllCars(),
        getAllBookings(),
      ]);
      setCars(carsData);
      setBookings(bookingsData);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat jadwal armada');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const daysToShow = 14;

  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < daysToShow; i++) {
      const d = new Date(startDateOffset);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [startDateOffset]);

  const todayStr = useMemo(() => {
    const now = new Date();
    return formatDateKey(now);
  }, []);

  const handlePrev = () => {
    setStartDateOffset(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNext = () => {
    setStartDateOffset(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(today);
    d.setDate(d.getDate() - 2);
    setStartDateOffset(d);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-blue-600 text-white border-blue-700';
      case 'WAITING_PAYMENT':
      case 'PENDING':
        return 'bg-amber-500 text-white border-amber-600';
      case 'WAITING_CONFIRMATION':
        return 'bg-orange-500 text-white border-orange-600';
      case 'COMPLETED':
        return 'bg-emerald-600 text-white border-emerald-700';
      case 'CANCELLED':
        return 'bg-rose-500 text-white border-rose-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Dikonfirmasi</span>;
      case 'WAITING_PAYMENT':
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Menunggu Pembayaran</span>;
      case 'WAITING_CONFIRMATION':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Menunggu Verifikasi</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Selesai</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">Dibatalkan</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-[#023EBA]" />
              Jadwal Armada
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Kalender visual penyewaan mobil untuk memantau armada yang sedang dan akan disewa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
              title="7 hari sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              Hari Ini
            </button>
            <button
              onClick={handleNext}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
              title="7 hari berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
          <span className="font-semibold text-gray-700">Keterangan:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span>Dikonfirmasi (Aktif)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span>Menunggu Bayar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            <span>Selesai</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span>Dibatalkan</span>
          </div>
        </div>
      </div>

      {/* Main Calendar View */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#023EBA] mb-3" />
          <p>Memuat jadwal armada...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-red-600">
          <p className="font-medium">{error}</p>
          <button
            onClick={loadData}
            className="mt-3 px-4 py-2 bg-[#023EBA] text-white text-sm rounded-lg hover:bg-blue-700"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Date Columns Header */}
              <div className="grid grid-cols-[220px_repeat(14,1fr)] bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                <div className="p-3 border-r border-gray-200 flex items-center gap-2">
                  <Car className="w-4 h-4 text-gray-400" />
                  <span>Armada Mobil</span>
                </div>
                {calendarDays.map((day, idx) => {
                  const key = formatDateKey(day);
                  const isToday = key === todayStr;
                  const dayName = day.toLocaleDateString('id-ID', { weekday: 'short' });
                  const dateNum = day.getDate();
                  const monthName = day.toLocaleDateString('id-ID', { month: 'short' });

                  return (
                    <div
                      key={idx}
                      className={`p-2 text-center border-r border-gray-200 last:border-r-0 ${
                        isToday ? 'bg-blue-50/80 font-bold text-[#023EBA]' : ''
                      }`}
                    >
                      <div className="uppercase tracking-wider text-[10px] text-gray-400">
                        {dayName}
                      </div>
                      <div className={`text-sm mt-0.5 ${isToday ? 'text-[#023EBA]' : 'text-gray-800'}`}>
                        {dateNum}
                      </div>
                      <div className="text-[10px] text-gray-400 font-normal">
                        {monthName}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rows per Car */}
              {cars.map((car) => {
                const carBookings = bookings.filter((b) => b.carId === car.id);

                return (
                  <div
                    key={car.id}
                    className="grid grid-cols-[220px_repeat(14,1fr)] border-b border-gray-100 hover:bg-gray-50/40 transition-colors relative min-h-[64px]"
                  >
                    {/* Car Info Column */}
                    <div className="p-3 border-r border-gray-200 flex flex-col justify-center bg-white z-10">
                      <div className="font-medium text-sm text-gray-900 truncate" title={car.namaMobil}>
                        {car.namaMobil}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="truncate">{car.jenisMobil}</span>
                        <span>•</span>
                        <span className="text-gray-600 font-medium whitespace-nowrap">
                          Rp {(car.hargaPerHari / 1000).toFixed(0)}k/hr
                        </span>
                      </div>
                    </div>

                    {/* Timeline Day Slots */}
                    <div className="col-span-14 grid grid-cols-14 relative h-full">
                      {calendarDays.map((day, idx) => {
                        const key = formatDateKey(day);
                        const isToday = key === todayStr;
                        return (
                          <div
                            key={idx}
                            className={`border-r border-gray-100 last:border-r-0 h-full ${
                              isToday ? 'bg-blue-50/20' : ''
                            }`}
                          />
                        );
                      })}

                      {/* Overlaid Booking Bars */}
                      {carBookings.map((b) => {
                        if (!b.startDate || !b.endDate) return null;
                        const bStart = parseLocalDate(b.startDate);
                        const bEnd = parseLocalDate(b.endDate);

                        const calStart = calendarDays[0];
                        const calEnd = calendarDays[calendarDays.length - 1];

                        // Skip if outside visible 14-day range
                        if (bEnd.getTime() < calStart.getTime() || bStart.getTime() > calEnd.getTime()) {
                          return null;
                        }

                        // Calculate grid start & span
                        const msPerDay = 1000 * 60 * 60 * 24;
                        const startDiffDays = Math.round((bStart.getTime() - calStart.getTime()) / msPerDay);
                        const endDiffDays = Math.round((bEnd.getTime() - calStart.getTime()) / msPerDay);

                        const startIndex = Math.max(0, startDiffDays);
                        const endIndex = Math.min(daysToShow - 1, endDiffDays);
                        const spanDays = Math.max(1, endIndex - startIndex + 1);

                        // Percent position
                        const leftPct = (startIndex / daysToShow) * 100;
                        const widthPct = (spanDays / daysToShow) * 100;

                        const renterDisplayName = b.userName || `User #${b.userId}`;

                        return (
                          <div
                            key={b.id}
                            onClick={() => setSelectedBooking(b)}
                            className={`absolute top-2 bottom-2 rounded-md px-2 py-1 flex items-center cursor-pointer shadow-sm hover:shadow-md hover:brightness-105 transition-all text-xs border ${getStatusColor(
                              b.status
                            )}`}
                            style={{
                              left: `${leftPct}%`,
                              width: `${Math.max(widthPct, 2)}%`,
                              zIndex: 5,
                            }}
                            title={renterDisplayName}
                          >
                            <User className="w-3.5 h-3.5 mr-1 shrink-0" />
                            <span className="truncate font-semibold">{renterDisplayName}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {cars.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Tidak ada armada mobil terdaftar.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-[#023EBA] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <h3 className="text-lg font-bold">Detail Jadwal Booking</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm text-gray-700">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">ID Booking</span>
                <span className="font-mono font-semibold text-gray-900">#{selectedBooking.id}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">Penyewa</span>
                <span className="font-semibold text-gray-900">
                  {selectedBooking.userName || `User #${selectedBooking.userId}`}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">Mobil</span>
                <span className="font-semibold text-gray-900">
                  {selectedBooking.carName ||
                    cars.find((c) => c.id === selectedBooking.carId)?.namaMobil ||
                    `Mobil #${selectedBooking.carId}`}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">Tanggal Sewa</span>
                <span className="font-medium text-gray-900">
                  {selectedBooking.startDate} s/d {selectedBooking.endDate}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">Status</span>
                <div>{getStatusBadge(selectedBooking.status)}</div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500">Total Harga</span>
                <span className="font-bold text-gray-900 text-base text-[#023EBA]">
                  Rp {selectedBooking.totalPrice ? selectedBooking.totalPrice.toLocaleString('id-ID') : '0'}
                </span>
              </div>

              {selectedBooking.paymentToken && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500">Token Pembayaran</span>
                  <span className="font-mono text-xs text-gray-600 truncate max-w-[200px]" title={selectedBooking.paymentToken}>
                    {selectedBooking.paymentToken}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
