'use client';

import { useItemEditorForm } from '../../hooks/useItemEditorForm';
import type { ItemEditorFormProps } from '../../types';
import ImageFormField from './field/ImageFormField';
import ItemEditorSelectFormFields from './field/ItemEditorSelectFormFields';

export default function ItemEditorForm({ metaData, initialData, onSuccess }: ItemEditorFormProps) {
  const { state, formAction, isProcessing, preview } = useItemEditorForm({
    initialData,
    onSuccess,
  });

  const currentPreview = preview || initialData?.image; // previewがある場合に優先で表示

  return (
    <form action={formAction} className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-10 gap-0">
        <ImageFormField
          isProcessing={isProcessing}
          preview={currentPreview}
          error={state.errors?.image}
        />

        <ItemEditorSelectFormFields
          metaData={metaData}
          initialData={initialData}
          isProcessing={isProcessing}
          state={state}
        />
      </div>
    </form>
  );
}
