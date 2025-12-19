import { Car, Shield, Clock, MapPin, Award, Users, Smartphone, CreditCard, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#023EBA] via-blue-700 to-gray-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-6 rounded-full backdrop-blur-sm">
                <Car className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl mb-6">Selamat Datang di Velon</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Solusi rental mobil terpercaya dengan harga terbaik, pelayanan prima, 
              dan kemudahan pemesanan yang dapat diandalkan untuk perjalanan Anda
            </p>
            <button
              onClick={onGetStarted}
              className="bg-white text-[#023EBA] px-8 py-4 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* Why Velon Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Mengapa Harus Memilih Velon?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pengalaman rental mobil terbaik dengan berbagai keunggulan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-[#023EBA]/10 to-gray-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-[#023EBA]" />
              </div>
              <h3 className="text-gray-900 mb-3">Terpercaya & Aman</h3>
              <p className="text-gray-600">
                Semua mobil kami diasuransikan dan terawat dengan baik untuk keamanan perjalanan Anda
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-[#023EBA]/10 to-gray-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-7 h-7 text-[#023EBA]" />
              </div>
              <h3 className="text-gray-900 mb-3">Harga Terjangkau</h3>
              <p className="text-gray-600">
                Dapatkan harga sewa yang kompetitif dengan berbagai voucher diskon menarik
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-[#023EBA]/10 to-gray-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-[#023EBA]" />
              </div>
              <h3 className="text-gray-900 mb-3">Proses Cepat</h3>
              <p className="text-gray-600">
                Pemesanan online yang mudah dan cepat, konfirmasi instan untuk kenyamanan Anda
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-[#023EBA]/10 to-gray-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Car className="w-7 h-7 text-[#023EBA]" />
              </div>
              <h3 className="text-gray-900 mb-3">Armada Lengkap</h3>
              <p className="text-gray-600">
                Berbagai pilihan mobil dari berbagai merek untuk memenuhi kebutuhan Anda
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-[#023EBA]/10 to-gray-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-7 h-7 text-[#023EBA]" />
              </div>
              <h3 className="text-gray-900 mb-3">Lokasi Strategis</h3>
              <p className="text-gray-600">
                Cabang tersebar di berbagai kota besar untuk kemudahan akses Anda
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-br from-[#023EBA]/10 to-gray-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-[#023EBA]" />
              </div>
              <h3 className="text-gray-900 mb-3">Customer Service 24/7</h3>
              <p className="text-gray-600">
                Tim support kami siap membantu Anda kapan saja untuk pengalaman terbaik
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Cara Kerja Velon</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Proses rental mobil yang mudah dan cepat dalam beberapa langkah sederhana
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-[#023EBA] to-gray-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                  1
                </div>
                <h3 className="text-gray-900 mb-2">Daftar/Masuk</h3>
                <p className="text-gray-600 text-sm">
                  Buat akun atau masuk ke akun Anda
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-[#023EBA] to-gray-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                  2
                </div>
                <h3 className="text-gray-900 mb-2">Pilih Mobil</h3>
                <p className="text-gray-600 text-sm">
                  Cari dan pilih mobil sesuai kebutuhan Anda
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-[#023EBA] to-gray-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                  3
                </div>
                <h3 className="text-gray-900 mb-2">Bayar</h3>
                <p className="text-gray-600 text-sm">
                  Lakukan pembayaran dan upload bukti transfer
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-[#023EBA] to-gray-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">
                  4
                </div>
                <h3 className="text-gray-900 mb-2">Nikmati</h3>
                <p className="text-gray-600 text-sm">
                  Ambil mobil dan nikmati perjalanan Anda
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-gray-900 mb-6">Fitur Lengkap untuk Kemudahan Anda</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#023EBA] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-gray-900 mb-1">Pencarian & Filter Mobil</h4>
                      <p className="text-gray-600 text-sm">
                        Cari mobil berdasarkan tipe, transmisi, dan ketersediaan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#023EBA] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-gray-900 mb-1">Voucher Diskon</h4>
                      <p className="text-gray-600 text-sm">
                        Hemat lebih banyak dengan berbagai voucher diskon spesial
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#023EBA] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-gray-900 mb-1">Riwayat Sewa</h4>
                      <p className="text-gray-600 text-sm">
                        Pantau semua riwayat dan status pemesanan Anda
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#023EBA] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-gray-900 mb-1">Pembayaran Fleksibel</h4>
                      <p className="text-gray-600 text-sm">
                        Transfer bank atau e-wallet, pilih sesuai kenyamanan Anda
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#023EBA] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-gray-900 mb-1">Lokasi Mitra</h4>
                      <p className="text-gray-600 text-sm">
                        Temukan lokasi mitra terdekat dengan peta interaktif
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="bg-gradient-to-br from-[#023EBA]/20 via-blue-100 to-gray-100 rounded-lg p-8 text-center">
                  <Award className="w-20 h-20 text-[#023EBA] mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">Dipercaya Ribuan Pelanggan</h3>
                  <p className="text-gray-600 mb-4">
                    Bergabunglah dengan ribuan pelanggan yang telah mempercayai Velon untuk perjalanan mereka
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div>
                      <p className="text-3xl text-[#023EBA]">5000+</p>
                      <p className="text-sm text-gray-600">Pelanggan</p>
                    </div>
                    <div>
                      <p className="text-3xl text-[#023EBA]">4.8</p>
                      <p className="text-sm text-gray-600">Rating</p>
                    </div>
                    <div>
                      <p className="text-3xl text-[#023EBA]">99%</p>
                      <p className="text-sm text-gray-600">Kepuasan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#023EBA] via-blue-700 to-gray-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white mb-4">Siap Memulai Perjalanan Anda?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan Velon sekarang dan nikmati pengalaman rental mobil yang tak terlupakan
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-[#023EBA] px-8 py-4 rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            Mulai Rental Sekarang
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Car className="w-6 h-6" />
              <span className="text-xl">Velon Rental</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Velon. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}