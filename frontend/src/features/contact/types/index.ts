/*----------------------------------------------------------------
Form関連
----------------------------------------------------------------*/
export interface ContactSubmitData {
  name?: string;
  email?: string;
  subject: string;
  message: string;
}
export interface ContactFormData extends ContactSubmitData {
  privacyAgreed: boolean;
}
export interface ValidationErrors {
  name?: string[];
  email?: string[];
  subject?: string[];
  message?: string[];
  privacyAgreed?: string[];
}

/*----------------------------------------------------------------
Props
----------------------------------------------------------------*/
export interface FormStepProps {
  isSession: boolean; // ログイン状態
  states: {
    formData: ContactFormData; // フォームデータ
    errors: ValidationErrors | null; // バリデーションエラー
    currentStep: number; // バリデーションエラー
  };
  onFieldChange: (field: keyof ContactFormData) => (value: string) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}

export interface ConfirmationStepProps {
  isSession: boolean;
  formData: ContactFormData;
  onBack: () => void;
}
