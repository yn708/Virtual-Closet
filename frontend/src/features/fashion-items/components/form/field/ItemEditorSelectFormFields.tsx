import SubmitButton from '@/components/elements/button/SubmitButton';
import CheckboxFormField from '@/components/elements/form/checkbox/CheckboxFormField';
import SheetSelectField from '@/components/elements/form/select/SheetSelectFormField';
import ToggleGroupFormField from '@/components/elements/form/select/ToggleGroupFormField';
import type { FormFieldsProps } from '@/features/fashion-items/types';
import type { Brand, Design, PriceRange } from '@/types';
import BrandSelectFormField from './BrandSelectFormField';
import CategorySelectField from './CategorySelectField';
import ColorSelectFormField from './ColorSelectFormField';

const ItemEditorSelectFormFields = ({
  metaData,
  initialData,
  isProcessing,
  state,
}: FormFieldsProps) => {
  return (
    <div className="col-span-3">
      <div className="space-y-3 p-3">
        <CategorySelectField
          name="sub_category"
          label="カテゴリー"
          options={metaData.categories}
          error={state.errors?.sub_category}
          value={initialData?.sub_category.id}
        />

        <BrandSelectFormField
          name="brand"
          label="ブランド"
          options={metaData.popular_brands}
          value={initialData?.brand as Brand}
        />

        <SheetSelectField<PriceRange>
          name="price_range"
          options={metaData.price_ranges}
          label="価格帯"
          labelKey="price_range"
          value={initialData?.price_range?.id}
        />

        <SheetSelectField<Design>
          name="design"
          label="柄・特徴"
          options={metaData.designs}
          labelKey="design_pattern"
          value={initialData?.design?.id}
        />

        <ColorSelectFormField
          name="main_color"
          label="メインカラー"
          options={metaData.colors}
          value={initialData?.main_color?.id}
        />
      </div>

      <div className="my-7">
        <ToggleGroupFormField
          name="seasons"
          label="シーズン"
          options={metaData.seasons}
          labelKey="season_name"
          defaultValue={initialData?.seasons?.map((season) => season.id)}
        />
      </div>

      <div className="mb-6">
        <CheckboxFormField
          name="is_owned"
          label="所有している"
          defaultChecked={initialData?.is_owned ?? true}
        />
        <CheckboxFormField
          name="is_old_clothes"
          label="古着"
          defaultChecked={initialData?.is_old_clothes ?? false}
        />
      </div>

      <div className="flex justify-end items-center">
        <SubmitButton
          label="保存"
          disabled={isProcessing}
          className="w-full md:w-1/3 rounded-xl shadow-md"
        />
      </div>
    </div>
  );
};
export default ItemEditorSelectFormFields;
