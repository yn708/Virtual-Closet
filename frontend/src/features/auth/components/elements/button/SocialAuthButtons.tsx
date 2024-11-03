'use client';
import IconButton from '@/components/elements/button/IconButton';
import type { TextType } from '@/types';
import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';

// Googleのみ実装中（その他プロバイダーを実装する場合はここに追加）← 現時点で追加の予定なし
const providers = [{ name: 'google', label: 'Google', icon: FaGoogle }];

const SocialAuthButtons: React.FC<TextType> = ({ text }) => {
  // NextAuth認証
  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, {
        callbackUrl: '/top', // レダイレクト先指定
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {providers.map((provider) => (
        <IconButton
          key={provider.name}
          Icon={provider.icon}
          size="sm"
          label={`${provider.label}で${text}`}
          className="w-full rounded-3xl p-5"
          onClick={() => handleSignIn(provider.name)}
        />
      ))}
    </div>
  );
};

export default SocialAuthButtons;
