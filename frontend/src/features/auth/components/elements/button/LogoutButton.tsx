'use client';

import IconButton from '@/components/elements/button/IconButton';
import { LOGIN_URL } from '@/utils/constants';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: LOGIN_URL });
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
    }
  };

  return (
    <IconButton
      Icon={LogOut}
      label="ログアウト"
      onClick={handleLogout}
      variant="ghost"
      className="w-full"
    />
  );
};

export default LogoutButton;
