import api from './api';

export const getAllBookings = async () => {
    const res = await api.get('/admin/bookings');
    return res.data;
};

// updtate booking status
export const updateBookingStatusApi = async (id:number, status:string) => {
    await api.put(`/admin/bookings/${id}/status`, { status });
};