import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ImageDisplayProps, SizeType } from '@/types';
import { AVATAR_ICON_SIZE, DEFAULT_USER_IMAGE } from '@/utils/constants';
import Image from 'next/image';
import React from 'react';

const ProfileAvatar: React.FC<ImageDisplayProps & SizeType> = ({ src, alt, size = 'md' }) => {
  return (
    <Avatar className={`rounded-full ${AVATAR_ICON_SIZE[size]}`} data-testid="avatar-container">
      <AvatarImage src={src || DEFAULT_USER_IMAGE} alt={alt} />
      <AvatarFallback className="relative">
        <div className="relative size-full">
          <Image
            src={DEFAULT_USER_IMAGE}
            alt="User Avatar"
            fill
            className="rounded-full"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
