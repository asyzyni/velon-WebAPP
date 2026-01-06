import { useState } from 'react';
import { X, Calendar, MapPin, Clock } from 'lucide-react';
import { useAuth } from './AuthContext';
import { createBooking } from '../api/bookingApi';

interface Car {
  id: string;
  name: string;
  pricePerDay: number;
  image: string;
}

interface BookingModalProps {
  car: Car;
  onClose: () => void;
}

export default function BookingModal({ car, onClose }: BookingModalProps) {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [notes, setNotes] = useState('');

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const totalDays = calculateDays();
  const totalPrice = totalDays * car.pricePerDay;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookingPayload = {
      userId: user?.id ? Number(user.id) : null,
      carId: Number(car.id),
      startDate,
      endDate,
      pickupLocation,
      notes,
      totalPrice,
    };

    try {
      // Call backend API
      const result = await createBooking(bookingPayload);

      // Also save to localStorage for history display
      const localBooking = {
        id: result.id || `BK${Date.now()}`,
        userId: user?.id,
        carId: car.id,
        carName: car.name,
        carImage: car.image,
        startDate,
        endDate,
        pickupLocation,
        notes,
        totalDays,
        pricePerDay: car.pricePerDay,
        totalPrice,
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: new Date().toISOString(),
      };
      const existingBookings = JSON.parse(localStorage.getItem('velon_bookings') || '[]');
      localStorage.setItem('velon_bookings', JSON.stringify([...existingBookings, localBooking]));

      alert('Pemesanan berhasil! Silakan lakukan pembayaran.');
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      alert('Gagal membuat pemesanan. Silakan coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">Pemesanan Mobil</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Car Info */}
          <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={car.image}
              alt={car.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-gray-900 mb-2">{car.name}</h3>
              <p className="text-[#023EBA]">
                Rp {car.pricePerDay.toLocaleString('id-ID')} / hari
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Lokasi Pengambilan
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Contoh: Jl. Sudirman No. 123, Jakarta"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan khusus untuk pemesanan Anda..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>

          {/* Summary */}
          {totalDays > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-gray-900 mb-3">Ringkasan Pemesanan</h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Durasi Sewa:</span>
                  <span>{totalDays} hari</span>
                </div>
                <div className="flex justify-between">
                  <span>Harga per Hari:</span>
                  <span>Rp {car.pricePerDay.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-300">
                  <span>Total Harga:</span>
                  <span className="text-[#023EBA]">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#023EBA] to-gray-700 text-white rounded-lg hover:from-[#022f8a] hover:to-gray-800 transition-colors"
            >
              Konfirmasi Pemesanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}