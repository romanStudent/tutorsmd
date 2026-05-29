import { z } from 'zod';
export const schema = z.object({
    newEmail: z.string().email('Ungültige E-Mail'),
    password: z.string().min(1, 'Erforderlich'),
});
