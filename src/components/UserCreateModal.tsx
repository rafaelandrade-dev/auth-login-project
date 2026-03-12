import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { createUser } from '../api/users.service';
import { getApiErrorMessage } from '../lib/utils';
import type { CreateUserPayload } from '../types/user';

const userCreateSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().min(1, 'O e-mail é obrigatório').email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type UserCreateFormValues = z.infer<typeof userCreateSchema>;

interface UserCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function UserCreateModal({ isOpen, onClose, onSuccess }: UserCreateModalProps) {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserCreateFormValues>({
        resolver: zodResolver(userCreateSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const mutation = useMutation({
        mutationFn: (payload: CreateUserPayload) => createUser(payload),
        onSuccess: () => {
            toast.success('Usuário criado com sucesso!');
            reset();
            onSuccess();
            onClose();
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const onSubmit = (data: UserCreateFormValues) => {
        mutation.mutate({
            name: data.name,
            email: data.email,
            password: data.password,
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Criar Novo Usuário">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Nome"
                    type="text"
                    autoComplete="name"
                    placeholder="Nome completo"
                    error={errors.name?.message}
                    {...register('name')}
                />

                <Input
                    label="E-mail"
                    type="email"
                    autoComplete="email"
                    placeholder="email@exemplo.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <div className="relative">
                    <Input
                        label="Senha"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button type="button" variant="ghost" onClick={handleClose} disabled={mutation.isPending}>
                        Cancelar
                    </Button>
                    <Button type="submit" loading={mutation.isPending}>
                        Criar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
