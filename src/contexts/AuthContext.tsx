import { createContext, useContext, type ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!localStorage.getItem('token'), logout }}>
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
