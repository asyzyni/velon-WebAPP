import api from './api';

export interface CreateBookingPayload {
    userId: number;
    carId: number;
    startDate: string;
    endDate: string;
    pickupLocation?: string;
    notes?: string;
}

export const getBookingbyId = async (id: number) => {
    const res = await api.get(`/bookings/${id}`);
    return res.data;
};

export const createBooking = async (payload: CreateBookingPayload) => {
    const res = await api.post('/bookings/init', payload);
    return res.data;
};