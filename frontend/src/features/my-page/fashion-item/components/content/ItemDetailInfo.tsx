import DetailBox from '@/components/elements/utils/DetailBox';
import TagGroup from '@/components/elements/utils/TagGroup';
import type { FashionItem } from '@/types';
import { Circle, Slash, X } from 'lucide-react';
import React from 'react';

const ItemDetailInfo = ({ item }: { item: FashionItem }) => {
  const statusIcon = (status: boolean) => (status ? <Circle /> : <X />);

  const renderBorderBox = (label: string, value: React.ReactNode) => (
    <div className="flex justify-start items-center gap-6 text-sm">
      <span>{label}</span>
      <span className="rounded-md border px-3 py-1 font-medium">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderBorderBox('カテゴリー', item.sub_category.subcategory_name)}
      {item.brand && renderBorderBox('ブランド', item.brand.brand_name)}
      {item.price_range && renderBorderBox('価格帯', item.price_range.price_range)}
      {item.design && renderBorderBox('デザイン', item.design.design_pattern)}
      {item.main_color && renderBorderBox('メインカラー', item.main_color.color_name)}

      {item.seasons.length > 0 && (
        <DetailBox label="シーズン">
          <TagGroup items={item.seasons} valueKey="season_name" />
        </DetailBox>
      )}

      <div className="flex justify-start items-center gap-10">
        {renderBorderBox('所有', statusIcon(item.is_owned))}
        <Slash />
        {renderBorderBox('古着', statusIcon(item.is_old_clothes))}
      </div>
    </div>
  );
};
export default ItemDetailInfo;
