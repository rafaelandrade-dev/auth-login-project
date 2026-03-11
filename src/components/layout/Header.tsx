import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <span className="text-xl font-bold text-indigo-600">AuthSystem</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                {user.email}
                            </span>
                        )}

                        <Link to="#">
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" aria-label="Minha conta">
                                <UserIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="text-gray-500 hover:text-red-600 px-2 flex items-center gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Sair</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
