import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { BaseOption, ToggleGroupFieldProps } from '@/types';
import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

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
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <ToggleGroup
        type="multiple"
        className="flex flex-wrap gap-2"
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
      >
        {options.map((option, index) => (
          <ToggleGroupItem
            key={index}
            value={option.id}
            className="group relative px-4 py-2 rounded-full border-2 border-gray-200 dark:border-gray-800
                    text-sm font-medium min-w-[120px] overflow-hidden
                    transition-all duration-200 ease-in-out
                    hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950
                    data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:border-blue-500
                    data-[state=on]:shadow-sm"
            aria-label={`${String(option[labelKey])} を選択`}
          >
            <div className="relative flex items-center justify-center">
              <FiCheck
                className="absolute size-4
                        opacity-0
                        group-data-[state=on]:opacity-100 group-data-[state=on]:-translate-x-4
                        transition-all duration-200 ease-in-out"
                aria-hidden="true"
              />
              <span
                className="transition-all duration-200
                      group-data-[state=on]:translate-x-2"
              >
                {String(option[labelKey])}
              </span>
            </div>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {/* 選択された値のみをhidden inputsとして追加 */}
      {selectedValues.map((value) => (
        <input key={value} type="hidden" name={name} value={value} />
      ))}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default ToggleGroupFormField;
