'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { BaseSheetSelectFieldProps } from '@/types';
import { useEffect, useState } from 'react';
import { IoIosArrowUp } from 'react-icons/io';

const BaseSheetSelectField = ({
  name,
  label,
  value: initialValue,
  error,
  trigger,
  children,
}: BaseSheetSelectFieldProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={value || ''} />

      <div className="relative">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className={cn(
                'w-full transition-all duration-200 h-auto min-h-[56px] py-2 px-4',
                error ? 'border-red-500' : 'border-input',
              )}
              variant="outline"
            >
              <div className="flex flex-col items-start justify-center w-full">
                <span
                  className={cn(
                    'transition-all duration-200 pointer-events-none text-sm opacity-70',
                    error ? 'text-red-500' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
                <div className="w-full">{trigger(value)}</div>
              </div>
              <IoIosArrowUp className="absolute top-1/2 -translate-y-1/2 right-5 opacity-65" />
            </Button>
          </SheetTrigger>

          <SheetContent side="bottom" className="h-[80vh] p-10">
            <SheetHeader className="hidden">
              <SheetTitle />
              <SheetDescription />
            </SheetHeader>
            <ScrollArea className="size-full px-10">
              {children({
                value,
                onChange: (newValue) => {
                  setValue(newValue);
                },
              })}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default BaseSheetSelectField;
