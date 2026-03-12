import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { ModalFooter } from './ui/ModalFooter';
import { UserFormFields } from './ui/UserFormFields';
import { createUser } from '../api/users.service';
import { getApiErrorMessage } from '../lib/utils';
import { nameEmailSchema } from '../lib/userSchemas';
import type { CreateUserPayload } from '../types/user';

const userCreateSchema = nameEmailSchema.extend({
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
        defaultValues: { name: '', email: '', password: '' },
    });

    const mutation = useMutation({
        mutationFn: (payload: CreateUserPayload) => createUser(payload),
        onSuccess: () => {
            toast.success('Usuário criado com sucesso!');
            reset();
            onSuccess();
            onClose();
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const onSubmit = (data: UserCreateFormValues) => mutation.mutate(data);

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Criar Novo Usuário">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <UserFormFields register={register as never} errors={errors} />

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

                <ModalFooter
                    onClose={handleClose}
                    isLoading={mutation.isPending}
                    submitLabel="Criar"
                    formAction
                />
            </form>
        </Modal>
    );
}
