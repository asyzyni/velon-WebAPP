import { useState } from 'react';
import { useAuth } from './AuthContext';
import CarCatalog from './CarCatalog';
import BookingHistory from './BookingHistory';
import PaymentPage from './PaymentPage';
import HomePage from './HomePage';
import { Car, History, LogOut, User, Home } from 'lucide-react';

type Page = 'home' | 'catalog' | 'history' | 'payment';

export default function UserDashboard() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const handlePayment = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setCurrentPage('payment');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#023EBA] via-blue-700 to-gray-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8" />
              <h1 className="text-2xl">Velon</h1>
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
              onClick={() => setCurrentPage('home')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                currentPage === 'home'
                  ? 'border-[#023EBA] text-[#023EBA]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setCurrentPage('catalog')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                currentPage === 'catalog'
                  ? 'border-[#023EBA] text-[#023EBA]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Car className="w-5 h-5" />
              <span>Katalog Mobil</span>
            </button>
            <button
              onClick={() => setCurrentPage('history')}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                currentPage === 'history'
                  ? 'border-[#023EBA] text-[#023EBA]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="w-5 h-5" />
              <span>Riwayat Sewa</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'catalog' && <CarCatalog />}
        {currentPage === 'history' && <BookingHistory onPayment={handlePayment} />}
        {currentPage === 'payment' && selectedBookingId && (
          <PaymentPage 
            bookingId={selectedBookingId} 
            onBack={() => setCurrentPage('history')}
          />
        )}
      </main>
    </div>
  );
}