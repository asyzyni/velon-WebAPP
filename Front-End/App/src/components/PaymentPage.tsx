import { useEffect, useState } from "react";

interface PaymentPageProps {
  bookingId: string;
  onBack: () => void;
}

interface Booking {
  id: number;
  carId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

export default function PaymentPage({ bookingId, onBack }: PaymentPageProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8081/bookings/${bookingId}`)
      .then(res => res.json())
      .then(data => setBooking(data));
  }, [bookingId]);

  const submitPayment = async () => {
    if (!file) {
      alert("Upload bukti pembayaran!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`http://localhost:8081/payments/upload/${bookingId}`, {
      method: "POST",
      body: formData,
    });

    alert("Bukti pembayaran dikirim");
    onBack();
  };

  if (!booking) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto">
      <button onClick={onBack} className="mb-4 text-blue-600">
        ← Kembali
      </button>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-lg font-semibold">Pembayaran</h2>

        <p>Mobil ID: {booking.carId}</p>
        <p>
          Tanggal: {booking.startDate} - {booking.endDate}
        </p>
        <p className="font-medium">
          Total: Rp {booking.totalPrice.toLocaleString("id-ID")}
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={submitPayment}
          className="w-full py-2 bg-blue-600 text-white rounded"
        >
          Kirim Bukti Pembayaran
        </button>
      </div>
    </div>
  );
}
