import type { BaseIconProps, BaseLinkProps, LabelType, OnClickType } from '@/types';
import { ICON_SIZE } from '@/utils/constants';
import Link from 'next/link';

export interface IconLinkProps extends BaseIconProps, BaseLinkProps, LabelType, OnClickType {
  showText?: boolean;
  rounded?: boolean;
}

const IconLink = ({
  href,
  Icon,
  label,
  className,
  showText = true,
  rounded = false,
  size = 'md',
  onClick,
}: IconLinkProps) => {
  return (
    <Link
      href={href}
      className={`${rounded ? 'rounded-full' : ''} flex items-center justify-center p-2 transition-colors hover:bg-muted gap-2 ${className}`}
      onClick={onClick}
    >
      <Icon className={`text-muted-foreground ${ICON_SIZE[size]}`} />
      <span className={`${showText ? '' : 'sr-only'}`}>{label}</span>
    </Link>
  );
};

export default IconLink;
