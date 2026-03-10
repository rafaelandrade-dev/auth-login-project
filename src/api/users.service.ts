import apiClient from './client';
import type {
    User,
    CreateUserPayload,
    UpdateUserPayload,
    ChangePasswordPayload,
    PaginatedUsers
} from '../types/user';

export async function getUsers(page: number, limit: number): Promise<PaginatedUsers> {
    const response = await apiClient.get<User[]>('/users', {
        params: {
            _page: page,
            _limit: limit,
        },
    });

    const total = parseInt(response.headers['x-total-count'] || '0', 10);

    return {
        data: response.data,
        total,
        page,
        limit,
    };
}

export async function getUserById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
    const response = await apiClient.post<User>('/users', payload);
    return response.data;
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, payload);
    return response.data;
}

export async function deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
}

export async function changePassword(id: number, payload: ChangePasswordPayload): Promise<{ message: string }> {
    const response = await apiClient.patch<{ message: string }>(`/users/${id}/password`, payload);
    return response.data;
}
