import { z } from 'zod';

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must be less than 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .transform(val => val.toLowerCase()),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(
            /^(?=.*[a-zA-Z])(?=.*\d)/,
            'Password must contain at least one letter and one number'
        ),
});

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, 'Username is required')
        .transform(val => val.toLowerCase()),
    password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
