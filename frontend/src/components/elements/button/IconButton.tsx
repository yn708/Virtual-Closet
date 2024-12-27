import { Button } from '@/components/ui/button';
import type { IconButtonProps } from '@/types';
import { ICON_SIZE } from '@/utils/constants';
import { forwardRef } from 'react';

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      Icon,
      label,
      showText = true,
      rounded = false,
      className,
      labelClassName,
      size = 'md',
      variant = 'outline',
      type = 'submit',
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        type={type}
        size={showText ? 'default' : 'icon'}
        className={`flex items-center justify-center p-2 gap-3 ${
          rounded ? 'rounded-full' : ''
        } ${className}`}
        onClick={onClick}
        {...props}
      >
        <Icon className={ICON_SIZE[size]} />
        {showText ? (
          <span className={`${labelClassName}`}>{label}</span>
        ) : (
          <span className="sr-only">{label}</span>
        )}
      </Button>
    );
  },
);

IconButton.displayName = 'IconButton';

export default IconButton;

// 使用例
// import { IoMdAdd } from "react-icons/io";
//
// <IconButton
//   Icon={IoMdAdd}
//   label="Add"
//   showText={false}
//   rounded={true}
//   variant="ghost"
// />
