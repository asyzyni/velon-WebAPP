import { useState } from 'react';
import { MapPin, Tag, Store, Phone, Clock, Copy, Check } from 'lucide-react';

interface Voucher {
  id: string;
  code: string;
  discount: number;
  description: string;
  validUntil: string;
  minRent: number;
}

interface Partner {
  id: string;
  name: string;
  address: string;
  phone: string;
  openHours: string;
  lat: number;
  lng: number;
}

const vouchers: Voucher[] = [
  {
    id: '1',
    code: 'VELON50',
    discount: 50000,
    description: 'Diskon Rp 50.000 untuk sewa minimal 3 hari',
    validUntil: '2025-12-31',
    minRent: 3,
  },
  {
    id: '2',
    code: 'WEEKEND20',
    discount: 20,
    description: 'Diskon 20% untuk sewa di akhir pekan',
    validUntil: '2025-12-31',
    minRent: 2,
  },
  {
    id: '3',
    code: 'NEWUSER100',
    discount: 100000,
    description: 'Diskon Rp 100.000 untuk pengguna baru',
    validUntil: '2025-12-31',
    minRent: 5,
  },
  {
    id: '4',
    code: 'LONGTERM15',
    discount: 15,
    description: 'Diskon 15% untuk sewa lebih dari 7 hari',
    validUntil: '2025-12-31',
    minRent: 7,
  },
];

const partners: Partner[] = [
  {
    id: '1',
    name: 'Velon Rental Jakarta Pusat',
    address: 'Jl. Thamrin No. 1, Jakarta Pusat',
    phone: '021-12345678',
    openHours: '08:00 - 20:00',
    lat: -6.1944,
    lng: 106.8229,
  },
  {
    id: '2',
    name: 'Velon Rental Jakarta Selatan',
    address: 'Jl. Sudirman No. 52, Jakarta Selatan',
    phone: '021-87654321',
    openHours: '08:00 - 20:00',
    lat: -6.2088,
    lng: 106.8456,
  },
  {
    id: '3',
    name: 'Velon Rental Bandung',
    address: 'Jl. Asia Afrika No. 8, Bandung',
    phone: '022-12345678',
    openHours: '08:00 - 20:00',
    lat: -6.9175,
    lng: 107.6191,
  },
  {
    id: '4',
    name: 'Velon Rental Surabaya',
    address: 'Jl. Tunjungan No. 101, Surabaya',
    phone: '031-12345678',
    openHours: '08:00 - 20:00',
    lat: -7.2575,
    lng: 112.7521,
  },
];

export default function HomePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(partners[0]);

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#023EBA] via-blue-700 to-gray-700 rounded-xl shadow-lg p-8 text-white">
        <h1 className="text-3xl mb-2">Selamat Datang di Velon!</h1>
        <p className="text-blue-100">
          Rental mobil terpercaya dengan harga terbaik dan layanan berkualitas
        </p>
      </div>

      {/* Vouchers Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-6 h-6 text-[#023EBA]" />
          <h2 className="text-gray-900">Voucher Diskon</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#023EBA] transition-all"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        {typeof voucher.discount === 'number' && voucher.discount > 100
                          ? `Rp ${voucher.discount.toLocaleString('id-ID')}`
                          : `${voucher.discount}%`}
                      </span>
                      <span className="text-sm text-gray-500">
                        Min. {voucher.minRent} hari
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{voucher.description}</p>
                    <p className="text-sm text-gray-500">
                      Berlaku hingga: {new Date(voucher.validUntil).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  <div className="flex-1 bg-gray-50 px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Kode Voucher</p>
                    <p className="text-[#023EBA]">{voucher.code}</p>
                  </div>
                  <button
                    onClick={() => copyVoucherCode(voucher.code)}
                    className="px-4 py-2 bg-gradient-to-r from-[#023EBA] to-gray-700 text-white rounded-lg hover:from-[#022f8a] hover:to-gray-800 transition-colors flex items-center gap-2"
                  >
                    {copiedCode === voucher.code ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partners Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-6 h-6 text-[#023EBA]" />
          <h2 className="text-gray-900">Mitra Penyewaan Kami</h2>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Partners List */}
          <div className="lg:col-span-1 space-y-3">
            {partners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => setSelectedPartner(partner)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedPartner?.id === partner.id
                    ? 'bg-gradient-to-r from-[#023EBA] to-gray-700 text-white shadow-lg'
                    : 'bg-white text-gray-900 hover:bg-gray-50 shadow-md'
                }`}
              >
                <h3 className={`mb-2 ${selectedPartner?.id === partner.id ? 'text-white' : 'text-gray-900'}`}>
                  {partner.name}
                </h3>
                <div className={`space-y-1 text-sm ${selectedPartner?.id === partner.id ? 'text-blue-100' : 'text-gray-600'}`}>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{partner.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{partner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{partner.openHours}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-[500px]">
              <iframe
                title="Partner Locations"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=${
                  import.meta.env.VITE_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(
                    selectedPartner?.address || partners[0].address
                  )}&zoom=15`}
                  allowFullScreen
              />
            </div>
            {selectedPartner && (
              <div className="mt-4 p-4 bg-gradient-to-br from-[#023EBA]/10 to-gray-100 rounded-lg border border-gray-300">
                <h3 className="text-gray-900 mb-2">{selectedPartner.name}</h3>
                <div className="grid md:grid-cols-3 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#023EBA]" />
                    <span>{selectedPartner.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#023EBA]" />
                    <span>{selectedPartner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#023EBA]" />
                    <span>{selectedPartner.openHours}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-gray-900 mb-3">Mengapa Memilih Velon?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="bg-gradient-to-br from-[#023EBA]/20 to-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <Tag className="w-6 h-6 text-[#023EBA]" />
            </div>
            <h4 className="text-gray-900 mb-2">Harga Terbaik</h4>
            <p className="text-gray-600 text-sm">
              Dapatkan harga sewa mobil terbaik dengan berbagai voucher diskon menarik
            </p>
          </div>
          <div>
            <div className="bg-gradient-to-br from-[#023EBA]/20 to-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <Store className="w-6 h-6 text-[#023EBA]" />
            </div>
            <h4 className="text-gray-900 mb-2">Mitra Terpercaya</h4>
            <p className="text-gray-600 text-sm">
              Bekerja sama dengan mitra penyewaan mobil terpercaya di berbagai kota
            </p>
          </div>
          <div>
            <div className="bg-gradient-to-br from-[#023EBA]/20 to-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6 text-[#023EBA]" />
            </div>
            <h4 className="text-gray-900 mb-2">Lokasi Strategis</h4>
            <p className="text-gray-600 text-sm">
              Cabang kami tersebar di lokasi strategis untuk kemudahan Anda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}