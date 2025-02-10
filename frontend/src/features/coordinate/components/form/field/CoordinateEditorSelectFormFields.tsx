import SubmitButton from '@/components/elements/button/SubmitButton';
import AccordionToggleGroupField from '@/components/elements/form/select/AccordionToggleGroupField';
import type {
  CoordinateInitialDataTypes,
  CoordinateMetaDataTypes,
} from '@/features/coordinate/types';
import type { BaseFieldsStateProps } from '@/types';

const CoordinateEditorSelectFormFields = ({
  metaData,
  initialData,
  state,
}: BaseFieldsStateProps & CoordinateMetaDataTypes & CoordinateInitialDataTypes) => {
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
            defaultValue: initialData?.tastes?.map((taste) => taste.id),
          },
          {
            name: 'scenes',
            label: 'シーン',
            options: metaData.scenes,
            labelKey: 'scene',
            maxSelections: 3,
            error: state.errors?.scenes,
            defaultValue: initialData?.scenes?.map((scene) => scene.id),
          },
          {
            name: 'seasons',
            label: 'シーズン',
            options: metaData.seasons,
            labelKey: 'season_name',
            error: state.errors?.seasons,
            defaultValue: initialData?.seasons?.map((season) => season.id),
          },
        ]}
      />

      {/* 送信ボタン */}
      <div className="flex justify-end items-center">
        <SubmitButton label="保存" className="w-full md:w-1/3 rounded-xl shadow-md" />
      </div>
    </div>
  );
};

export default CoordinateEditorSelectFormFields;
