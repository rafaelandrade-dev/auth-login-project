import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, Lock, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ChangePasswordModal } from '../ChangePasswordModal';
import { cn } from '../../lib/utils';

export function Header() {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border-subtle">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-violet-600 shadow-glow-sm">
                            <Shield className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white via-primary-200 to-violet-200 bg-clip-text text-transparent">
                            UserHub
                        </span>
                    </div>

                    {/* User menu */}
                    {user && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={cn(
                                    'flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all duration-150',
                                    'text-text-muted hover:text-text-primary hover:bg-surface-hover',
                                    isDropdownOpen && 'bg-surface-hover text-text-primary'
                                )}
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-violet-600 text-white text-xs font-bold shadow-sm">
                                    {user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:flex flex-col items-start leading-none">
                                    <span className="text-[10px] text-text-muted font-medium mb-0.5">Minha conta</span>
                                    <span className="text-xs font-medium text-text-primary max-w-[140px] truncate">{user.email}</span>
                                </div>
                                <ChevronDown className={cn('h-3.5 w-3.5 text-text-muted transition-transform duration-200', isDropdownOpen && 'rotate-180')} />
                            </button>

                            {/* Dropdown */}
                            {isDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-60 rounded-xl bg-surface border border-border-subtle shadow-card overflow-hidden z-50 animate-[fadeSlideDown_150ms_ease-out]"
                                    style={{ transformOrigin: 'top right' }}
                                >
                                    {/* User info header */}
                                    <div className="px-4 py-3.5 border-b border-border-subtle">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-violet-600 text-white text-xs font-bold shadow-sm flex-shrink-0">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-0.5">Logado como</p>
                                                <p className="text-xs text-text-primary truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="py-1.5">
                                        <button
                                            onClick={() => {
                                                setIsPasswordModalOpen(true);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                                        >
                                            <Lock className="h-3.5 w-3.5 flex-shrink-0 text-primary-400" />
                                            Alterar senha
                                        </button>
                                        <button
                                            onClick={logout}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-danger/80 hover:text-danger hover:bg-danger/5 transition-colors"
                                        >
                                            <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
                                            Sair
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </header>
    );
}
