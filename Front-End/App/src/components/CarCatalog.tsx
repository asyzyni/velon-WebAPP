import { useState, useEffect } from 'react';
import { Search, Users, Fuel, Settings } from 'lucide-react';
import BookingModal from './BookingModal';
import { getAllCars } from '../api/carApi';

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

export default function CarCatalog() {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [transmissionFilter, setTransmissionFilter] = useState('all');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const data = await getAllCars();

      const mappedCars: Car[] = data.map((car: BackendCar) => ({
        id: car.id.toString(),
        name: car.namaMobil,
        brand: car.namaMobil.split(' ')[0],
        type: car.jenisMobil,
        seats: car.kapasitas,
        transmission: 'Manual',
        fuel: 'Bensin',
        pricePerDay: car.hargaPerHari,
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500',
        available: car.status === 'AVAILABLE',
      }));

      setCars(mappedCars);
    } catch (err) {
      console.error('Gagal load mobil', err);
    }
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch =
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === 'all' || car.type === typeFilter;

    const matchesTransmission =
      transmissionFilter === 'all' || car.transmission === transmissionFilter;

    return matchesSearch && matchesType && matchesTransmission;
  });

  const handleBookNow = (car: Car) => {
    setSelectedCar(car);
    setShowBookingModal(true);
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-gray-900 mb-6">Cari Mobil</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau merek mobil..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="all">Semua Tipe</option>
            <option value="MPV">MPV</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
          </select>

          <select
            value={transmissionFilter}
            onChange={(e) => setTransmissionFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg"
          >
            <option value="all">Semua Transmisi</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-gray-600">
        Menampilkan {filteredCars.length} mobil
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map(car => (
          <div key={car.id} className="bg-white rounded-xl shadow-md">
            <div className="h-48">
              <img src={car.image} className="w-full h-full object-cover" />
            </div>

            <div className="p-5">
              <h3 className="text-gray-900">{car.name}</h3>
              <p className="text-gray-500">{car.brand}</p>

              <div className="grid grid-cols-3 gap-2 my-4">
                <div className="flex flex-col items-center text-gray-600">
                  <Users className="w-5 h-5" />
                  {car.seats} Kursi
                </div>
                <div className="flex flex-col items-center text-gray-600">
                  <Settings className="w-5 h-5" />
                  {car.transmission}
                </div>
                <div className="flex flex-col items-center text-gray-600">
                  <Fuel className="w-5 h-5" />
                  {car.fuel}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Harga per hari</p>
                  <p className="text-blue-600">
                    Rp {car.pricePerDay.toLocaleString('id-ID')}
                  </p>
                </div>
                <button
                  onClick={() => handleBookNow(car)}
                  disabled={!car.available}
                  className={`px-6 py-2 rounded-lg ${
                    car.available
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {car.available ? 'Pesan' : 'Tersewa'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
