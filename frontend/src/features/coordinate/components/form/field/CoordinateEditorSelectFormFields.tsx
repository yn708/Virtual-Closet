import SubmitButton from '@/components/elements/button/SubmitButton';
import AccordionToggleGroupField from '@/components/elements/form/select/AccordionToggleGroupField';
import type { CoordinateFormFieldsProps } from '@/features/coordinate/types';

const CoordinateEditorSelectFormFields = ({
  metaData,
  isProcessing,
  state,
}: CoordinateFormFieldsProps) => {
  return (
    <div className="col-span-3 space-y-6">
      <AccordionToggleGroupField
        groups={[
          {
            name: 'tastes',
            label: 'テイスト',
            options: metaData.tastes,
            labelKey: 'taste',
            maxSelections: 3,
            error: state.errors?.tastes,
          },
          {
            name: 'scenes',
            label: 'シーン',
            options: metaData.scenes,
            labelKey: 'scene',
            maxSelections: 3,
            error: state.errors?.scenes,
          },
          {
            name: 'seasons',
            label: 'シーズン',
            options: metaData.seasons,
            labelKey: 'season_name',
            error: state.errors?.seasons,
          },
        ]}
      />

      {/* 送信ボタン */}
      <div className="flex justify-end items-center">
        <SubmitButton
          label="保存"
          disabled={isProcessing}
          loading={isProcessing}
          className="w-full md:w-1/3 rounded-xl shadow-md"
        />
      </div>
    </div>
  );
};

export default CoordinateEditorSelectFormFields;
