import { apiClient } from './client';

// Interceptors configurations will be handled here
export function setupInterceptors(logout: () => void) {
    apiClient.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                logout();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
}
