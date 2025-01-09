import SubmitButton from '@/components/elements/button/SubmitButton';
import { Button } from '@/components/ui/button';
import { SUBJECT_OPTIONS } from '@/utils/data/selectData';
import type { ConfirmationStepProps } from '../types';

const ConfirmationStep = ({ isSession, formData, onBack }: ConfirmationStepProps) => (
  <div className="space-y-6">
    {/* 入力内容の確認表示 */}
    <div className="border p-8 rounded-lg space-y-4">
      {/* 未ログイン時のみ表示する確認項目 */}
      {!isSession && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">お名前</div>
            <div className="col-span-2">{formData.name}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">メールアドレス</div>
            <div className="col-span-2">{formData.email}</div>
          </div>
        </>
      )}
      {/* 共通の確認項目 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="font-medium">件名</div>
        <div className="col-span-2">
          {SUBJECT_OPTIONS.find((opt) => opt.id === formData.subject)?.name}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="font-medium">お問い合わせ内容</div>
        <div className="col-span-2 whitespace-pre-wrap">{formData.message}</div>
      </div>
    </div>
    {/*  操作ボタン */}
    <div className="flex justify-between">
      <Button type="button" onClick={onBack} variant="link" className="text-red-500">
        修正する
      </Button>
      <SubmitButton className="w-1/3" />
    </div>
  </div>
);
export default ConfirmationStep;
