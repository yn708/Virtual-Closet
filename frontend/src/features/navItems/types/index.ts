import type { ChildrenType, LabelType, UseIsOpenOnCloseType } from '@/types';
import type { IconType } from 'react-icons/lib';

/* ----------------------------------------------------------------
Section
------------------------------------------------------------------ */
export interface AccordionSectionProps extends LabelType, ChildrenType {
  value: string;
  Icon: IconType;
}

export interface ImageUploadSectionProps extends UseIsOpenOnCloseType, LabelType {
  value: string;
  Icon: IconType;
  redirectUrl: string;
  children?: React.ReactNode;
}
