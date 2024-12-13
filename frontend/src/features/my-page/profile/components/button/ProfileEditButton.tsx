'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useIsOpen } from '@/hooks/utils/useIsOpen';
import type { UserDetailType } from '@/types';

import UserProfileForm from '../form/UserProfileForm';

const ProfileEditButton = ({ userDetail }: UserDetailType) => {
  const { isOpen, onClose, onToggle } = useIsOpen();

  return (
    <Dialog open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full max-w mx-auto text-sm mb-8">
          プロフィール編集
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <UserProfileForm userDetail={userDetail} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditButton;
