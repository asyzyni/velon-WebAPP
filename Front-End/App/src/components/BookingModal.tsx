import { useState } from 'react';
import { X, Calendar, MapPin } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const totalDays = calculateDays();
  const totalPrice = totalDays * car.pricePerDay;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    const bookingPayload = {
      userId: Number(user.id),     // 🔥 WAJIB
      carId: Number(car.id),       // 🔥 WAJIB
      startDate,                   // YYYY-MM-DD
      endDate,                     // YYYY-MM-DD
      pickupLocation,
      notes,
    };

    console.log('BOOKING PAYLOAD:', bookingPayload);

    try {
      setLoading(true);

      const result = await createBooking(bookingPayload);

      // Optional: simpan ke localStorage buat BookingHistory FE
      const localBooking = {
        id: result.id,
        userId: user.id,
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
        status: 'WAITING_PAYMENT',
        createdAt: new Date().toISOString(),
      };

      const existing = JSON.parse(
        localStorage.getItem('velon_bookings') || '[]'
      );

      localStorage.setItem(
        'velon_bookings',
        JSON.stringify([...existing, localBooking])
      );

      alert('Pemesanan berhasil! Silakan lanjutkan pembayaran.');
      onClose();

    } catch (error) {
      console.error('Booking error:', error);
      alert('Gagal membuat pemesanan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-gray-900">Pemesanan Mobil</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
            <div>
              <h3 className="text-gray-900 mb-1">{car.name}</h3>
              <p className="text-[#023EBA]">
                Rp {car.pricePerDay.toLocaleString('id-ID')} / hari
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Pickup */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-2" />
              Lokasi Pengambilan
            </label>
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Catatan (Opsional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border rounded-lg resize-none"
            />
          </div>

          {/* Summary */}
          {totalDays > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg border mb-4">
              <div className="flex justify-between">
                <span>Durasi</span>
                <span>{totalDays} hari</span>
              </div>
              <div className="flex justify-between">
                <span>Total Harga</span>
                <span className="text-[#023EBA]">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border px-6 py-3 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#023EBA] to-gray-700 text-white px-6 py-3 rounded-lg"
            >
              {loading ? 'Memproses...' : 'Konfirmasi Pemesanan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}