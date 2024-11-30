import type {
  ChildrenType,
  ClassNameType,
  DescriptionType,
  FormState,
  LabelType,
  SubDescriptionType,
  TitleType,
} from '@/types';
import type {
  authCodeFormSchema,
  loginFormSchema,
  passwordResetConfirmFormSchema,
  passwordResetFormSchema,
  signUpFormSchema,
} from '@/utils/validations/auth-validation';
import type { ReactNode } from 'react';
import type { z } from 'zod';

/* ----------------------------------------------------------------
FormData
------------------------------------------------------------------ */
export type LoginFormData = z.infer<typeof loginFormSchema>;

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export type AuthCodeFormSchema = z.infer<typeof authCodeFormSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetFormSchema>;
export type PasswordResetConfirmFormData = z.infer<typeof passwordResetConfirmFormSchema>;

/* ----------------------------------------------------------------
Form
------------------------------------------------------------------ */
export interface AuthFormProps {
  formAction: (formData: FormData) => void;
  submitButtonLabel: string;
  mode: 'login' | 'signup' | 'email-only' | 'password';
  pending?: boolean;
  state: FormState;
  passwordLabel?: string;
}
/* ----------------------------------------------------------------
プライバシーポリシー、利用規約関連
------------------------------------------------------------------ */
export interface LegalDialogProps extends LabelType, ClassNameType {
  data: LegalDocument;
}

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
export interface AuthPageTemplateProps
  extends ChildrenType,
    TitleType,
    DescriptionType,
    SubDescriptionType {
  isReversed?: boolean; // コンテンツ反転
}

/* ----------------------------------------------------------------
コンテンツ
------------------------------------------------------------------ */
export interface ImageAndContentSplitLayoutProps {
  leftContent: ReactNode;
  rightContent?: ReactNode;
  rightBackgroundImage?: string;
  rightOverlayClassName?: string;
  isReversed?: boolean; // コンテンツ反転
}

export interface PasswordResetContentProps {
  mode: 'request' | 'confirm';
  uid?: string;
  token?: string;
}
