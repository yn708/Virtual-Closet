import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toggleGroupStyles as styles } from '@/styles/toggle/toggleGroupStyles';
import type {
  AccordionToggleGroupFieldProps,
  AccordionToggleGroupLabel,
  SelectionGroup,
} from '@/types';
import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

function AccordionToggleGroupField({ groups }: AccordionToggleGroupFieldProps) {
  /* 各グループの選択状態を管理するステート */
  const [selections, setSelections] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      groups.map((group) => [
        group.name,
        // 初期値が存在する場合はそれを使用し、ない場合は空配列を使用
        group.defaultValue || [],
      ]),
    ),
  );

  /* グループの選択値が変更された際のハンドラー */
  const handleValueChange = (groupName: string, values: string[]) => {
    setSelections((prev) => ({
      ...prev,
      [groupName]: values,
    }));
  };

  /* 選択されたバリューのラベルを取得 */
  const getSelectedLabels = (group: SelectionGroup) => {
    const groupSelections = selections[group.name];
    return groupSelections
      .map((value) => group.options.find((option) => option.id === value)?.[group.labelKey])
      .filter(Boolean) // nullやundefinedを除外
      .map(String); // 全ての値を確実に文字列に変換
  };

  /* 選択制御 */
  const isItemDisabled = (group: SelectionGroup, optionId: string): boolean => {
    const groupSelections = selections[group.name] || [];
    if (!group.maxSelections) return false;
    if (groupSelections.includes(optionId)) return false;
    return groupSelections.length >= group.maxSelections;
  };

  /* アコーディオンに表示するラベル情報を生成 */
  const getAccordionLabel = (group: SelectionGroup): AccordionToggleGroupLabel => {
    const selectedLabels = getSelectedLabels(group); // 選択されたレベル

    // 選択がまだない場合
    if (selectedLabels.length === 0) {
      return {
        selections: null,
        message: group.maxSelections ? `${group.maxSelections}つまで選択可能` : null,
        count: null,
      };
    }

    return {
      // まだ選択可能な場合
      selections: selectedLabels,
      message: null,
      count: group.maxSelections
        ? `${selections[group.name]?.length}/${group.maxSelections}`
        : null,
    };
  };

  /* トグルグループ */
  const renderToggleGroup = (group: SelectionGroup) => (
    <ToggleGroup
      type="multiple"
      className={styles.group}
      defaultValue={group.defaultValue}
      onValueChange={(values) => handleValueChange(group.name, values)}
    >
      {group.options.map((option, index) => (
        <ToggleGroupItem
          key={index}
          value={option.id}
          className={styles.item}
          aria-label={`${String(option[group.labelKey])} を選択`}
          disabled={isItemDisabled(group, option.id)}
        >
          <div className={styles.itemContent}>
            <FiCheck className={styles.icon} aria-hidden="true" />
            <span className={styles.text}>{String(option[group.labelKey])}</span>
          </div>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        {/* 各オプションに展開 */}
        {groups.map((group) => {
          const accordionLabel = getAccordionLabel(group);
          const hasSelections = selections[group.name].length > 0; // 選択があるかどうか

          return (
            <div className="mb-5" key={group.name}>
              <AccordionItem
                value={group.name}
                className="border rounded-lg transition-all duration-200 data-[state=open]:shadow-md data-[state=open]:-translate-y-px last:mb-0"
              >
                <AccordionTrigger className="p-5 w-full">
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="flex-1 shrink-0 min-w-[120px]">
                      <span className="md:text-sm text-xs font-medium text-gray-500">
                        {group.label}
                      </span>
                      {accordionLabel.count && (
                        <span className="text-xs text-blue-500 block">{accordionLabel.count}</span>
                      )}
                    </div>
                    {hasSelections && accordionLabel.selections ? (
                      <div className="flex flex-wrap gap-1 justify-center items-center pr-4">
                        {accordionLabel.selections.map((label, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs sm:text-sm bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 rounded-full"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 text-right pr-4">
                        {accordionLabel.message}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  {renderToggleGroup(group)}
                </AccordionContent>
              </AccordionItem>
              {/* エラーメッセージの表示 */}
              {group.error &&
                Object.entries(group.error).map(([key, message]) => (
                  <p key={key} className={styles.error}>
                    {message}
                  </p>
                ))}
            </div>
          );
        })}
      </Accordion>

      {/* フォーム送信用のhidden input */}
      {groups.map((group) =>
        selections[group.name]?.map((value) => (
          <input key={`${group.name}-${value}`} type="hidden" name={group.name} value={value} />
        )),
      )}
    </div>
  );
}

export default AccordionToggleGroupField;

/**
 * @example
 * <AccordionToggleGroupField
 *   groups={[
 *     {
 *       name: "tastes",
 *       label: "テイスト",
 *       options: metaData.tastes,
 *       labelKey: "taste",
 *       maxSelections: 3
 *     },
 *     {
 *       name: "scenes",
 *       label: "シーン",
 *       options: metaData.scenes,
 *       labelKey: "scene",
 *       maxSelections: 3
 *     }
 *   ]}
 * />
 */
