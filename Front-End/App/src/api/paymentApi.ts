import api from './api';

export const uploadPaymentProofApi = async (bookingId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post(`/payments/bookings/${bookingId}/proof`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}