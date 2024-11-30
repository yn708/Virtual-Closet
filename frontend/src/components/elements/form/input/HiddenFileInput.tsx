import type { FileInputType } from '@/types';
import { ALLOWED_IMAGE_TYPES } from '@/utils/constants';

const HiddenFileInput = ({ name, onChange }: FileInputType) => {
  return (
    <>
      <input
        name={name}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(',')}
        className="hidden"
        id="image-upload"
        onChange={onChange}
      />
    </>
  );
};

export default HiddenFileInput;
