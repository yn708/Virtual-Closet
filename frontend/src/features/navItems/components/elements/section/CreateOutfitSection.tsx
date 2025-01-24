'use client';

import IconLink from '@/components/elements/link/IconLink';
import type { UseIsOpenOnCloseType } from '@/types';
import { COORDINATE_CREATE_CANVAS_URL, COORDINATE_CREATE_URL } from '@/utils/constants';
import { Shirt } from 'lucide-react';
import ImageUploadSection from './ImageUploadSection';

const CreateOutfitSection: React.FC<UseIsOpenOnCloseType> = ({ onClose }) => {
  return (
    <ImageUploadSection
      value="create-outfit"
      label="コーディネート作成"
      redirectUrl={COORDINATE_CREATE_URL}
      onClose={onClose}
    >
      <IconLink
        href={COORDINATE_CREATE_CANVAS_URL}
        Icon={Shirt}
        size="sm"
        label="登録済みアイテムから作成"
        rounded={true}
        className="border font-medium"
        onClick={onClose}
      />
    </ImageUploadSection>
  );
};
export default CreateOutfitSection;
