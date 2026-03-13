export interface User {
    id: number;
    name: string;
    email: string;
}

export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserPayload {
    name: string;
    email: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface PaginatedUsers {
    data: User[];
    total: number;
    page: number;
    limit: number;
}
