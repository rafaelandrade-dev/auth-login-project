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
        <div className="min-h-screen bg-bg grid md:grid-cols-2">
            {/* Left Column: Decorative Panel */}
            <div className="hidden md:flex relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-600 to-violet-800 p-12 flex-col justify-between">
                {/* Decorative blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-violet-400/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-glow-sm">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">UserHub</span>
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-5xl font-extrabold text-white leading-tight mb-6">
                            Comece sua <span className="text-primary-200">jornada</span> com a gente.
                        </h2>
                        <p className="text-lg text-primary-100/80 leading-relaxed">
                            Crie sua conta em poucos segundos e tenha acesso imediato a todas as ferramentas de gestão e segurança.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Form Panel */}
            <div className="flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
                {/* Mobile background glows */}
                <div className="md:hidden fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
                </div>

                <div className="w-full max-w-md animate-fade-in-up">
                    <div className="rounded-2xl bg-surface border border-border-subtle shadow-card p-8 md:p-10">
                        {/* Header */}
                        <div className="flex flex-col items-center mb-10">
                            <div className="md:hidden flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 shadow-glow-sm mb-6">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-text-primary tracking-tight text-center">
                                Criar conta
                            </h1>
                            <p className="text-sm text-text-muted mt-2 text-center">
                                Junte-se a nós e comece a gerenciar seu time agora.
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

                            <Input
                                label="Senha"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="••••••••"
                                error={errors.password?.message}
                                icon={<LockKeyhole className="h-4 w-4" />}
                                suffix={
                                    <button
                                        type="button"
                                        className="text-text-muted hover:text-text-primary transition-colors focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword
                                            ? <EyeOff className="h-4 w-4 !text-[#818CF8]" />
                                            : <Eye className="h-4 w-4 !text-[#818CF8]" />
                                        }
                                    </button>
                                }
                                {...register('password')}
                            />

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full mt-2 hover-shimmer"
                                loading={isSubmitting}
                            >
                                Finalizar cadastro
                            </Button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-border-subtle text-center">
                            <p className="text-sm text-text-muted">
                                Já tem uma conta?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center gap-1"
                                >
                                    <span aria-hidden="true">&larr;</span>
                                    Voltar para o login
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer text */}
                    <p className="mt-8 text-center text-xs text-text-muted/60">
                        Ao criar uma conta, você concorda com nossos Termos de Serviço e Política de Privacidade.
                    </p>
                </div>
            </div>
        </div>
    );
}
