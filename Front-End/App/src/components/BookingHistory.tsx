import { useEffect, useMemo, useState } from "react";
import { Calendar, MapPin, CreditCard, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthContext";

/* ================= TYPES ================= */

interface Booking {
  id: string;
  userId: string;
  carName: string;
  carImage: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  notes?: string;
  totalDays: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "pending" | "paid";
  createdAt: string;
}

interface BookingHistoryProps {
  onPayment: (bookingId: string) => void;
}

type FilterStatus = "all" | Booking["status"];

/* ================= CONFIG ================= */

const STATUS_LABEL: Record<Booking["status"], string> = {
  pending: "Menunggu Konfirmasi",
  confirmed: "Dikonfirmasi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const STATUS_COLOR: Record<Booking["status"], string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_LABEL: Record<Booking["paymentStatus"], string> = {
  unpaid: "Belum Bayar",
  pending: "Menunggu Verifikasi",
  paid: "Sudah Bayar",
};

const PAYMENT_COLOR: Record<Booking["paymentStatus"], string> = {
  unpaid: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
};

const STATUS_ICON: Record<Booking["status"], JSX.Element> = {
  pending: <AlertCircle className="w-5 h-5" />,
  confirmed: <CheckCircle className="w-5 h-5" />,
  completed: <CheckCircle className="w-5 h-5" />,
  cancelled: <XCircle className="w-5 h-5" />,
};

/* ================= COMPONENT ================= */

export default function BookingHistory({ onPayment }: BookingHistoryProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");

  /* ========== DATA LOAD (sementara localStorage) ========== */
  useEffect(() => {
    if (!user) return;

    // TODO: ganti ke API getBookingsByUser(user.id)
    const raw = JSON.parse(localStorage.getItem("velon_bookings") || "[]") as Booking[];

    const userBookings = raw
      .filter(b => b.userId === user.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

    setBookings(userBookings);
  }, [user]);

  /* ========== FILTERED DATA ========== */
  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter(b => b.status === filter);
  }, [bookings, filter]);

  /* ================= RENDER ================= */

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Riwayat Sewa</h2>

        <div className="flex gap-2">
          {["all", "pending", "confirmed", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as FilterStatus)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === f
                  ? "bg-gradient-to-r from-[#023EBA] to-gray-700 text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {f === "all"
                ? "Semua"
                : STATUS_LABEL[f as Booking["status"]]}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Belum ada riwayat sewa</p>
        </div>
      )}

      {/* Booking List */}
      <div className="space-y-4">
        {filteredBookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-xl shadow-md">
            <div className="p-6 flex gap-4">
              {/* Image */}
              <img
                src={booking.carImage}
                alt={booking.carName}
                className="w-32 h-32 object-cover rounded-lg"
              />

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="text-gray-900">{booking.carName}</h3>
                    <p className="text-sm text-gray-500">ID: {booking.id}</p>
                  </div>

                  <div className="flex gap-2">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${STATUS_COLOR[booking.status]}`}>
                      {STATUS_ICON[booking.status]}
                      {STATUS_LABEL[booking.status]}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${PAYMENT_COLOR[booking.paymentStatus]}`}>
                      {PAYMENT_LABEL[booking.paymentStatus]}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(booking.startDate).toLocaleDateString("id-ID")} –{" "}
                    {new Date(booking.endDate).toLocaleDateString("id-ID")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {booking.totalDays} hari
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {booking.pickupLocation}
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Rp {booking.totalPrice.toLocaleString("id-ID")}
                  </div>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <span className="text-gray-700">Catatan:</span> {booking.notes}
                  </div>
                )}

                {/* Actions */}
                {booking.paymentStatus === "unpaid" && (
                  <button
                    onClick={() => onPayment(booking.id)}
                    className="px-4 py-2 bg-gradient-to-r from-[#023EBA] to-gray-700 text-white rounded-lg"
                  >
                    Bayar Sekarang
                  </button>
                )}

                {booking.paymentStatus === "pending" && (
                  <span className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
                    Menunggu verifikasi pembayaran
                  </span>
                )}

                {booking.paymentStatus === "paid" && (
                  <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                    Pembayaran terverifikasi
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
