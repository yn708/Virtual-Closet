import type { BaseLinkProps, LabelType } from '@/types';
import Link from 'next/link';

type Variant = 'solid' | 'outline';

interface StyledLinkProps extends BaseLinkProps, LabelType {
  variant?: Variant;
}

const StyledLink: React.FC<StyledLinkProps> = ({
  label,
  href,
  className = '',
  variant = 'solid',
}) => {
  const baseStyles =
    'py-2 rounded-full text-lg transition-all duration-300 hover:scale-105 text-center';

  const variantStyles = {
    solid: 'bg-blue-500 hover:bg-blue-600 text-white',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
  };

  return (
    <Link href={href} className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {label}
    </Link>
  );
};

export default StyledLink;
