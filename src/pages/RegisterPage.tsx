import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, LockKeyhole, UserRound, Shield } from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { createUser } from '../api/users.service';
import { getApiErrorMessage } from '../lib/utils';
import type { CreateUserPayload } from '../types/user';

const registerSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().min(1, 'O e-mail é obrigatório').email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '' },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            const payload: CreateUserPayload = {
                name: data.name,
                email: data.email,
                password: data.password,
            };
            await createUser(payload);
            toast.success('Conta criada com sucesso!');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
            {/* Background glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="rounded-2xl bg-surface border border-border-subtle shadow-card p-8">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 shadow-glow-sm mb-4">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Criar uma conta</h1>
                        <p className="text-sm text-text-muted mt-1">
                            Preencha os dados abaixo para se cadastrar
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label="Nome"
                            type="text"
                            autoComplete="name"
                            placeholder="Seu nome completo"
                            error={errors.name?.message}
                            icon={<UserRound className="h-4 w-4" />}
                            {...register('name')}
                        />

                        <Input
                            label="E-mail"
                            type="email"
                            autoComplete="email"
                            placeholder="seu@email.com"
                            error={errors.email?.message}
                            icon={<Mail className="h-4 w-4" />}
                            {...register('email')}
                        />

                        <div className="relative">
                            <Input
                                label="Senha"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                error={errors.password?.message}
                                icon={<LockKeyhole className="h-4 w-4" />}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-7 text-text-muted hover:text-text-primary transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <Button type="submit" size="lg" className="w-full mt-2" loading={isSubmitting}>
                            Criar conta
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-text-muted">
                        Já tem uma conta?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            Entrar
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
