import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "./AuthContext";

/* ================= TYPES ================= */

interface Booking {
  id: number;
  userId: number;
  carId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "WAITING_PAYMENT" | "WAITING_CONFIRMATION" | "CONFIRMED" | "COMPLETED";
}

interface Props {
  onPayment: (bookingId: string) => void;
  refreshKey?: number;
}

/* ================= CONFIG ================= */

const STATUS_LABEL = {
  WAITING_PAYMENT: "Menunggu Pembayaran",
  WAITING_CONFIRMATION: "Menunggu Konfirmasi",
  CONFIRMED: "Dikonfirmasi",
  COMPLETED: "Selesai",
} as const;

const STATUS_COLOR = {
  WAITING_PAYMENT: "bg-red-100 text-red-700",
  WAITING_CONFIRMATION: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
} as const;

const STATUS_ICON = {
  WAITING_PAYMENT: <AlertCircle className="w-4 h-4" />,
  WAITING_CONFIRMATION: <AlertCircle className="w-4 h-4" />,
  CONFIRMED: <CheckCircle className="w-4 h-4" />,
  COMPLETED: <CheckCircle className="w-4 h-4" />,
} as const;

/* ================= COMPONENT ================= */

export default function BookingHistory({ onPayment, refreshKey }: Props) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] =
    useState<"all" | Booking["status"]>("all");

  /* ===== LOAD FROM BACKEND ===== */
  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://localhost:8081/bookings/history/${user.id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return res.json();
      })
      .then(data => {
        console.log("BOOKINGS FROM BACKEND:", data);
        setBookings(data);
      })
      .catch(err => {
        console.error("LOAD BOOKINGS ERROR:", err);
      });
  }, [user?.id, refreshKey]);



  /* ===== FILTER ===== */
  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter(b => b.status === filter);
  }, [bookings, filter]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Riwayat Sewa</h2>

        <div className="flex gap-2">
          {["all", "WAITING_PAYMENT", "CONFIRMED", "COMPLETED"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm ${filter === f
                ? "bg-[#023EBA] text-white"
                : "border text-gray-600"
                }`}
            >
              {f === "all" ? "Semua" : STATUS_LABEL[f as Booking["status"]]}
            </button>
          ))}
        </div>
      </div>

      {/* Empty */}
      {filteredBookings.length === 0 && (
        <div className="bg-white p-10 rounded-lg text-center text-gray-500">
          Belum ada booking
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {filteredBookings.map(b => {
          const days = Math.ceil(
            (new Date(b.endDate).getTime() -
              new Date(b.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
          );

          return (
            <div key={b.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-medium">
                    Mobil ID #{b.carId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Booking ID: {b.id}
                  </p>
                </div>

                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${STATUS_COLOR[b.status]}`}
                >
                  {STATUS_ICON[b.status]}
                  {STATUS_LABEL[b.status]}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {b.startDate} – {b.endDate}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {days} hari
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Lokasi Pickup
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Rp {b.totalPrice.toLocaleString("id-ID")}
                </div>
              </div>

              {/*  TOMBOL BAYAR */}
              {b.status === "WAITING_PAYMENT" && (
                <button
                  onClick={() => onPayment(String(b.id))}
                  className="px-4 py-2 bg-[#023EBA] text-white rounded-lg"
                >
                  Bayar Sekarang
                </button>
              )}

              {b.status === "WAITING_CONFIRMATION" && (
                <span className="text-yellow-700 text-sm">
                  Menunggu verifikasi pembayaran
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
