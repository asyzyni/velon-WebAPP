import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    try {
        const storedUser = localStorage.getItem('velon_user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user && user.token) {
                config.headers['Authorization'] = `Bearer ${user.token}`;
                config.headers['X-Session-Token'] = user.token;
            }
        }
    } catch {
        // ignore JSON parse errors
    }
    return config;
});

export default api;