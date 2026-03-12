import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from './Input';
import type { NameEmailFormValues } from '../../lib/userSchemas';

interface UserFormFieldsProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<NameEmailFormValues>;
}

export function UserFormFields({ register, errors }: UserFormFieldsProps) {
    return (
        <>
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
        </>
    );
}
