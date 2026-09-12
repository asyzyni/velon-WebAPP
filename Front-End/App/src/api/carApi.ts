import api from './api';

export interface Car {
  id: number;
  namaMobil: string;
  jenisMobil: string;
  hargaPerHari: number;
  kapasitas: number;
  status: string;
}

export type BackendCar = Car;

export const getAllCars = async (): Promise<Car[]> => {
  const res = await api.get('/cars');
  return res.data;
};

export const searchAvailableCars = async (startDate: string, endDate: string): Promise<Car[]> => {
  const res = await api.get('/cars/search', {
    params: { startDate, endDate }
  });
  return res.data;
};

export const getCarById = async (id: number): Promise<Car> => {
  const res = await api.get(`/cars/${id}`);
  return res.data;
};
