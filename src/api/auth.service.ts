import apiClient from './client';
import type { LoginPayload, AuthResponse } from '../types/auth';

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    return response.data;
}
