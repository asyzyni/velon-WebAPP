import api from './api';

export const getBookingbyId = async (id: number) => {
    const res = await api.get(`/bookings/${id}`);
    return res.data;
}