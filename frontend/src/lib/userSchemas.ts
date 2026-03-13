import { z } from 'zod';

export const nameEmailSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z.string().min(1, 'O e-mail é obrigatório').email('E-mail inválido'),
});

export type NameEmailFormValues = z.infer<typeof nameEmailSchema>;
