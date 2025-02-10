'use client';
import type { InitialItemsProps } from '@/features/my-page/coordinate/types';
import type { CoordinateMetaDataType } from '@/types/coordinate';
import { useCustomCoordinateForm } from '../../hooks/useCustomCoordinateForm';
import type { CoordinateEditTypes } from '../../types';
import CoordinateEditorSelectFormFields from './field/CoordinateEditorSelectFormFields';

interface CustomCoordinateEditorFormProps extends InitialItemsProps, CoordinateEditTypes {
  metaData: CoordinateMetaDataType;
}

const CustomCoordinateEditorForm = ({
  metaData,
  initialData,
  initialItems,
  onSuccess,
}: CustomCoordinateEditorFormProps) => {
  const { state, formAction } = useCustomCoordinateForm({
    initialItems,
    initialData,
    onSuccess,
  });

  return (
    <form action={formAction} className="w-full">
      <CoordinateEditorSelectFormFields
        metaData={metaData}
        state={state}
        initialData={initialData}
      />
    </form>
  );
};

export default CustomCoordinateEditorForm;
