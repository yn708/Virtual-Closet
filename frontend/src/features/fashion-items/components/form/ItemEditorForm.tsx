'use client';

import SubmitButton from '@/components/elements/button/SubmitButton';
import CheckboxFormField from '@/components/elements/form/checkbox/CheckboxFormField';
import SheetSelectField from '@/components/elements/form/select/SheetSelectFormField';
import ToggleGroupFormField from '@/components/elements/form/select/ToggleGroupFormField';
import ImageField from '@/components/elements/image/ImageField';
import { useImage } from '@/context/ImageContext';
import { fashionItemsCreateAction } from '@/lib/actions/outfit/fashionItemsCreateAction';
import type { Design, MetaDataType, PriceRange } from '@/types';
import { CATEGORY_ICONS } from '@/utils/data/icons';
import { initialState } from '@/utils/data/initialState';
import { useFormState } from 'react-dom';
import BrandSelectFormField from './field/BrandSelectFormField';
import CategorySelectField from './field/CategorySelectField';
import ColorSelectFormField from './field/ColorSelectFormField';

export default function ItemEditorForm({ metaData }: { metaData: MetaDataType }) {
  const [state, formAction] = useFormState(fashionItemsCreateAction, initialState);

  const { isProcessing, preview } = useImage();

  return (
    <form action={formAction} className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-10 gap-0">
        <div className="col-span-2 p-4">
          <ImageField isProcessing={isProcessing} preview={preview} error={state.errors?.image} />
        </div>

        <div className="col-span-3">
          <div className="space-y-3 p-3">
            <CategorySelectField
              name="sub_category"
              label="カテゴリー"
              options={metaData.categories}
              error={state.errors?.sub_category}
              renderIcon={(categoryId) => {
                const Icon =
                  CATEGORY_ICONS[categoryId as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.other;
                return <Icon className="size-4" />;
              }}
            />

            <BrandSelectFormField name="brand" label="ブランド" options={metaData.popular_brands} />

            <SheetSelectField<PriceRange>
              name="price_range"
              label="価格帯"
              options={metaData.price_ranges}
              labelKey="price_range"
            />

            <SheetSelectField<Design>
              name="design"
              label="柄・特徴"
              options={metaData.designs}
              labelKey="design_pattern"
            />

            <ColorSelectFormField
              name="main_color"
              label="メインカラー"
              options={metaData.colors}
            />
          </div>

          <div className="my-7">
            <ToggleGroupFormField
              name="seasons"
              label="シーズン"
              options={metaData.seasons}
              labelKey="season_name"
            />
          </div>

          <div className="mb-6">
            <CheckboxFormField name="is_owned" label="所有している" defaultChecked={true} />
            <CheckboxFormField name="is_old_clothes" label="古着" />
          </div>

          <div className="flex justify-end">
            <SubmitButton
              label="保存"
              disabled={isProcessing}
              className="w-full md:w-1/3 rounded-xl shadow-md"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
