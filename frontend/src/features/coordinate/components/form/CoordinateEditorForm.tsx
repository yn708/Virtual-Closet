'use client';

import ImageFormField from '@/features/fashion-items/components/form/field/ImageFormField';
import { usePhotoCoordinateForm } from '../../hooks/usePhotoCoordinateForm';
import type { CoordinateEditTypes, CoordinateMetaDataTypes } from '../../types';
import CoordinateEditorSelectFormFields from './field/CoordinateEditorSelectFormFields';

const CoordinateEditorForm = ({
  metaData,
  initialData,
  onSuccess,
}: CoordinateMetaDataTypes & CoordinateEditTypes) => {
  const { state, formAction, isProcessing, preview } = usePhotoCoordinateForm({
    initialData,
    onSuccess,
  });

  const currentPreview = preview || initialData?.image; // previewがある場合に優先で表示

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
          initialData={initialData}
          isProcessing={isProcessing}
          state={state}
        />
      </div>
    </form>
  );
};

export default CoordinateEditorForm;
