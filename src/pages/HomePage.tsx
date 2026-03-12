import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, UserPlus, AlertCircle, Users } from 'lucide-react';

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
            if (data?.data.length === 1 && page > 1) {
                setPage(page - 1);
            }
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const totalPages = data ? Math.ceil(data.total / limit) : 0;
    const handlePreviousPage = () => setPage((old) => Math.max(old - 1, 1));
    const handleNextPage = () => setPage((old) => (totalPages && old < totalPages ? old + 1 : old));

    return (
        <div className="min-h-screen bg-bg">
            <Header />

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Page header */}
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Usuários</h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Gerencie todos os usuários cadastrados no sistema.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Button
                            className="flex items-center gap-2"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <UserPlus className="h-4 w-4" />
                            Novo Usuário
                        </Button>
                    </div>
                </div>

                {/* Error state */}
                {isError ? (
                    <div className="rounded-xl bg-danger/5 border border-danger/20 p-10 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10">
                                <AlertCircle className="h-7 w-7 text-danger" />
                            </div>
                        </div>
                        <h3 className="text-base font-semibold text-text-primary mb-1">Erro ao carregar usuários</h3>
                        <p className="text-sm text-text-muted mb-6">
                            {error instanceof Error ? error.message : 'Ocorreu um erro ao tentar buscar a lista de usuários.'}
                        </p>
                        <Button variant="outline" onClick={() => refetch()}>
                            Tentar novamente
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="rounded-xl border border-border-subtle overflow-hidden shadow-card">
                            <table className="min-w-full divide-y divide-border-subtle">
                                <thead className="bg-surface-hover">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-5 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                                            ID
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                                            Nome
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                                            E-mail
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-5">
                                            <span className="sr-only">Ações</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle bg-surface">
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map((_, idx) => (
                                            <tr key={`skeleton-${idx}`} className="animate-pulse">
                                                <td className="py-4 pl-5 pr-3">
                                                    <div className="h-3.5 w-6 bg-surface-hover rounded" />
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="h-3.5 w-28 bg-surface-hover rounded" />
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="h-3.5 w-44 bg-surface-hover rounded" />
                                                </td>
                                                <td className="py-4 pl-3 pr-5">
                                                    <div className="flex justify-end gap-2">
                                                        <div className="h-7 w-7 bg-surface-hover rounded-md" />
                                                        <div className="h-7 w-7 bg-surface-hover rounded-md" />
                                                        <div className="h-7 w-7 bg-surface-hover rounded-md" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : data?.data && data.data.length > 0 ? (
                                        data.data.map((user) => (
                                            <tr key={user.id} className="group hover:bg-surface-hover/50 transition-colors duration-100">
                                                <td className="whitespace-nowrap py-4 pl-5 pr-3 text-sm font-mono text-text-muted">
                                                    #{user.id}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-text-primary">
                                                    {user.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-text-muted">
                                                    {user.email}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-5">
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            className="h-7 w-7 p-0 flex items-center justify-center rounded-md text-text-muted hover:text-primary-400 hover:bg-primary-600/10 transition-all duration-150"
                                                            title="Ver detalhes"
                                                            onClick={() => {
                                                                setSelectedUserId(user.id);
                                                                setIsDetailOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            className={cn(
                                                                'h-7 w-7 p-0 flex items-center justify-center rounded-md transition-all duration-150',
                                                                user.id === authUser?.id
                                                                    ? 'text-text-muted hover:text-primary-400 hover:bg-primary-600/10'
                                                                    : 'text-border-subtle cursor-not-allowed opacity-40'
                                                            )}
                                                            title={user.id === authUser?.id ? 'Editar' : 'Apenas o próprio usuário pode se editar'}
                                                            disabled={user.id !== authUser?.id}
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setIsEditOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            className="h-7 w-7 p-0 flex items-center justify-center rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-all duration-150"
                                                            title="Deletar"
                                                            onClick={() => {
                                                                setUserToDelete(user);
                                                                setIsDeleteOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-24 text-center">
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-hover">
                                                        <Users className="h-8 w-8 text-text-muted" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-semibold text-text-primary mb-1">
                                                            Nenhum usuário cadastrado ainda.
                                                        </h3>
                                                        <p className="text-sm text-text-muted mb-5">
                                                            Comece criando o primeiro usuário do sistema.
                                                        </p>
                                                    </div>
                                                    <Button
                                                        className="flex items-center gap-2"
                                                        onClick={() => setIsCreateOpen(true)}
                                                    >
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

                        {/* Pagination */}
                        <div className="mt-4 flex items-center justify-between px-1">
                            <p className="text-xs text-text-muted">
                                <span className="font-medium text-text-primary">{data?.data?.length || 0}</span> usuário(s) • Página{' '}
                                <span className="font-medium text-text-primary">{page}</span> de{' '}
                                <span className="font-medium text-text-primary">{totalPages || 1}</span>
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handlePreviousPage}
                                    disabled={page === 1 || isLoading}
                                >
                                    ← Anterior
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={page === totalPages || isLoading || totalPages === 0}
                                >
                                    Próxima →
                                </Button>
                            </div>
                        </div>
                    </>
                )}
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
