'use client';

import IconButton from '@/components/elements/button/IconButton';
import { signOut } from 'next-auth/react';
import { HiLogout } from 'react-icons/hi';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/auth/login' });
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
    }
  };

  return (
    <IconButton
      Icon={HiLogout}
      label="ログアウト"
      onClick={handleLogout}
      variant="ghost"
      className="w-full"
    />
  );
};

export default LogoutButton;
