import SubmitButton from '@/components/elements/button/SubmitButton';
import CheckboxField from '@/components/elements/form/checkbox/CheckboxFormField';
import FloatingLabelInput from '@/components/elements/form/input/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/elements/form/input/FloatingLabelTextarea';
import FloatingLabelSelect from '@/components/elements/form/select/FloatingLabelSelect';
import { PRIVACY_URL } from '@/utils/constants';
import { SUBJECT_OPTIONS } from '@/utils/data/selectData';
import type { FormStepProps } from '../types';
import NormalLink from '@/components/elements/link/NormalLink';

const FormStep = ({
  isSession,
  states,
  onFieldChange,
  onCheckboxChange,
  onNext,
}: FormStepProps) => {
  const { currentStep, formData, errors } = states;

  return (
    // フィールドは必須なのでhiddenにして隠すようにする
    <div className={`${currentStep !== 1 && 'hidden'} w-full space-y-6`}>
      {/* 未ログイン時のみ表示する入力フィールド */}
      {!isSession && (
        <>
          <FloatingLabelInput
            name="name"
            label="お名前"
            defaultValue={formData.name}
            onChange={onFieldChange('name')}
            error={errors?.name}
          />
          <FloatingLabelInput
            name="email"
            label="メールアドレス"
            type="email"
            defaultValue={formData.email}
            onChange={onFieldChange('email')}
            error={errors?.email}
          />
        </>
      )}

      {/* 共通の入力フィールド */}
      <FloatingLabelSelect
        name="subject"
        label="件名"
        options={SUBJECT_OPTIONS}
        defaultValue={formData.subject}
        onChange={onFieldChange('subject')}
        error={errors?.subject}
      />
      <FloatingLabelTextarea
        name="message"
        label="お問い合わせ内容"
        defaultValue={formData.message}
        onChange={onFieldChange('message')}
        error={errors?.message}
        rows={5}
      />

      {/* プライバシーポリシー同意チェックボックス */}
      <CheckboxField
        name="privacyAgreed"
        label={
          <>
            <NormalLink
              href={PRIVACY_URL}
              rel="nofollow"
              prefetch={false}
              target="_blank"
              label="プライバシーポリシー"
            />

            <span className="pl-1">に同意する</span>
          </>
        }
        error={errors?.privacyAgreed}
        onChange={onCheckboxChange}
      />

      {/* 次のステップへ進むボタン */}
      <div className="flex justify-end">
        <SubmitButton
          label="確認画面へ"
          disabled={!formData.privacyAgreed}
          onClick={onNext}
          type="button"
        />
      </div>
    </div>
  );
};
export default FormStep;
