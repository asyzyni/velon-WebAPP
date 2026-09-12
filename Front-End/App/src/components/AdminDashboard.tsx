import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Car, LogOut, User, LayoutDashboard, Calendar, CheckCircle, CalendarDays } from 'lucide-react';
import AdminBookings from './AdminBookings';
import AdminSchedule, { parseLocalDate } from './AdminSchedule';
import { getAllCars, type Car as CarType } from '../api/carApi';
import { getAllBookings } from '../api/adminBookingApi';

type Page = 'dashboard' | 'bookings' | 'schedule';

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { user, logout } = useAuth();

  const [cars, setCars] = useState<CarType[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      setLoading(true);
      setError(false);
      try {
        const [carsData, bookingsData] = await Promise.all([
          getAllCars(),
          getAllBookings(),
        ]);
        if (isMounted) {
          setCars(carsData);
          setBookings(bookingsData);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Active confirmed rentals
  const activeBookings = bookings.filter((b) => {
    if (b.status !== 'CONFIRMED' || !b.startDate || !b.endDate) return false;
    const start = parseLocalDate(b.startDate);
    const end = parseLocalDate(b.endDate);
    return start.getTime() <= today.getTime() && today.getTime() <= end.getTime();
  });

  const activeCarIds = new Set(activeBookings.map((b) => Number(b.carId)));

  const totalMobilVal = loading ? '…' : error ? '-' : String(cars.length);
  const totalBookingVal = loading ? '…' : error ? '-' : String(bookings.length);
  const sedangDisewaVal = loading ? '…' : error ? '-' : String(activeBookings.length);

  // Mobil Tersedia: cars not currently rented AND car status is AVAILABLE
  const availableCarsCount = cars.filter((car) => {
    const isRented = activeCarIds.has(Number(car.id));
    const isAvailableStatus = !car.status || car.status.toUpperCase() === 'AVAILABLE';
    return !isRented && isAvailableStatus;
  }).length;

  const mobilTersediaVal = loading ? '…' : error ? '-' : String(availableCarsCount);

  const stats = [
    { label: 'Total Mobil', value: totalMobilVal, icon: Car, color: 'bg-blue-500' },
    { label: 'Mobil Tersedia', value: mobilTersediaVal, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Sedang Disewa', value: sedangDisewaVal, icon: Calendar, color: 'bg-yellow-500' },
    { label: 'Total Booking', value: totalBookingVal, icon: User, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#023EBA] via-blue-700 to-gray-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Velon Admin</h1>
                <p className="text-sm text-indigo-100">Dashboard Administrator</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <User className="w-5 h-5" />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors backdrop-blur-sm"
              >
                <LogOut className="w-5 h-5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                currentPage === 'dashboard'
                  ? 'border-[#023EBA] text-[#023EBA] font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentPage('bookings')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                currentPage === 'bookings'
                  ? 'border-[#023EBA] text-[#023EBA] font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Kelola Booking</span>
            </button>
            <button
              onClick={() => setCurrentPage('schedule')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                currentPage === 'schedule'
                  ? 'border-[#023EBA] text-[#023EBA] font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarDays className="w-5 h-5" />
              <span>Jadwal</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'dashboard' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Selamat Datang, Admin!</h3>
              <p className="text-gray-600">
                Gunakan menu navigasi di atas untuk mengelola sistem rental mobil Velon. 
                Anda dapat melihat ringkasan armada, mengelola booking masuk, serta memantau kalender jadwal sewa armada mobil secara real-time.
              </p>
            </div>
          </div>
        )}

        {currentPage === 'bookings' && <AdminBookings />}
        {currentPage === 'schedule' && <AdminSchedule />}
      </main>
    </div>
  );
}