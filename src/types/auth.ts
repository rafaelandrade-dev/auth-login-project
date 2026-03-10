export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface DecodedToken {
    id: number;
    email: string;
    exp: number;
}
