import type { ChildrenType, DescriptionType, SubDescriptionType, TitleType } from '@/types';
import type {
  authCodeFormSchema,
  loginFormSchema,
  passwordResetConfirmFormSchema,
  passwordResetFormSchema,
  signUpFormSchema,
} from '@/utils/validations/auth-validation';
import type { z } from 'zod';

/* ----------------------------------------------------------------
共通
------------------------------------------------------------------ */
export interface EmailType {
  email: string;
}

/* ----------------------------------------------------------------
FormData
------------------------------------------------------------------ */
export type LoginFormData = z.infer<typeof loginFormSchema>;

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export type AuthCodeFormSchema = z.infer<typeof authCodeFormSchema>;

export type PasswordResetFormData = z.infer<typeof passwordResetFormSchema>;
export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmFormSchema>;

/* ----------------------------------------------------------------
プライバシーポリシー、利用規約関連
------------------------------------------------------------------ */
export interface LegalDocument extends TitleType, DescriptionType {
  sections: LegalDocumentSection[];
}
export interface LegalDocumentSection extends TitleType {
  content:
    | string
    | Array<{
        text: string;
        subItems?: string[];
      }>;
}

/* ----------------------------------------------------------------
レイアウト
------------------------------------------------------------------ */
export interface AuthPageTemplate
  extends ChildrenType,
    TitleType,
    DescriptionType,
    SubDescriptionType {
  isReversed?: boolean; // コンテンツ反転
}
