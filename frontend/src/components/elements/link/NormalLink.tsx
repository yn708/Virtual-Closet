import type { BaseLinkProps, LabelType } from '@/types';
import Link from 'next/link';

const NormalLink: React.FC<BaseLinkProps & LabelType> = ({ label, href }) => {
  return (
    <Link href={href} className="font-medium text-blue-500 hover:text-blue-700 hover:underline">
      {label}
    </Link>
  );
};

export default NormalLink;
