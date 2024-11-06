import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { AccordionSectionProps } from '@/features/navItems/types';
import { ICON_SIZE } from '@/utils/constants';

export const AccordionSection = ({ value, Icon, label, children }: AccordionSectionProps) => (
  <AccordionItem value={value}>
    <AccordionTrigger className="flex items-center justify-between">
      <div className="flex items-center gap-2 p-2">
        <Icon className={ICON_SIZE.md} />
        <span>{label}</span>
      </div>
    </AccordionTrigger>
    <AccordionContent className="grid gap-4">
      <div className="grid gap-2 lg:px-20 md:px-10 px-5">{children}</div>
    </AccordionContent>
  </AccordionItem>
);
