import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  Eye,
  Check,
  X,
} from "lucide-react";
import {
  getAllBookings,
  approveBooking,
  cancelBooking,
  markBookingAsCompleted,
} from "../api/adminBookingApi";

/* ================= TYPES ================= */

interface Booking {
  id: string;
  userId: string;
  carId: string;
  carName: string;
  carImage: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  notes?: string;
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "pending" | "paid";
  paymentProof?: string;
  paymentMethod?: string;
  createdAt: string;
}

type FilterStatus = "all" | "pending" | "confirmed";

/* ================= HELPERS ================= */

const normalizeStatus = (status: string): Booking["status"] => {
  switch (status.toUpperCase()) {
    case "PENDING":
    case "WAITING_PAYMENT":
      return "pending";
    case "CONFIRMED":
      return "confirmed";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    default:
      return "pending";
  }
};

const getStatusColor = (status: Booking["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
  }
};

/* ================= COMPONENT ================= */

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);

  /* ========== LOAD DATA ========== */
  const loadBookings = async () => {
    const data = await getAllBookings();

    const mapped: Booking[] = data.map((b: any) => {
      const totalDays =
        Math.ceil(
          (new Date(b.endDate).getTime() -
            new Date(b.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
        ) || 1;

      return {
        id: String(b.id),
        userId: String(b.userId),
        carId: String(b.carId),
        carName: `Mobil ${b.carId}`,
        carImage: "/car-placeholder.jpg",
        startDate: b.startDate,
        endDate: b.endDate,
        pickupLocation: b.pickupLocation || "Lokasi Antar",
        notes: b.notes || "",
        totalDays,
        pricePerDay: b.totalPrice / totalDays,
        totalPrice: b.totalPrice,
        status: normalizeStatus(b.status),
        paymentStatus: b.paymentStatus || "pending",
        paymentProof: b.paymentProof,
        paymentMethod: b.paymentMethod,
        createdAt: b.createdAt || b.startDate,
      };
    });

    setBookings(mapped);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  /* ========== FILTER ========== */
  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter(b => b.status === filter);
  }, [bookings, filter]);

  /* ========== ACTIONS ========== */
  const handleApprove = async (id: string) => {
    await approveBooking(id);
    loadBookings();
  };

  const handleCancel = async (id: string) => {
    await cancelBooking(id);
    loadBookings();
  };

  const handleMarkCompleted = async (id: string) => {
    await markBookingAsCompleted(id);
    loadBookings();
  };

  const viewPaymentProof = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowProofModal(true);
  };

  /* ================= RENDER ================= */

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">Kelola Booking</h2>

        <div className="flex gap-2">
          {["all", "pending", "confirmed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as FilterStatus)}
              className={`px-4 py-2 rounded-lg ${filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-300 text-gray-600"
                }`}
            >
              {f === "all" ? "Semua" : f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredBookings.map(b => (
          <div key={b.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between mb-3">
              <div>
                <h3 className="text-gray-900">{b.carName}</h3>
                <p className="text-sm text-gray-500">
                  Booking ID: {b.id} | User ID: {b.userId}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  b.status
                )}`}
              >
                {b.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(b.startDate).toLocaleDateString("id-ID")} –{" "}
                {new Date(b.endDate).toLocaleDateString("id-ID")}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {b.totalDays} hari
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {b.pickupLocation}
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Rp {b.totalPrice.toLocaleString("id-ID")}
              </div>
            </div>

            {/* Actions */}
            {b.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(b.id)}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  <Check className="w-4 h-4" />
                  Konfirmasi
                </button>
                <button
                  onClick={() => handleCancel(b.id)}
                  className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                  Tolak
                </button>
              </div>
            )}

            {b.status === "confirmed" && (
              <button
                onClick={() => handleMarkCompleted(b.id)}
                className="mt-2 flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                <CheckCircle className="w-4 h-4" />
                Tandai Selesai
              </button>
            )}

            {b.paymentProof && b.paymentStatus === "pending" && (
              <button
                onClick={() => viewPaymentProof(b)}
                className="mt-2 flex items-center gap-1 px-4 py-2 bg-yellow-600 text-white rounded-lg"
              >
                <Eye className="w-4 h-4" />
                Lihat Bukti Bayar
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment Proof Modal */}
      {showProofModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-gray-900 font-semibold">Bukti Pembayaran</h2>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 mb-1">Booking ID: <span className="font-medium">{selectedBooking.id}</span></p>
                <p className="text-gray-700 mb-1">Total: <span className="font-medium">Rp {selectedBooking.totalPrice.toLocaleString('id-ID')}</span></p>
              </div>

              {selectedBooking.paymentProof && (
                <div className="mb-6">
                  <p className="text-gray-700 mb-2">Bukti Transfer:</p>
                  <img
                    src={selectedBooking.paymentProof}
                    alt="Bukti Pembayaran"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowProofModal(false)}
                  className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
