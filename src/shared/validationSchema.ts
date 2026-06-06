import { z } from 'zod';
import { validateEmailNoRegex } from './utils';

export const createFormSchema = (allowedCountries: string[]) =>
  z
    .object({
      name: z
        .string()
        .min(1, 'Name is required')
        .refine((val) => {
          if (!val) return false;
          return val[0] === val[0].toUpperCase();
        }, 'The first letter must be capitalized'),

      age: z
        .number({ message: 'Age must be a number' })
        .nonnegative('Age cannot be negative'),
      email: z
        .string()
        .refine(
          validateEmailNoRegex,
          'Invalid email format (requires local part, one @ and dot in domain)'
        ),
      gender: z.enum(['male', 'female'], {
        message: 'Select gender',
      }),
      country: z
        .string()
        .refine(
          (val) => allowedCountries.includes(val),
          'Select a country from the list provided'
        ),
      password: z.string().min(4, 'The password is too shortй'),
      confirmPassword: z.string(),
      terms: z.literal(true, {
        message: 'You must accept the terms and conditions',
      }),

      image: z.custom<FileList>((val) => val instanceof FileList).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'The passwords dont match',
      path: ['confirmPassword'],
    });
