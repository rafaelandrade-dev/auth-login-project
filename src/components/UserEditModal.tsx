import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Modal } from './ui/Modal';
import { ModalFooter } from './ui/ModalFooter';
import { UserFormFields } from './ui/UserFormFields';
import { updateUser } from '../api/users.service';
import { getApiErrorMessage } from '../lib/utils';
import { nameEmailSchema, type NameEmailFormValues } from '../lib/userSchemas';
import type { User } from '../types/user';

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
    } = useForm<NameEmailFormValues>({
        resolver: zodResolver(nameEmailSchema),
        defaultValues: { name: '', email: '' },
    });

    // Preenche o formulário ao abrir com os dados do usuário selecionado
    useEffect(() => {
        if (user) {
            reset({ name: user.name, email: user.email });
        }
    }, [user, reset]);

    const mutation = useMutation({
        mutationFn: (payload: NameEmailFormValues) => {
            if (!user) throw new Error('Usuário não selecionado');
            return updateUser(user.id, payload);
        },
        onSuccess: () => {
            toast.success('Usuário atualizado com sucesso!');
            onSuccess();
            onClose();
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuário">
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                <UserFormFields register={register as never} errors={errors} />
                <ModalFooter
                    onClose={onClose}
                    isLoading={mutation.isPending}
                    submitLabel="Salvar"
                    formAction
                />
            </form>
        </Modal>
    );
}
