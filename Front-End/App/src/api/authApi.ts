import api from './api';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const loginApi = async (email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
};

export const registerApi = async (name: string, email: string, password: string): Promise<string> => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
};
