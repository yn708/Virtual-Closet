import DetailBox from '@/components/elements/utils/DetailBox';
import TagGroup from '@/components/elements/utils/TagGroup';
import type { BaseCoordinate } from '@/types/coordinate';

interface CoordinateDetailInfoProps {
  item: BaseCoordinate;
}
interface DetailGroup {
  label: string;
  items: Array<{ id: string; [key: string]: string }>;
  valueKey: string;
}
const CoordinateDetailInfo = ({ item }: CoordinateDetailInfoProps) => {
  const detailGroups: DetailGroup[] = [
    { label: 'シーズン', items: item.seasons, valueKey: 'season_name' },
    { label: 'シーン', items: item.scenes, valueKey: 'scene' },
    { label: 'テイスト', items: item.tastes, valueKey: 'taste' },
  ];

  const hasAnyInfo = detailGroups.every((group) => group.items.length === 0);

  if (hasAnyInfo) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border p-4 text-sm text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50">
          コーディネートの詳細情報が登録されていません
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {detailGroups.map(
        (group) =>
          group.items.length > 0 && (
            <DetailBox key={group.label} label={group.label}>
              <TagGroup items={group.items} valueKey={group.valueKey} />
            </DetailBox>
          ),
      )}
    </div>
  );
};
export default CoordinateDetailInfo;
