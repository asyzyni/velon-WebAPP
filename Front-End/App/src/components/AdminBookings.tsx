import { useState, useEffect } from 'react';
import { Calendar, MapPin, CreditCard, Clock, CheckCircle, XCircle, AlertCircle, Eye, Check, X } from 'lucide-react';
import { getAllBookings, updateBookingStatusApi } from '../api/adminBookingApi';

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
  paymentMethod?: string;
  paymentDate?: string;
  createdAt: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const data = await getAllBookings();

    // mapping 
    const mapped = data.map((b: any) => ({
      ...b, id: String(b.id), userId: String(b.userId), carId: String(b.carId), 

      // derived fields 
      carNAme : 'Mobil ${b.carId}',
      carImage : '/car-placehorder.jpg',
      pickupLocation : 'Lokasi Antar',
      notes: "", 
      totalDays : Math.ceil((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24)),
      pricePerDay : b.totalPrice, 
      paymentStatus: b.status === 'CONFIRMED' ? 'paid' : 'pending',
      createdAt : b.startDate,
    }));

    setBookings(mapped);
  }

  const updateBookingStatus = async (bookingId : string, status: Booking['status']) => {
    await updateBookingStatusApi(Number(bookingId), status.toUpperCase());
    loadBookings();
  }

  const updatePaymentStatus = async() => {
    setShowProofModal(false)
  }

  const viewPaymentProof = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowProofModal(true);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Kelola Booking</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Semua ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'confirmed'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Dikonfirmasi ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Belum ada booking</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex gap-4">
                  <img
                    src={booking.carImage}
                    alt={booking.carName}
                    className="w-32 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-gray-900 mb-1">{booking.carName}</h3>
                        <p className="text-gray-500 text-sm">ID: {booking.id}</p>
                        <p className="text-gray-500 text-sm">User ID: {booking.userId}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                          {booking.status === 'pending' && 'Menunggu Konfirmasi'}
                          {booking.status === 'confirmed' && 'Dikonfirmasi'}
                          {booking.status === 'completed' && 'Selesai'}
                          {booking.status === 'cancelled' && 'Dibatalkan'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus === 'unpaid' && 'Belum Bayar'}
                          {booking.paymentStatus === 'pending' && 'Pending Verifikasi'}
                          {booking.paymentStatus === 'paid' && 'Sudah Bayar'}
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

                    {booking.paymentMethod && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="text-gray-700">Metode Pembayaran:</span> {booking.paymentMethod.toUpperCase()}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                            Konfirmasi
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Tolak
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Tandai Selesai
                        </button>
                      )}

                      {booking.paymentProof && booking.paymentStatus === 'pending' && (
                        <button
                          onClick={() => viewPaymentProof(booking)}
                          className="flex items-center gap-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat Bukti Bayar
                        </button>
                      )}

                      {booking.paymentStatus === 'paid' && (
                        <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Pembayaran Terverifikasi
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

      {/* Payment Proof Modal */}
      {showProofModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-gray-900">Verifikasi Pembayaran</h2>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 mb-2">Booking ID: {selectedBooking.id}</p>
                <p className="text-gray-700 mb-2">Total: Rp {selectedBooking.totalPrice.toLocaleString('id-ID')}</p>
                <p className="text-gray-700 mb-4">Metode: {selectedBooking.paymentMethod?.toUpperCase()}</p>
              </div>

              {selectedBooking.paymentProof && (
                <div className="mb-6">
                  <p className="text-gray-700 mb-2">Bukti Pembayaran:</p>
                  <img
                    src={selectedBooking.paymentProof}
                    alt="Payment Proof"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => updatePaymentStatus(selectedBooking.id, 'paid')}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Verifikasi Pembayaran
                </button>
                <button
                  onClick={() => setShowProofModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
