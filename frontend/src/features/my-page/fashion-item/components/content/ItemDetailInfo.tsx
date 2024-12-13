import { FaRegCircle } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { TbSlash } from 'react-icons/tb';
import type { BorderBoxProps, ItemDetailInfoProps } from '../../types';

const BorderBox = ({ label, value }: BorderBoxProps) => (
  <div className="flex justify-start items-center gap-6 text-sm">
    <span>{label}</span>
    <span className="rounded-md border px-3 py-1 font-medium">{value}</span>
  </div>
);

const ItemDetailInfo = ({ item }: ItemDetailInfoProps) => {
  const statusIcon = (status: boolean) => (status ? <FaRegCircle /> : <IoClose />);

  return (
    <div className="space-y-6">
      <BorderBox label="カテゴリー" value={item.sub_category.subcategory_name} />
      {item.brand && <BorderBox label="ブランド" value={item.brand.brand_name} />}
      {item.price_range && <BorderBox label="価格帯" value={item.price_range.price_range} />}

      {item.design && <BorderBox label="デザイン" value={item.design.design_pattern} />}
      {item.main_color && <BorderBox label="メインカラー" value={item.main_color.color_name} />}
      {item.seasons.length > 0 && (
        <div className="flex justify-start items-center gap-6 text-sm">
          <span>シーズン</span>
          <div className="space-x-2">
            {item.seasons.map((season) => (
              <span key={season.id} className="rounded-md border px-3 py-1 font-medium">
                {season.season_name}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-start items-center gap-10">
        <BorderBox label="所有" value={statusIcon(item.is_owned)} />
        <TbSlash />
        <BorderBox label="古着" value={statusIcon(item.is_old_clothes)} />
      </div>
    </div>
  );
};

export default ItemDetailInfo;
