import type { ChildrenType, LabelType, UseIsOpenOnCloseType } from '@/types';

/* ----------------------------------------------------------------
Section
------------------------------------------------------------------ */
export interface AccordionSectionProps extends LabelType, ChildrenType {
  value: string;
}

export interface ImageUploadSectionProps extends UseIsOpenOnCloseType, LabelType {
  value: string;
  redirectUrl: string;
  children?: React.ReactNode;
}
