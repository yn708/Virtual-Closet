import type { FileInputType } from '@/types';
import { ALLOWED_IMAGE_TYPES } from '@/utils/constants';
import { forwardRef } from 'react';

const HiddenFileInput = forwardRef<HTMLInputElement, Omit<FileInputType, 'ref'>>(
  ({ name = 'image', onChange }, ref) => {
    return (
      <input
        ref={ref}
        name={name}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="hidden"
        id="image-upload"
        onChange={onChange}
      />
    );
  },
);

HiddenFileInput.displayName = 'HiddenFileInput';

export default HiddenFileInput;
