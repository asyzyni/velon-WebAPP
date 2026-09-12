import { useEffect, useMemo, useState } from 'react';
import { Car as CarIcon, CheckCircle, Calendar, ClipboardList, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from './AuthContext';
import { getAllCars, type Car } from '../api/carApi';
import { getAllBookings } from '../api/adminBookingApi';
import { parseISODate, formatDateID } from '../lib/date';
import { bookingStatusMeta } from '../lib/bookingStatus';

interface RawBooking {
  id: number;
  carId: number;
  userId: number;
  userName?: string;
  carName?: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('');
}

export default function AdminOverview() {
  const { user } = useAuth();
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<RawBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [carsData, bookingsData] = await Promise.all([getAllCars(), getAllBookings()]);
        setCars(carsData);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Failed to load dashboard overview:', err);
        setError('Gagal memuat data dashboard.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const today = new Date();

  const carsById = useMemo(() => {
    const map = new Map<number, Car>();
    cars.forEach(c => map.set(c.id, c));
    return map;
  }, [cars]);

  const rentedCarIds = useMemo(() => {
    const ids = new Set<number>();
    bookings.forEach(b => {
      if (b.status !== 'CONFIRMED') return;
      const start = parseISODate(b.startDate);
      const end = parseISODate(b.endDate);
      const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (now >= start && now <= end) ids.add(b.carId);
    });
    return ids;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  const totalMobil = cars.length;
  const sedangDisewa = rentedCarIds.size;
  const mobilTersedia = cars.filter(
    c => (!c.status || c.status.toUpperCase() === 'AVAILABLE') && !rentedCarIds.has(c.id)
  ).length;
  const totalBooking = bookings.length;

  const stats = [
    { label: 'Total Mobil', value: totalMobil, icon: CarIcon, color: 'bg-blue-500' },
    { label: 'Mobil Tersedia', value: mobilTersedia, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Sedang Disewa', value: sedangDisewa, icon: Calendar, color: 'bg-yellow-500' },
    { label: 'Total Booking', value: totalBooking, icon: ClipboardList, color: 'bg-purple-500' },
  ];

  /* ---------- revenue this month vs last month (real, from booking data) ---------- */

  const revenueByMonth = (yearArg: number, monthIndex: number) =>
    bookings
      .filter(b => (b.status === 'CONFIRMED' || b.status === 'COMPLETED'))
      .filter(b => {
        const d = parseISODate(b.startDate);
        return d.getFullYear() === yearArg && d.getMonth() === monthIndex;
      })
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const thisMonthRevenue = revenueByMonth(today.getFullYear(), today.getMonth());
  const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthRevenue = revenueByMonth(lastMonthDate.getFullYear(), lastMonthDate.getMonth());
  const revenueDeltaPct =
    lastMonthRevenue > 0 ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : null;

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => parseISODate(b.startDate).getTime() - parseISODate(a.startDate).getTime())
      .slice(0, 8);
  }, [bookings]);

  if (loading) {
    return <div className="text-gray-500 text-sm py-12 text-center">Memuat dashboard...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Overview</h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 mb-1 text-sm">{stat.label}</p>
                    <p className="text-3xl text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Booking Terbaru</h3>
            </div>
            {recentBookings.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">Belum ada booking.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="py-2 pr-4 font-normal">No</th>
                      <th className="py-2 pr-4 font-normal">Nama Pelanggan</th>
                      <th className="py-2 pr-4 font-normal">Mobil</th>
                      <th className="py-2 pr-4 font-normal">Tanggal</th>
                      <th className="py-2 pr-4 font-normal">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b, idx) => {
                      const car = carsById.get(b.carId);
                      const meta = bookingStatusMeta(b.status);
                      return (
                        <tr key={b.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-3 pr-4 text-gray-500">{idx + 1}</td>
                          <td className="py-3 pr-4 text-gray-900">
                            {b.userName || `User #${b.userId}`}
                          </td>
                          <td className="py-3 pr-4 text-gray-700">
                            {b.carName || car?.namaMobil || `Mobil #${b.carId}`}
                          </td>
                          <td className="py-3 pr-4 text-gray-500">{formatDateID(b.startDate)}</td>
                          <td className="py-3 pr-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${meta.bg} ${meta.border} ${meta.text}`}>
                              {meta.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#023EBA] text-white flex items-center justify-center text-lg font-semibold mb-3">
              {user?.name ? initials(user.name) : 'A'}
            </div>
            <p className="text-gray-900">{user?.name || 'Admin'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="mt-2 px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 uppercase">
              {user?.role || 'admin'}
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-500 text-sm mb-1">Pendapatan Bulan Ini</p>
            <p className="text-2xl text-gray-900 mb-1">
              Rp {thisMonthRevenue.toLocaleString('id-ID')}
            </p>
            {revenueDeltaPct !== null ? (
              <div className={`flex items-center gap-1 text-xs ${revenueDeltaPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {revenueDeltaPct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{revenueDeltaPct >= 0 ? '+' : ''}{revenueDeltaPct}% dari bulan lalu</span>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Belum ada data bulan lalu untuk dibandingkan</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
