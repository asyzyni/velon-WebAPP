import api from './api';

export interface Car {
  id: number;
  namaMobil: string;
  jenisMobil: string;
  hargaPerHari: number;
  kapasitas: number;
  status: string;
}

export const getAllCars = async (): Promise<Car[]> => {
  const res = await api.get('/cars');
  return res.data;
};

export const getCarById = async (id: number): Promise<Car> => {
  const res = await api.get(`/cars/${id}`);
  return res.data;
};
