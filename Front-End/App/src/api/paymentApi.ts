import api from './api';

export const uploadPaymentProofApi = async (bookingId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post(`/payments/${bookingId}/upload-proof`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}