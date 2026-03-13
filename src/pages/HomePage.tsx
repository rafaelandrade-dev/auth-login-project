import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Eye, Pencil, Trash2, UserPlus, AlertCircle, Users, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

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

// Helper to get initials from a name
function getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

// Colored avatar based on initials
function UserAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
    const colors = [
        'from-blue-500 to-indigo-600',
        'from-violet-500 to-purple-600',
        'from-pink-500 to-rose-600',
        'from-teal-500 to-emerald-600',
        'from-orange-500 to-amber-600',
    ];
    const colorIdx = name.charCodeAt(0) % colors.length;
    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
    };
    return (
        <div className={cn(
            'flex items-center justify-center rounded-full bg-gradient-to-br font-bold text-white flex-shrink-0 shadow-sm',
            colors[colorIdx],
            sizeClasses[size]
        )}>
            {getInitials(name)}
        </div>
    );
}

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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary tracking-tight leading-tight">
                            Usuários
                        </h1>
                        <p className="mt-1 text-sm text-text-muted">
                            Gerencie todos os usuários cadastrados no sistema.
                        </p>
                    </div>
                    <Button
                        className="flex items-center gap-2 hover-shimmer self-start sm:self-auto"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <UserPlus className="h-4 w-4" />
                        Novo Usuário
                    </Button>
                </div>

                {/* Error state */}
                {isError ? (
                    <div className="rounded-2xl bg-danger/5 border border-danger/20 p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10 ring-4 ring-danger/5">
                                <AlertCircle className="h-8 w-8 text-danger" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                            Erro ao carregar usuários
                        </h3>
                        <p className="text-sm text-text-muted mb-8 max-w-sm mx-auto">
                            {error instanceof Error ? error.message : 'Ocorreu um erro ao tentar buscar a lista de usuários.'}
                        </p>
                        <Button variant="outline" onClick={() => refetch()} className="gap-2">
                            Tentar novamente
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Controls bar */}
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-sm text-text-muted">
                                {isLoading ? (
                                    <span className="inline-block h-4 w-32 bg-surface-hover rounded animate-pulse" />
                                ) : (
                                    <>
                                        <span className="font-semibold text-text-primary">{data?.total || 0}</span>{' '}
                                        usuário{(data?.total || 0) !== 1 ? 's' : ''} encontrado{(data?.total || 0) !== 1 ? 's' : ''}
                                    </>
                                )}
                            </span>
                        </div>

                        {/* Table */}
                        <div className="rounded-xl border border-border-subtle overflow-hidden shadow-card">
                            <table className="min-w-full">
                                {/* Table Head */}
                                <thead>
                                    <tr className="bg-[#252842] border-b border-border-subtle">
                                        <th scope="col" className="py-3.5 pl-5 pr-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted w-16">
                                            ID
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                                            Nome
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted hidden sm:table-cell">
                                            E-mail
                                        </th>
                                        <th scope="col" className="py-3.5 pl-3 pr-5 text-right text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="bg-surface divide-y divide-border-subtle/50">
                                    {isLoading ? (
                                        Array.from({ length: 6 }).map((_, idx) => (
                                            <tr key={`skeleton-${idx}`} className={cn(
                                                'animate-pulse',
                                                idx % 2 === 1 ? 'bg-surface-hover/20' : 'bg-surface'
                                            )}>
                                                <td className="py-4 pl-5 pr-3">
                                                    <div className="h-5 w-10 rounded-md bg-surface-hover" />
                                                </td>
                                                <td className="px-3 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-surface-hover flex-shrink-0" />
                                                        <div className="h-4 w-28 rounded bg-surface-hover" />
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 hidden sm:table-cell">
                                                    <div className="h-4 w-44 rounded bg-surface-hover" />
                                                </td>
                                                <td className="py-4 pl-3 pr-5">
                                                    <div className="flex justify-end gap-2">
                                                        <div className="h-7 w-7 rounded-lg bg-surface-hover" />
                                                        <div className="h-7 w-7 rounded-lg bg-surface-hover" />
                                                        <div className="h-7 w-7 rounded-lg bg-surface-hover" />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : data?.data && data.data.length > 0 ? (
                                        data.data.map((user, idx) => (
                                            <tr
                                                key={user.id}
                                                className={cn(
                                                    'group transition-colors duration-100 cursor-default',
                                                    idx % 2 === 1 ? 'bg-surface-hover/20' : 'bg-surface',
                                                    'hover:bg-primary-600/5'
                                                )}
                                            >
                                                {/* ID */}
                                                <td className="whitespace-nowrap py-3.5 pl-5 pr-3">
                                                    <span className="inline-flex items-center rounded-md bg-surface-hover px-2 py-1 text-xs font-mono font-medium text-text-muted ring-1 ring-inset ring-border-subtle">
                                                        #{user.id}
                                                    </span>
                                                </td>

                                                {/* Name with avatar */}
                                                <td className="whitespace-nowrap px-3 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <UserAvatar name={user.name} />
                                                        <div>
                                                            <span className="text-sm font-semibold text-text-primary">
                                                                {user.name}
                                                            </span>
                                                            {user.id === authUser?.id && (
                                                                <span className="ml-2 inline-flex items-center rounded-full bg-primary-600/15 px-1.5 py-0.5 text-[10px] font-medium text-primary-300 ring-1 ring-primary-500/20">
                                                                    Você
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Email */}
                                                <td className="whitespace-nowrap px-3 py-3.5 hidden sm:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3.5 w-3.5 text-text-muted/50 flex-shrink-0" />
                                                        <span className="text-sm text-text-muted">{user.email}</span>
                                                    </div>
                                                </td>

                                                {/* Actions */}
                                                <td className="relative whitespace-nowrap py-3.5 pl-3 pr-5">
                                                    <div className="flex justify-end gap-1">
                                                        {/* View */}
                                                        <button
                                                            className="h-8 w-8 flex items-center justify-center rounded-lg text-text-muted hover:text-primary-400 hover:bg-primary-600/10 transition-all duration-150"
                                                            title="Ver detalhes"
                                                            onClick={() => {
                                                                setSelectedUserId(user.id);
                                                                setIsDetailOpen(true);
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>

                                                        {/* Edit */}
                                                        <button
                                                            className={cn(
                                                                'h-8 w-8 flex items-center justify-center rounded-lg transition-all duration-150',
                                                                user.id === authUser?.id
                                                                    ? 'text-text-muted hover:text-warning hover:bg-warning/10'
                                                                    : 'text-text-muted/20 cursor-not-allowed'
                                                            )}
                                                            title={user.id === authUser?.id ? 'Editar usuário' : 'Apenas o próprio usuário pode editar'}
                                                            disabled={user.id !== authUser?.id}
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setIsEditOpen(true);
                                                            }}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>

                                                        {/* Delete */}
                                                        <button
                                                            className="h-8 w-8 flex items-center justify-center rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-all duration-150"
                                                            title="Excluir usuário"
                                                            onClick={() => {
                                                                setUserToDelete(user);
                                                                setIsDeleteOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-24 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary-600/10 ring-4 ring-primary-600/5">
                                                        <Users className="h-10 w-10 text-primary-400/70" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-semibold text-text-primary mb-1">
                                                            Nenhum usuário cadastrado ainda.
                                                        </h3>
                                                        <p className="text-sm text-text-muted mb-6">
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
                        {!isLoading && data && (
                            <div className="mt-5 flex items-center justify-between px-1">
                                <p className="text-xs text-text-muted">
                                    <span className="font-semibold text-text-primary">{data.total}</span> usuário{data.total !== 1 ? 's' : ''} •{' '}
                                    Página <span className="font-semibold text-text-primary">{page}</span> de{' '}
                                    <span className="font-semibold text-text-primary">{totalPages || 1}</span>
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        className={cn(
                                            'h-8 w-8 flex items-center justify-center rounded-lg border border-border-subtle transition-all duration-150 text-text-muted',
                                            page === 1 || isLoading
                                                ? 'opacity-30 cursor-not-allowed'
                                                : 'hover:bg-surface-hover hover:text-text-primary hover:border-primary-500/40'
                                        )}
                                        onClick={handlePreviousPage}
                                        disabled={page === 1 || isLoading}
                                        title="Página anterior"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>

                                    {/* Page number pills */}
                                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={cn(
                                                    'h-8 min-w-[2rem] px-2 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-150 border',
                                                    page === pageNum
                                                        ? 'bg-primary-600 text-white border-primary-600 shadow-glow-sm'
                                                        : 'border-border-subtle text-text-muted hover:bg-surface-hover hover:text-text-primary'
                                                )}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}

                                    <button
                                        className={cn(
                                            'h-8 w-8 flex items-center justify-center rounded-lg border border-border-subtle transition-all duration-150 text-text-muted',
                                            page === totalPages || isLoading || totalPages === 0
                                                ? 'opacity-30 cursor-not-allowed'
                                                : 'hover:bg-surface-hover hover:text-text-primary hover:border-primary-500/40'
                                        )}
                                        onClick={handleNextPage}
                                        disabled={page === totalPages || isLoading || totalPages === 0}
                                        title="Próxima página"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}
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
