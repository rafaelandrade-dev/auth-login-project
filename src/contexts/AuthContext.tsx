import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { DecodedToken } from '../types/auth';

interface AuthContextType {
    token: string | null;
    user: DecodedToken | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJWT(token: string): DecodedToken | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function isTokenValid(token: string): boolean {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return false;
    return decoded.exp * 1000 > Date.now();
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<DecodedToken | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken && isTokenValid(savedToken)) {
            login(savedToken);
        } else {
            logout();
        }
    }, []);

    const login = (newToken: string) => {
        const decoded = decodeJWT(newToken);
        if (decoded) {
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(decoded);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = token !== null && isTokenValid(token);

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
