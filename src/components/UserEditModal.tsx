import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { updateUser } from '../api/users.service';
import { getApiErrorMessage } from '../lib/utils';
import type { User, UpdateUserPayload } from '../types/user';

const userEditSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().min(1, 'O e-mail é obrigatório').email('E-mail inválido'),
});

type UserEditFormValues = z.infer<typeof userEditSchema>;

interface UserEditModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function UserEditModal({ user, isOpen, onClose, onSuccess }: UserEditModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserEditFormValues>({
        resolver: zodResolver(userEditSchema),
        defaultValues: {
            name: '',
            email: '',
        },
    });

    // Atualiza os campos do formulário quando o usuário mudar
    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, reset]);

    const mutation = useMutation({
        mutationFn: (payload: UpdateUserPayload) => {
            if (!user) throw new Error('Usuário não selecionado');
            return updateUser(user.id, payload);
        },
        onSuccess: () => {
            toast.success('Usuário atualizado com sucesso!');
            onSuccess();
            onClose();
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const onSubmit = (data: UserEditFormValues) => {
        mutation.mutate(data);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuário">
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

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>
                        Cancelar
                    </Button>
                    <Button type="submit" loading={mutation.isPending}>
                        Salvar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
