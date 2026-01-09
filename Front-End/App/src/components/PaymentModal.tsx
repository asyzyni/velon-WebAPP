import { useEffect, useState } from 'react';
import { X, Calendar, MapPin, CreditCard, Upload, Check } from 'lucide-react';
import { uploadPaymentProofApi } from '../api/paymentApi';

interface PaymentModalProps {
    bookingId: number;
    onClose: () => void;
}

interface Booking {
    id: number;
    userId: number;
    carId: number;
    startDate: string;
    endDate: string;
    pickupLocation: string;
    totalPrice: number;
    status: string;
}

interface Car {
    id: number;
    namaMobil: string;
    jenisMobil: string;
    hargaPerHari: number;
    kapasitas: number;
    status: string;
}

type PaymentMethod = 'transfer' | 'ewallet';

const BANKS = [
    { id: 'bca', name: 'BCA', accountNumber: '1234567890', accountName: 'a.n. PT Velon Rental' },
    { id: 'mandiri', name: 'Mandiri', accountNumber: '0987654321', accountName: 'a.n. PT Velon Rental' },
    { id: 'bni', name: 'BNI', accountNumber: '5555666677', accountName: 'a.n. PT Velon Rental' },
];

export default function PaymentModal({ bookingId, onClose }: PaymentModalProps) {
    const [booking, setBooking] = useState<Booking | null>(null);
    const [car, setCar] = useState<Car | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer');
    const [selectedBank, setSelectedBank] = useState<string>('bca');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        console.log('=== PAYMENT MODAL OPENED ===');
        console.log('Booking ID:', bookingId);

        // Fetch booking details
        fetch(`http://localhost:8081/bookings/${bookingId}`)
            .then(res => {
                console.log('Booking response status:', res.status);
                if (!res.ok) {
                    throw new Error(`Failed to fetch booking: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('✅ Booking data received:', data);
                setBooking(data);

                // Fetch car details
                console.log('Fetching car with ID:', data.carId);
                return fetch(`http://localhost:8081/cars/${data.carId}`);
            })
            .then(res => {
                console.log('Car response status:', res.status);
                if (!res.ok) {
                    throw new Error(`Failed to fetch car: ${res.status}`);
                }
                return res.json();
            })
            .then(carData => {
                console.log('✅ Car data received:', carData);
                setCar(carData);
            })
            .catch(err => {
                console.error('❌ Error fetching data:', err);
                setError(err.message || 'Gagal memuat data');
            });
    }, [bookingId]);

    const calculateDays = () => {
        if (!booking) return 0;
        const start = new Date(booking.startDate);
        const end = new Date(booking.endDate);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            alert('Silakan upload bukti pembayaran terlebih dahulu');
            return;
        }

        try {
            setLoading(true);
            await uploadPaymentProofApi(bookingId, file);
            alert('Bukti pembayaran berhasil dikirim! Menunggu konfirmasi admin.');
            onClose();
        } catch (error) {
            console.error('Upload error:', error);
            alert('Gagal mengirim bukti pembayaran. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    if (!booking || !car) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8 max-w-md">
                    {error ? (
                        <div>
                            <p className="text-red-600 font-medium mb-2">Error:</p>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Tutup
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-gray-600">Memuat data...</p>
                            <p className="text-xs text-gray-400 mt-2">Booking ID: {bookingId}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const days = calculateDays();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <h2 className="text-xl font-semibold text-gray-900">Pembayaran</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 p-6">
                    {/* Left Section - Payment Method */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-4">Metode Pembayaran</h3>

                        {/* Payment Method Tabs */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setPaymentMethod('transfer')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${paymentMethod === 'transfer'
                                    ? 'bg-[#023EBA] text-white border-[#023EBA]'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <CreditCard className="w-5 h-5" />
                                <span>Transfer Bank</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('ewallet')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${paymentMethod === 'ewallet'
                                    ? 'bg-[#023EBA] text-white border-[#023EBA]'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <CreditCard className="w-5 h-5" />
                                <span>E-Wallet</span>
                            </button>
                        </div>

                        {/* Bank Selection */}
                        {paymentMethod === 'transfer' && (
                            <div className="space-y-3 mb-6">
                                <p className="text-sm text-gray-600 mb-3">Pilih Bank</p>
                                {BANKS.map(bank => (
                                    <button
                                        key={bank.id}
                                        onClick={() => setSelectedBank(bank.id)}
                                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedBank === bank.id
                                            ? 'border-[#023EBA] bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{bank.name}</p>
                                                <p className="text-sm text-gray-600">{bank.accountNumber}</p>
                                                <p className="text-xs text-gray-500">{bank.accountName}</p>
                                            </div>
                                            {selectedBank === bank.id && (
                                                <Check className="w-5 h-5 text-[#023EBA]" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Upload Section */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Upload Bukti Pembayaran</p>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#023EBA] transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    id="payment-proof"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label htmlFor="payment-proof" className="cursor-pointer">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    {fileName ? (
                                        <p className="text-sm text-[#023EBA] font-medium">{fileName}</p>
                                    ) : (
                                        <>
                                            <p className="text-sm text-gray-600 mb-1">Klik untuk upload</p>
                                            <p className="text-xs text-gray-400">PNG, JPG hingga 5MB</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !file}
                            className="w-full bg-gradient-to-r from-[#023EBA] to-gray-700 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            {loading ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
                        </button>
                    </div>

                    {/* Right Section - Booking Summary */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-4">Ringkasan Pesanan</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                            {/* Car Image */}
                            <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-gray-600 rounded-lg flex items-center justify-center">
                                <div className="text-white text-center">
                                    <svg className="w-20 h-20 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                    </svg>
                                    <p className="text-sm font-medium">{car.namaMobil}</p>
                                </div>
                            </div>

                            {/* Car Name */}
                            <h4 className="font-semibold text-gray-900">{car.namaMobil}</h4>

                            {/* Details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Durasi Sewa</span>
                                    <span className="font-medium text-gray-900">{days} hari</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-600 flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Tanggal
                                    </span>
                                    <span className="font-medium text-gray-900 text-right">
                                        {booking.startDate} - {booking.endDate}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-600 flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        Lokasi
                                    </span>
                                    <span className="font-medium text-gray-900 text-right">
                                        {booking.pickupLocation || 'SURABA...'}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-900 font-medium">Total Pembayaran</span>
                                    <span className="text-[#023EBA] font-bold text-lg">
                                        Rp {booking.totalPrice.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
