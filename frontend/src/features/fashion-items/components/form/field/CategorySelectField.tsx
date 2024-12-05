'use client';

import BaseSheetSelectField from '@/components/elements/form/select/BaseSheetSelectFormField';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import type { CategorySelectFieldProps } from '@/features/fashion-items/types';
import { cn } from '@/lib/utils';

const CategorySelectField = ({
  name,
  label,
  value,
  error,
  options,
  renderIcon,
}: CategorySelectFieldProps) => {
  return (
    <BaseSheetSelectField
      name={name}
      label={label}
      value={value}
      error={error}
      trigger={(value) => {
        if (!value) return null;
        const subcategory = options.flatMap((o) => o.subcategories).find((s) => s.id === value);
        return <div>{subcategory?.subcategory_name}</div>;
      }}
    >
      {({ value, onChange }) => (
        <Accordion type="single" collapsible className="w-full">
          {options.map((category) => (
            <AccordionItem value={category.id} key={category.id}>
              <AccordionTrigger>
                <div className="flex justify-start items-center gap-2">
                  {renderIcon?.(category.id)}
                  {category.category_name}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-3 px-5">
                  {category.subcategories.map((sub) => (
                    <SheetClose asChild key={sub.id}>
                      <Button
                        variant="outline"
                        className={cn('justify-center', value === sub.id && 'border-slate-800')}
                        onClick={() => onChange(sub.id)}
                      >
                        {sub.subcategory_name}
                      </Button>
                    </SheetClose>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </BaseSheetSelectField>
  );
};

export default CategorySelectField;
