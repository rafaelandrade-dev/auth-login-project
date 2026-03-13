import { useQuery } from '@tanstack/react-query';
import { AlertCircle, User as UserIcon, Mail, Hash, CheckCircle2 } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { getUserById } from '../api/users.service';

interface UserDetailModalProps {
    userId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

function getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
}

const AVATAR_COLORS = [
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-pink-500 to-rose-600',
    'from-teal-500 to-emerald-600',
    'from-orange-500 to-amber-600',
];

export function UserDetailModal({ userId, isOpen, onClose }: UserDetailModalProps) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUserById(userId as number),
        enabled: isOpen && userId !== null,
    });

    const avatarColor = data ? AVATAR_COLORS[data.name.charCodeAt(0) % AVATAR_COLORS.length] : AVATAR_COLORS[0];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Usuário">
            {isLoading ? (
                <div className="space-y-5 py-2 animate-pulse">
                    {/* Avatar + name skeleton */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#252842]">
                        <div className="h-14 w-14 rounded-full bg-surface-hover flex-shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-5 w-40 rounded bg-surface-hover" />
                            <div className="h-4 w-20 rounded bg-surface-hover" />
                        </div>
                    </div>
                    {/* Details skeleton */}
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#252842]">
                                <div className="h-4 w-4 rounded bg-surface-hover" />
                                <div className="h-4 w-24 rounded bg-surface-hover" />
                                <div className="h-4 w-36 rounded bg-surface-hover ml-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 ring-4 ring-danger/5">
                        <AlertCircle className="h-7 w-7 text-danger" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-1">Erro ao carregar usuário</h3>
                        <p className="text-xs text-text-muted">
                            {error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.'}
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            ) : data ? (
                <div className="space-y-5 py-2">
                    {/* User profile header */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#252842] border border-border-subtle">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${avatarColor} text-white font-bold text-xl shadow-sm flex-shrink-0`}>
                            {getInitials(data.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-text-primary truncate">{data.name}</h4>
                            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success ring-1 ring-inset ring-success/20 mt-0.5">
                                <CheckCircle2 className="h-3 w-3" />
                                Ativo
                            </span>
                        </div>
                    </div>

                    {/* Details list */}
                    <dl className="space-y-2">
                        {/* ID */}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#252842] border border-border-subtle">
                            <Hash className="h-4 w-4 text-primary-400 flex-shrink-0" />
                            <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted w-24">
                                ID
                            </dt>
                            <dd className="text-sm text-text-primary font-mono ml-auto">
                                #{data.id}
                            </dd>
                        </div>

                        {/* Name */}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#252842] border border-border-subtle">
                            <UserIcon className="h-4 w-4 text-primary-400 flex-shrink-0" />
                            <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted w-24">
                                Nome
                            </dt>
                            <dd className="text-sm text-text-primary ml-auto truncate">
                                {data.name}
                            </dd>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#252842] border border-border-subtle">
                            <Mail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                            <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted w-24">
                                E-mail
                            </dt>
                            <dd className="ml-auto">
                                <a
                                    href={`mailto:${data.email}`}
                                    className="text-sm text-primary-400 hover:text-primary-300 hover:underline transition-colors truncate"
                                >
                                    {data.email}
                                </a>
                            </dd>
                        </div>
                    </dl>

                    {/* Footer */}
                    <div className="flex justify-end pt-1">
                        <Button onClick={onClose} variant="ghost">
                            Fechar
                        </Button>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
}
