import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toggleGroupStyles as styles } from '@/styles/toggle/toggleGroupStyles';
import type { BaseOption, ToggleGroupFieldProps } from '@/types';
import { Check } from 'lucide-react';
import { useState } from 'react';

function ToggleGroupFormField<T extends BaseOption>({
  name,
  label,
  options,
  labelKey,
  error,
  defaultValue = [],
}: ToggleGroupFieldProps<T>) {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);

  const handleValueChange = (values: string[]) => {
    setSelectedValues(values);
  };

  return (
    <div>
      <label className={styles.label}>{label}</label>
      <ToggleGroup
        type="multiple"
        className={styles.group}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
      >
        {options.map((option, index) => (
          <ToggleGroupItem
            key={index}
            value={option.id}
            className={styles.item}
            aria-label={`${String(option[labelKey])} を選択`}
          >
            <div className={styles.itemContent}>
              <Check className={styles.icon} aria-hidden="true" />
              <span className={styles.text}>{String(option[labelKey])}</span>
            </div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {/* 選択された値のみをhidden inputsとして追加 */}
      {selectedValues.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default ToggleGroupFormField;
