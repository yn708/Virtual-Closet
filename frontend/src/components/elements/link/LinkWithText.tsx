import type { BaseLinkProps, LabelType, TextType } from '@/types';
import React from 'react';
import NormalLink from './NormalLink';

const LinkWithText: React.FC<BaseLinkProps & TextType & LabelType> = ({
  text,
  label,
  href,
  className = 'pt-10 text-center text-sm text-gray-600',
}) => {
  return (
    <p className={className}>
      {text}
      <NormalLink href={href} label={label} />
    </p>
  );
};

export default LinkWithText;
