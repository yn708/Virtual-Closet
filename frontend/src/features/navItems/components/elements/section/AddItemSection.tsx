'use client';

import type { UseIsOpenOnCloseType } from '@/types';
import { ITEM_EDIT_URL } from '@/utils/constants';
import { IoMdAdd } from 'react-icons/io';
import { ImageUploadSection } from './ImageUploadSection';

export const AddItemSection: React.FC<UseIsOpenOnCloseType> = ({ onClose }) => {
  return (
    <ImageUploadSection
      value="add-clothing"
      label="アイテム追加"
      Icon={IoMdAdd}
      redirectUrl={ITEM_EDIT_URL}
      onClose={onClose}
    />
  );
};
