import type { ProfileUpdateFormSchema } from '@/utils/validations/user-validation';
import type { z } from 'zod';

/* ----------------------------------------------------------------
FormData
------------------------------------------------------------------ */
export type ProfileEditFormData = z.infer<typeof ProfileUpdateFormSchema>;
