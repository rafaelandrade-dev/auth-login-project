import axios from 'axios';
import { mockAdapter } from './mock-adapter';

const isDemoMode = !import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    ...(isDemoMode && { adapter: mockAdapter }),
});

export default apiClient;
export { isDemoMode };
