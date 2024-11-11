import type { ICON_SIZE } from '@/utils/constants';
import type { ButtonHTMLAttributes } from 'react';
import type { IconType } from 'react-icons/lib';
import type { ClassNameType } from './common';

/* ----------------------------------------------------------------
要素のベース
------------------------------------------------------------------ */
export interface BaseLinkProps extends ClassNameType {
  href: string;
}

export interface BaseIconProps {
  Icon: IconType;
  size?: keyof typeof ICON_SIZE;
}

export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/* ----------------------------------------------------------------
要素
------------------------------------------------------------------ */
export interface ImageDisplayProps {
  src: string | undefined | null;
  alt: string;
}
