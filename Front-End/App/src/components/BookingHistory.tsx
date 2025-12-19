import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Calendar, MapPin, CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Booking {
  id: string;
  userId: string;
  carId: string;
  carName: string;
  carImage: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  notes: string;
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'pending' | 'paid';
  paymentProof?: string;
  createdAt: string;
}

interface BookingHistoryProps {
  onPayment: (bookingId: string) => void;
}

export default function BookingHistory({ onPayment }: BookingHistoryProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    loadBookings();
  }, [user]);

  const loadBookings = () => {
    const allBookings = JSON.parse(localStorage.getItem('velon_bookings') || '[]');
    const userBookings = allBookings
      .filter((b: Booking) => b.userId === user?.id)
      .sort((a: Booking, b: Booking) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    setBookings(userBookings);
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'paid': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-5 h-5" />;
      case 'confirmed': return <CheckCircle className="w-5 h-5" />;
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'cancelled': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi';
      case 'confirmed': return 'Dikonfirmasi';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'unpaid': return 'Belum Bayar';
      case 'pending': return 'Menunggu Verifikasi';
      case 'paid': return 'Sudah Bayar';
      default: return status;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Riwayat Sewa</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-gradient-to-r from-[#023EBA] to-gray-700 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-gradient-to-r from-[#023EBA] to-gray-700 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'confirmed'
                ? 'bg-gradient-to-r from-[#023EBA] to-gray-700 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Dikonfirmasi
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-[#023EBA] to-gray-700 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Selesai
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Belum ada riwayat sewa</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex gap-4">
                  {/* Car Image */}
                  <img
                    src={booking.carImage}
                    alt={booking.carName}
                    className="w-32 h-32 object-cover rounded-lg"
                  />

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-gray-900 mb-1">{booking.carName}</h3>
                        <p className="text-gray-500 text-sm">ID: {booking.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {getStatusText(booking.status)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {getPaymentStatusText(booking.paymentStatus)}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(booking.startDate).toLocaleDateString('id-ID')} - {new Date(booking.endDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{booking.totalDays} hari</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{booking.pickupLocation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm">Rp {booking.totalPrice.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="text-gray-700">Catatan:</span> {booking.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {booking.paymentStatus === 'unpaid' && (
                        <button
                          onClick={() => onPayment(booking.id)}
                          className="px-4 py-2 bg-gradient-to-r from-[#023EBA] to-gray-700 text-white rounded-lg hover:from-[#022f8a] hover:to-gray-800 transition-colors"
                        >
                          Bayar Sekarang
                        </button>
                      )}
                      {booking.paymentStatus === 'pending' && (
                        <span className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
                          Menunggu verifikasi pembayaran
                        </span>
                      )}
                      {booking.paymentStatus === 'paid' && (
                        <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                          Pembayaran terverifikasi
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}