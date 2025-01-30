'use client';

import type { UseIsOpenOnCloseType } from '@/types';

import { ITEM_CREATE_URL } from '@/utils/constants';
import ImageUploadSection from './ImageUploadSection';

const AddItemSection: React.FC<UseIsOpenOnCloseType> = ({ onClose }) => {
  return (
    <ImageUploadSection
      value="add-clothing"
      label="アイテム追加"
      redirectUrl={ITEM_CREATE_URL}
      onClose={onClose}
    />
  );
};
export default AddItemSection;
