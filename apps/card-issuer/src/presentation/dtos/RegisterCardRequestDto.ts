import { z } from 'zod';
import { Currency } from '@io/shared';

export const RegisterCardRequestDto = z.object({
  customer: z.object({
    documentType: z.literal('DNI'),
    documentNumber: z.string().min(8).max(8),
    email: z.string().email(),
    age: z.number().int().min(18),
  }),
  product: z.object({
    type: z.literal('VISA'),
    currency: z.enum([Currency.PEN, Currency.USD]),
  }),
  forceError: z.boolean(),
});
