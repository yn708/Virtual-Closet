import MultipleToggleGroup from '@/components/elements/utils/MultipleToggleGroup';
import type { FilterGroupConfig } from '../../types';

interface FilterGroupProps {
  group: FilterGroupConfig;
  value: string[];
  onChange: (value: string[]) => void;
}

const FilterGroup = ({ group, value, onChange }: FilterGroupProps) => {
  return (
    <MultipleToggleGroup
      label={group.label}
      options={group.options}
      value={value as string[]}
      onValueChange={onChange}
    />
  );
};

export default FilterGroup;
