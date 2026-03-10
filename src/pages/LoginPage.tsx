import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../api/auth.service';
import { getApiErrorMessage } from '../lib/utils';
import type { LoginPayload } from '../types/auth';

const loginSchema = z.object({
    email: z.string().min(1, 'O e-mail é obrigatório(a)').email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const payload: LoginPayload = {
                email: data.email,
                password: data.password,
            };

            const response = await loginUser(payload);
            login(response.token);
            navigate('/', { replace: true });
        } catch (error) {
            const errorMessage = getApiErrorMessage(error);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Entrar na conta</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Ou{' '}
                        <Link to="/cadastro" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                            faça seu cadastro
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Input
                            label="E-mail"
                            type="email"
                            autoComplete="email"
                            placeholder="seu@email.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div className="relative">
                            <Input
                                label="Senha"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
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
                    </div>

                    <Button type="submit" className="w-full" loading={isSubmitting}>
                        Entrar
                    </Button>
                </form>
            </div>
        </div>
    );
}
