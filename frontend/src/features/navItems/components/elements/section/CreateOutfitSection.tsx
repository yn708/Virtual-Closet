'use client';

import IconLink from '@/components/elements/link/IconLink';
import type { UseIsOpenOnCloseType } from '@/types';
import { COORDINATE_CREATE_CANVAS_URL, COORDINATE_EDIT_URL } from '@/utils/constants';
import { BiCloset } from 'react-icons/bi';
import { MdOutlineSwipe } from 'react-icons/md';
import { ImageUploadSection } from './ImageUploadSection';

export const CreateOutfitSection: React.FC<UseIsOpenOnCloseType> = ({ onClose }) => {
  return (
    <ImageUploadSection
      value="create-outfit"
      label="コーディネート作成"
      Icon={BiCloset}
      redirectUrl={COORDINATE_EDIT_URL}
      onClose={onClose}
    >
      <IconLink
        href={COORDINATE_CREATE_CANVAS_URL}
        Icon={MdOutlineSwipe}
        size="sm"
        label="登録済みアイテムから作成"
        rounded={true}
        className="border font-medium"
        onClick={onClose}
      />
    </ImageUploadSection>
  );
};
