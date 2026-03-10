import type { NavigateFunction } from 'react-router-dom';
import apiClient from './client';

export function setupInterceptors(navigate: NavigateFunction) {
    const requestInterceptor = apiClient.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    const responseInterceptor = apiClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );

    return () => {
        apiClient.interceptors.request.eject(requestInterceptor);
        apiClient.interceptors.response.eject(responseInterceptor);
    };
}
