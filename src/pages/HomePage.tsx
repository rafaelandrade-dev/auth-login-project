import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, UserPlus, AlertCircle } from 'lucide-react';

import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { UserDetailModal } from '../components/UserDetailModal';
import { UserCreateModal } from '../components/UserCreateModal';
import { UserEditModal } from '../components/UserEditModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { getUsers, deleteUser } from '../api/users.service';
import { useAuth } from '../contexts/AuthContext';
import { cn, getApiErrorMessage } from '../lib/utils';
import { toast } from 'sonner';
import type { User } from '../types/user';

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    const initialLimit = parseInt(searchParams.get('limit') || '10', 10);

    const [page, setPage] = useState(initialPage);
    const [limit] = useState(initialLimit);

    const { user: authUser } = useAuth();
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        setSearchParams({ page: page.toString(), limit: limit.toString() });
    }, [page, limit, setSearchParams]);

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['users', page, limit],
        queryFn: () => getUsers(page, limit),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteUser(id),
        onSuccess: () => {
            toast.success('Usuário excluído com sucesso!');
            setIsDeleteOpen(false);
            setUserToDelete(null);
            queryClient.invalidateQueries({ queryKey: ['users'] });

            // Lógica de paginação: se deletar o último item de uma página (que não seja a 1), volta uma página
            if (data?.data.length === 1 && page > 1) {
                setPage(page - 1);
            }
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const totalPages = data ? Math.ceil(data.total / limit) : 0;

    const handlePreviousPage = () => {
        setPage((old) => Math.max(old - 1, 1));
    };

    const handleNextPage = () => {
        setPage((old) => (totalPages && old < totalPages ? old + 1 : old));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Usuários</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Uma lista de todos os usuários no sistema, incluindo nome e endereço de e-mail.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Button className="flex items-center gap-2" onClick={() => setIsCreateOpen(true)}>
                            <UserPlus className="h-4 w-4" />
                            Novo Usuário
                        </Button>
                    </div>
                </div>

                {isError ? (
                    <div className="rounded-lg bg-red-50 p-8 text-center border border-red-200">
                        <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                        <h3 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar usuários</h3>
                        <p className="text-sm text-red-700 mb-6">
                            {error instanceof Error ? error.message : 'Ocorreu um erro ao tentar buscar a lista de usuários.'}
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => refetch()}
                            className="bg-red-600 hover:bg-red-700 border-none"
                        >
                            Tentar novamente
                        </Button>
                    </div>
                ) : (
                    <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg bg-white">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    ID
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Nome
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    E-mail
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Ações</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {isLoading ? (
                                                Array.from({ length: 5 }).map((_, idx) => (
                                                    <tr key={`skeleton-${idx}`}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <div className="flex justify-end gap-2 text-gray-200">
                                                                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                                                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                                                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : data?.data && data.data.length > 0 ? (
                                                data.data.map((user) => (
                                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                            {user.id}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {user.name}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {user.email}
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                            <div className="flex justify-end gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                                                                    title="Ver detalhes"
                                                                    onClick={() => {
                                                                        setSelectedUserId(user.id);
                                                                        setIsDetailOpen(true);
                                                                    }}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    className={cn(
                                                                        "h-8 w-8 p-0",
                                                                        user.id === authUser?.id
                                                                            ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                            : "text-gray-300 cursor-not-allowed opacity-50"
                                                                    )}
                                                                    title={user.id === authUser?.id ? "Editar" : "Apenas o próprio usuário pode se editar"}
                                                                    disabled={user.id !== authUser?.id}
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setIsEditOpen(true);
                                                                    }}
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                                                    title="Deletar"
                                                                    onClick={() => {
                                                                        setUserToDelete(user);
                                                                        setIsDeleteOpen(true);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="py-20 text-center">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                                                <Trash2 className="h-8 w-8 text-gray-400" />
                                                            </div>
                                                            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum usuário cadastrado ainda.</h3>
                                                            <p className="text-sm text-gray-500 mb-6">Comece criando o primeiro usuário do sistema.</p>
                                                            <Button className="flex items-center gap-2" onClick={() => setIsCreateOpen(true)}>
                                                                <UserPlus className="h-4 w-4" />
                                                                Criar primeiro usuário
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 shadow rounded-lg">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <Button
                            variant="ghost"
                            onClick={handlePreviousPage}
                            disabled={page === 1 || isLoading}
                            className="border border-gray-300"
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={handleNextPage}
                            disabled={page === totalPages || isLoading || totalPages === 0}
                            className="ml-3 border border-gray-300"
                        >
                            Próxima
                        </Button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{data?.data?.length || 0}</span> resultados | Página <span className="font-medium">{page}</span> de <span className="font-medium">{totalPages || 1}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <Button
                                    variant="ghost"
                                    onClick={handlePreviousPage}
                                    disabled={page === 1 || isLoading}
                                    className="relative inline-flex items-center rounded-l-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
                                >
                                    Anterior
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handleNextPage}
                                    disabled={page === totalPages || isLoading || totalPages === 0}
                                    className="relative inline-flex items-center rounded-r-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
                                >
                                    Próxima
                                </Button>
                            </nav>
                        </div>
                    </div>
                </div>

            </main>

            <UserDetailModal
                userId={selectedUserId}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />

            <UserCreateModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ['users'] });
                }}
            />

            <UserEditModal
                user={selectedUser}
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setSelectedUser(null);
                }}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ['users'] });
                    if (selectedUser) {
                        queryClient.invalidateQueries({ queryKey: ['user', selectedUser.id] });
                    }
                }}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteOpen}
                userName={userToDelete?.name || ''}
                isLoading={deleteMutation.isPending}
                onClose={() => {
                    setIsDeleteOpen(false);
                    setUserToDelete(null);
                }}
                onConfirm={() => {
                    if (userToDelete) {
                        deleteMutation.mutate(userToDelete.id);
                    }
                }}
            />
        </div>
    );
}
