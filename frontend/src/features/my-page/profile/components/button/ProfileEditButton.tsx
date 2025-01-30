'use client';
import { Button } from '@/components/ui/button';

import { useIsOpen } from '@/hooks/utils/useIsOpen';
import type { UserDetailType } from '@/types';

import BaseDialog from '@/components/elements/dialog/BaseDialog';
import UserProfileForm from '../form/UserProfileForm';

const ProfileEditButton = ({ userDetail }: UserDetailType) => {
  const { isOpen, onClose, onToggle } = useIsOpen();

  return (
    <BaseDialog
      isOpen={isOpen}
      onToggle={onToggle}
      trigger={
        <Button variant="outline" className="w-full max-w mx-auto text-sm mb-8">
          プロフィール編集
        </Button>
      }
      className="max-w-[800px]"
    >
      <UserProfileForm userDetail={userDetail} onSuccess={onClose} />
    </BaseDialog>
  );
};

export default ProfileEditButton;
