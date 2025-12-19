import { useState, useEffect } from 'react';
import { Search, Users, Fuel, Settings, Calendar, MapPin } from 'lucide-react';
import { useAuth } from './AuthContext';
import BookingModal from './BookingModal';

interface Car {
  id: string;
  name: string;
  brand: string;
  type: string;
  seats: number;
  transmission: string;
  fuel: string;
  pricePerDay: number;
  image: string;
  available: boolean;
}

const mockCars: Car[] = [
  {
    id: '1',
    name: 'Toyota Avanza',
    brand: 'Toyota',
    type: 'MPV',
    seats: 7,
    transmission: 'Manual',
    fuel: 'Bensin',
    pricePerDay: 300000,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=500',
    available: true,
  },
  {
    id: '2',
    name: 'Honda Jazz',
    brand: 'Honda',
    type: 'Hatchback',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Bensin',
    pricePerDay: 350000,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500',
    available: true,
  },
  {
    id: '3',
    name: 'Mitsubishi Xpander',
    brand: 'Mitsubishi',
    type: 'MPV',
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Bensin',
    pricePerDay: 400000,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500',
    available: true,
  },
  {
    id: '4',
    name: 'Toyota Innova',
    brand: 'Toyota',
    type: 'MPV',
    seats: 7,
    transmission: 'Manual',
    fuel: 'Diesel',
    pricePerDay: 450000,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500',
    available: true,
  },
  {
    id: '5',
    name: 'Suzuki Ertiga',
    brand: 'Suzuki',
    type: 'MPV',
    seats: 7,
    transmission: 'Manual',
    fuel: 'Bensin',
    pricePerDay: 280000,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500',
    available: false,
  },
  {
    id: '6',
    name: 'Honda CR-V',
    brand: 'Honda',
    type: 'SUV',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Bensin',
    pricePerDay: 550000,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500',
    available: true,
  },
];

export default function CarCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [transmissionFilter, setTransmissionFilter] = useState('all');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const filteredCars = mockCars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || car.type === typeFilter;
    const matchesTransmission = transmissionFilter === 'all' || car.transmission === transmissionFilter;
    
    return matchesSearch && matchesType && matchesTransmission;
  });

  const handleBookNow = (car: Car) => {
    setSelectedCar(car);
    setShowBookingModal(true);
  };

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-gray-900 mb-6">Cari Mobil</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau merek mobil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">Semua Tipe</option>
            <option value="MPV">MPV</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
          </select>

          {/* Transmission Filter */}
          <select
            value={transmissionFilter}
            onChange={(e) => setTransmissionFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">Semua Transmisi</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-gray-600">
        Menampilkan {filteredCars.length} mobil
      </div>

      {/* Car Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map(car => (
          <div
            key={car.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48 bg-gray-200">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
              />
              {!car.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-lg">
                    Tidak Tersedia
                  </span>
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-gray-900 mb-1">{car.name}</h3>
                  <p className="text-gray-500">{car.brand}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {car.type}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 my-4 py-4 border-y border-gray-200">
                <div className="flex flex-col items-center gap-1 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">{car.seats} Kursi</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-600">
                  <Settings className="w-5 h-5" />
                  <span className="text-sm">{car.transmission}</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-gray-600">
                  <Fuel className="w-5 h-5" />
                  <span className="text-sm">{car.fuel}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Harga per hari</p>
                  <p className="text-[#023EBA]">
                    Rp {car.pricePerDay.toLocaleString('id-ID')}
                  </p>
                </div>
                <button
                  onClick={() => handleBookNow(car)}
                  disabled={!car.available}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    car.available
                      ? 'bg-gradient-to-r from-[#023EBA] to-gray-700 text-white hover:from-[#022f8a] hover:to-gray-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {car.available ? 'Pesan' : 'Tersewa'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Tidak ada mobil yang sesuai dengan pencarian Anda
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedCar && (
        <BookingModal
          car={selectedCar}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedCar(null);
          }}
        />
      )}
    </div>
  );
}