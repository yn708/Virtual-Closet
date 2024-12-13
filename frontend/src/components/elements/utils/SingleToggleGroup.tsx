import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toggleGroupStyles as styles } from '@/styles/toggle/toggleGroupStyles';
import type { LabelType } from '@/types';
import { FiCheck } from 'react-icons/fi';

export interface SingleToggleGroupProps extends LabelType {
  options: readonly { id: string; label: string }[];
  value?: string;
  onValueChange: (value: string) => void;
}

const SingleToggleGroup = ({ label, options, value, onValueChange }: SingleToggleGroupProps) => {
  return (
    <div>
      <label className={styles.label}>{label}</label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={onValueChange}
        className={styles.group}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.id}
            value={option.id}
            className={styles.item}
            aria-label={`${option.label} を選択`}
          >
            <div className={styles.itemContent}>
              <FiCheck className={styles.icon} aria-hidden="true" />

              <span className={styles.text}>{option.label}</span>
            </div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
export default SingleToggleGroup;
