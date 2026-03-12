import { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon, ChevronDown, Lock } from 'lucide-react';
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
        <header className="bg-white shadow relative z-30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <span className="text-xl font-bold text-indigo-600">AuthSystem</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                        <UserIcon className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col items-start leading-none hidden sm:flex">
                                        <span className="text-xs text-gray-500 mb-0.5">Minha conta</span>
                                        <span className="max-w-[150px] truncate">{user.email}</span>
                                    </div>
                                    <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", isDropdownOpen && "rotate-180")} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                        <button
                                            onClick={() => {
                                                setIsPasswordModalOpen(true);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <Lock className="h-4 w-4" />
                                            Alterar senha
                                        </button>
                                        <button
                                            onClick={logout}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </header>
    );
}
