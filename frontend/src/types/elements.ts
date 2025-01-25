import type { ICON_SIZE } from '@/utils/constants';
import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import type { ClassNameType, LabelType } from './common';

/* ----------------------------------------------------------------
要素のベース
------------------------------------------------------------------ */
export interface BaseLinkProps extends ClassNameType {
  href: string;
}

export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export interface BaseIconProps {
  Icon: IconComponent | LucideIcon;
  size?: keyof typeof ICON_SIZE;
}

export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/* ----------------------------------------------------------------
イメージ
------------------------------------------------------------------ */
export interface ImageDisplayProps {
  src: string | undefined | null;
  alt: string;
}

/* ----------------------------------------------------------------
ボタン
------------------------------------------------------------------ */
export interface IconButtonProps extends BaseIconProps, BaseButtonProps, LabelType {
  showText?: boolean;
  rounded?: boolean;
  labelClassName?: string;
}

/* ----------------------------------------------------------------
スイッチ
------------------------------------------------------------------ */
export interface ToggleSwitchProps extends LabelType, ClassNameType {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}
