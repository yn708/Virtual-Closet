'use client';

import type { UseIsOpenOnCloseType } from '@/types';
import { IoMdAdd } from 'react-icons/io';
import ImageUploadSection from './ImageUploadSection';
import { ITEM_CREATE_URL } from '@/utils/constants';

const AddItemSection: React.FC<UseIsOpenOnCloseType> = ({ onClose }) => {
  return (
    <ImageUploadSection
      value="add-clothing"
      label="アイテム追加"
      Icon={IoMdAdd}
      redirectUrl={ITEM_CREATE_URL}
      onClose={onClose}
    />
  );
};
export default AddItemSection;
