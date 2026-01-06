import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CreditCard, Building2, Smartphone, CheckCircle } from 'lucide-react';
import { getBookingbyId } from '../api/bookingApi';
import { uploadPaymentProofApi } from '../api/paymentApi';

interface Booking {
  id: string;
  carName: string;
  carImage: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  pickupLocation: string;
}

interface PaymentPageProps {
  bookingId: string;
  onBack: () => void;
}

export default function PaymentPage({ bookingId, onBack }: PaymentPageProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'ewallet'>('transfer');
  const [selectedBank, setSelectedBank] = useState('bca');
  const [selectedEwallet, setSelectedEwallet] = useState('gopay');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const loadBookings = async () => {
      const data = await getBookingbyId(Number(bookingId));

      setBooking({
        id: String(data.id),
        carName: 'Mobil ${data.carId}',
        carImage: "/car-placeholder.png",
        startDate: data.startDate,
        endDate: data.endDate,
        totalDays: Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)),
        totalPrice: data.totalPrice,
        pickupLocation: "office",
      });
    };
    loadBookings();
  }, [bookingId]);
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile) {
      alert('Silakan upload bukti pembayaran.');
      return;
    }

    const method = paymentMethod === 'transfer' ? selectedBank : selectedEwallet;

    try {
      await uploadPaymentProofApi(
        Number(bookingId),
        proofFile, method
      );
      setIsSubmitted(true);
    } catch (error) {
  };

  const banks = [
    { id: 'bca', name: 'BCA', account: '1234567890', holder: 'PT Velon Rental' },
    { id: 'mandiri', name: 'Mandiri', account: '0987654321', holder: 'PT Velon Rental' },
    { id: 'bni', name: 'BNI', account: '5555666677', holder: 'PT Velon Rental' },
  ];

  const ewallets = [
    { id: 'gopay', name: 'GoPay', number: '0812-3456-7890' },
    { id: 'ovo', name: 'OVO', number: '0812-3456-7890' },
    { id: 'dana', name: 'DANA', number: '0812-3456-7890' },
  ];

  if (!booking) {
    return <div>Loading...</div>;
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-gray-900 mb-2">Pembayaran Berhasil Dikirim!</h2>
          <p className="text-gray-600 mb-6">
            Bukti pembayaran Anda sedang diverifikasi. Kami akan mengirimkan konfirmasi dalam 1x24 jam.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-[#023EBA] to-gray-700 text-white rounded-lg hover:from-[#022f8a] hover:to-gray-800 transition-colors"
          >
            Kembali ke Riwayat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Kembali
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-gray-900 mb-6">Pembayaran</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-gray-700 mb-3">Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === 'transfer'
                        ? 'border-sky-600 bg-sky-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building2 className={`w-6 h-6 mx-auto mb-2 ${
                      paymentMethod === 'transfer' ? 'text-sky-600' : 'text-gray-400'
                    }`} />
                    <span className={paymentMethod === 'transfer' ? 'text-sky-600' : 'text-gray-600'}>
                      Transfer Bank
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ewallet')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === 'ewallet'
                        ? 'border-sky-600 bg-sky-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Smartphone className={`w-6 h-6 mx-auto mb-2 ${
                      paymentMethod === 'ewallet' ? 'text-sky-600' : 'text-gray-400'
                    }`} />
                    <span className={paymentMethod === 'ewallet' ? 'text-sky-600' : 'text-gray-600'}>
                      E-Wallet
                    </span>
                  </button>
                </div>
              </div>

              {/* Bank Selection */}
              {paymentMethod === 'transfer' && (
                <div>
                  <label className="block text-gray-700 mb-3">Pilih Bank</label>
                  <div className="space-y-2">
                    {banks.map(bank => (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          selectedBank === bank.id
                            ? 'border-sky-600 bg-sky-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={selectedBank === bank.id ? 'text-sky-600' : 'text-gray-900'}>
                              {bank.name}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{bank.account}</p>
                            <p className="text-sm text-gray-500">a.n. {bank.holder}</p>
                          </div>
                          {selectedBank === bank.id && (
                            <CheckCircle className="w-6 h-6 text-sky-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* E-Wallet Selection */}
              {paymentMethod === 'ewallet' && (
                <div>
                  <label className="block text-gray-700 mb-3">Pilih E-Wallet</label>
                  <div className="space-y-2">
                    {ewallets.map(ewallet => (
                      <button
                        key={ewallet.id}
                        type="button"
                        onClick={() => setSelectedEwallet(ewallet.id)}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          selectedEwallet === ewallet.id
                            ? 'border-sky-600 bg-sky-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={selectedEwallet === ewallet.id ? 'text-sky-600' : 'text-gray-900'}>
                              {ewallet.name}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{ewallet.number}</p>
                          </div>
                          {selectedEwallet === ewallet.id && (
                            <CheckCircle className="w-6 h-6 text-sky-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Payment Proof */}
              <div>
                <label className="block text-gray-700 mb-3">
                  Upload Bukti Pembayaran
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {proofPreview ? (
                    <div>
                      <img
                        src={proofPreview}
                        alt="Preview"
                        className="max-h-64 mx-auto mb-4 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setProofFile(null);
                          setProofPreview('');
                        }}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600 mb-1">Klik untuk upload</p>
                      <p className="text-sm text-gray-500">PNG, JPG hingga 5MB</p>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        required
                      />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#023EBA] to-gray-700 text-white rounded-lg hover:from-[#022f8a] hover:to-gray-800 transition-colors"
              >
                Kirim Bukti Pembayaran
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h3 className="text-gray-900 mb-4">Ringkasan Pesanan</h3>
            
            <div className="mb-4">
              <img
                src={booking.carImage}
                alt={booking.carName}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <p className="text-gray-900">{booking.carName}</p>
            </div>

            <div className="space-y-2 py-4 border-t border-b border-gray-200">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Durasi Sewa</span>
                <span>{booking.totalDays} hari</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tanggal</span>
                <span>
                  {new Date(booking.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - 
                  {new Date(booking.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Lokasi</span>
                <span className="text-right">{booking.pickupLocation.substring(0, 20)}...</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Pembayaran</span>
                <span className="text-[#023EBA]">
                  Rp {booking.totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}