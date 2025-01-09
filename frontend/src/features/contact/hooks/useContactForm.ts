import { useToast } from '@/hooks/use-toast';
import { contactFormAction } from '@/lib/actions/contact/contactFormAction';
import type { FormState } from '@/types';
import { initialState } from '@/utils/data/initialState';
import {
  anonymousContactSchema,
  authenticatedContactSchema,
} from '@/utils/validations/contact-validation';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import type { ContactFormData, ValidationErrors } from '../types';

export const useContactForm = (isSession: boolean) => {
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    privacyAgreed: false,
  });

  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  //  Step1のバリデーション
  const validateStep1 = () => {
    const schema = isSession ? authenticatedContactSchema : anonymousContactSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return false;
    }

    setErrors(null);
    return true;
  };

  // フィールド値の変更ハンドラー
  const handleFieldChange = (field: keyof ContactFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // チェックボックスの変更ハンドラー
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, privacyAgreed: e.target.checked }));
  };

  // 次のステップへ進む（バリデーションが成功した場合のみ進める）
  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  // 前のステップに戻る
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // フォーム送信時のアクションズ
  const handleFormAction = async (prevState: FormState, formData: FormData) => {
    const result = await contactFormAction(prevState, formData);

    if (result.success) {
      setCurrentStep(3);
    }
    if (result.errors) {
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: 'お問い合わせ送信に失敗しました。',
      });
    }
    return result;
  };
  const [_state, formAction] = useFormState(handleFormAction, initialState);

  // 状態管理をまとめる
  const states = {
    currentStep,
    formData,
    errors,
  };
  // ハンドラーをまとめる
  const handler = {
    handleFieldChange,
    handleCheckboxChange,
    handleNext,
    handleBack,
    formAction,
  };

  return { states, handler };
};
