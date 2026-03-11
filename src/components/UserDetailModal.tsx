import { useQuery } from '@tanstack/react-query';
import { AlertCircle, User as UserIcon, Mail, Hash } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { getUserById } from '../api/users.service';

interface UserDetailModalProps {
    userId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

export function UserDetailModal({ userId, isOpen, onClose }: UserDetailModalProps) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUserById(userId as number),
        enabled: isOpen && userId !== null,
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Usuário">
            {isLoading ? (
                <div className="space-y-4 py-4">
                    <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100 space-y-4">
                        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            ) : isError ? (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-red-800">Erro ao carregar usuário</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.'}</p>
                            </div>
                            <div className="mt-4">
                                <Button variant="ghost" className="text-red-800 hover:bg-red-100" onClick={onClose}>
                                    Fechar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : data ? (
                <div className="space-y-6 py-2">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                            <span className="text-2xl font-bold uppercase">{data.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-gray-900">{data.name}</h4>
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mt-1">
                                Ativo
                            </span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                        <dl className="divide-y divide-gray-200">
                            <div className="px-4 py-4 sm:flex sm:items-center sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 sm:w-1/3 flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-gray-400" />
                                    ID do Usuário
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-mono">
                                    {data.id}
                                </dd>
                            </div>

                            <div className="px-4 py-4 sm:flex sm:items-center sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 sm:w-1/3 flex items-center gap-2">
                                    <UserIcon className="h-4 w-4 text-gray-400" />
                                    Nome Completo
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    {data.name}
                                </dd>
                            </div>

                            <div className="px-4 py-4 sm:flex sm:items-center sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 sm:w-1/3 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    Endereço de E-mail
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                    <a href={`mailto:${data.email}`} className="text-indigo-600 hover:text-indigo-500 hover:underline">
                                        {data.email}
                                    </a>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button onClick={onClose}>
                            Fechar
                        </Button>
                    </div>
                </div>
            ) : null}
        </Modal>
    );
}
