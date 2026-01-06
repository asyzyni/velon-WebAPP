import api from './api';

export const getAllBookings = async () => {
    const res = await api.get('/admin/bookings');
    return res.data;
};

export const approveBooking = async (bookingId: string) => {
    const res =  await api.put(`/admin/bookings/${bookingId}/approve`);
    return res.data;
};

export const cancelBooking = async (bookingId: string) => {
    const res = await api.put(`/admin/bookings/${bookingId}/cancel`);
    return res.data;
};

export const markBookingAsCompleted = async (bookingId: string) => {
    const res = await api.put(`/admin/bookings/${bookingId}/complete`);
    return res.data;
}