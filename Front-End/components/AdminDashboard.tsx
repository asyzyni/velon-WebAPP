import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Car, LogOut, User, LayoutDashboard, Calendar, CheckCircle, XCircle } from 'lucide-react';
import AdminBookings from './AdminBookings';

type Page = 'dashboard' | 'bookings';

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Total Mobil', value: '6', icon: Car, color: 'bg-blue-500' },
    { label: 'Mobil Tersedia', value: '5', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Sedang Disewa', value: '1', icon: Calendar, color: 'bg-yellow-500' },
    { label: 'Total Booking', value: '0', icon: User, color: 'bg-purple-500' },
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
                <h1 className="text-2xl">Velon Admin</h1>
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
                  ? 'border-[#023EBA] text-[#023EBA]'
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
                  ? 'border-[#023EBA] text-[#023EBA]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Kelola Booking</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'dashboard' && (
          <div>
            <h2 className="text-gray-900 mb-6">Overview</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 mb-1">{stat.label}</p>
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
              <h3 className="text-gray-900 mb-4">Selamat Datang, Admin!</h3>
              <p className="text-gray-600">
                Gunakan menu navigasi di atas untuk mengelola sistem rental mobil Velon. 
                Anda dapat melihat dan mengelola semua booking yang masuk dari pelanggan.
              </p>
            </div>
          </div>
        )}

        {currentPage === 'bookings' && <AdminBookings />}
      </main>
    </div>
  );
}