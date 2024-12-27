'use client';

import { useImage } from '@/context/ImageContext';
import ImageFormField from '@/features/fashion-items/components/form/field/ImageFormField';
import type { FormState } from '@/types';
import { initialState } from '@/utils/data/initialState';
import { useFormState } from 'react-dom';
import type { CoordinateEditorFormProps } from '../../types';
import CoordinateEditorSelectFormFields from './field/CoordinateEditorSelectFormFields';
import { photoCoordinateCreateAction } from '@/lib/actions/outfit/photoCoordinateCreateAction';

const CoordinateEditorForm = ({ metaData }: CoordinateEditorFormProps) => {
  const { isProcessing, preview, clearImage } = useImage();

  // アイテム作成用アクション
  const handleCreateAction = async (prevState: FormState, formData: FormData) => {
    const result = await photoCoordinateCreateAction(prevState, formData);
    if (result.success) {
      clearImage();
    }
    return result;
  };

  const [state, formAction] = useFormState(handleCreateAction, initialState);
  const currentPreview = preview || undefined;

  return (
    <form action={formAction} className="max-w-7xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        コーディネート登録
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-10 gap-0">
        {/* 画像アップロードエリア */}
        <ImageFormField
          isProcessing={isProcessing}
          preview={currentPreview}
          error={state.errors?.image}
        />

        {/* 選択フォームエリア */}
        <CoordinateEditorSelectFormFields
          metaData={metaData}
          isProcessing={isProcessing}
          state={state}
        />
      </div>
    </form>
  );
};

export default CoordinateEditorForm;
