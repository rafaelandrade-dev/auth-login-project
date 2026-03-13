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
import { useAuth } from '../contexts/AuthContext';
import { changePassword } from '../api/users.service';
import { getApiErrorMessage } from '../lib/utils';

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'A senha atual é obrigatória'),
    newPassword: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres'),
    confirmNewPassword: z.string().min(1, 'A confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmNewPassword'],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const { user } = useAuth();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    const mutation = useMutation({
        mutationFn: (data: Omit<ChangePasswordFormValues, 'confirmNewPassword'>) => {
            if (!user?.id) throw new Error('Usuário não autenticado');
            return changePassword(user.id, data);
        },
        onSuccess: () => {
            toast.success('Senha alterada com sucesso!');
            handleClose();
        },
        onError: (error: unknown) => {
            toast.error(getApiErrorMessage(error));
        },
    });

    const onSubmit = (data: ChangePasswordFormValues) => {
        mutation.mutate({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Alterar Senha">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Senha Atual"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    error={errors.currentPassword?.message}
                    suffix={
                        <button
                            type="button"
                            className="text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            tabIndex={-1}
                        >
                            {showCurrentPassword
                                ? <EyeOff className="h-4 w-4 !text-[#818CF8]" />
                                : <Eye className="h-4 w-4 !text-[#818CF8]" />
                            }
                        </button>
                    }
                    {...register('currentPassword')}
                />

                <Input
                    label="Nova Senha"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    error={errors.newPassword?.message}
                    suffix={
                        <button
                            type="button"
                            className="text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            tabIndex={-1}
                        >
                            {showNewPassword
                                ? <EyeOff className="h-4 w-4 !text-[#818CF8]" />
                                : <Eye className="h-4 w-4 !text-[#818CF8]" />
                            }
                        </button>
                    }
                    {...register('newPassword')}
                />

                <Input
                    label="Confirmar Nova Senha"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    error={errors.confirmNewPassword?.message}
                    suffix={
                        <button
                            type="button"
                            className="text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex={-1}
                        >
                            {showConfirmPassword
                                ? <EyeOff className="h-4 w-4 !text-[#818CF8]" />
                                : <Eye className="h-4 w-4 !text-[#818CF8]" />
                            }
                        </button>
                    }
                    {...register('confirmNewPassword')}
                />

                <ModalFooter
                    onClose={handleClose}
                    isLoading={mutation.isPending}
                    submitLabel="Alterar senha"
                    formAction
                />
            </form>
        </Modal>
    );
}
