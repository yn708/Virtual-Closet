import type { BaseLinkProps, LabelType } from '@/types';
import Link from 'next/link';

interface ExtendedLinkProps extends BaseLinkProps, LabelType {
  rel?: string;
  prefetch?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

const NormalLink: React.FC<ExtendedLinkProps> = ({
  label,
  href,
  className = 'font-medium text-blue-500 hover:text-blue-700 hover:underline',
  rel,
  prefetch,
  target,
}) => {
  return (
    <Link href={href} className={className} rel={rel} prefetch={prefetch} target={target}>
      {label}
    </Link>
  );
};

export default NormalLink;
