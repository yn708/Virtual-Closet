'use client';
import LoadingElements from '@/components/elements/loading/LoadingElements';
import CenterTitleLayout from '@/components/layout/CenterTitleLayout';
import { useEmailPasswordForm } from '@/features/auth/hooks/useEmailPasswordForm';
import { useEffect, useState } from 'react';
import AuthCodeInputForm from '../form/AuthCodeInputForm';
import AuthForm from '../form/AuthForm';

const ConfirmContent = () => {
  const [storedEmail, setStoredEmail] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    setStoredEmail(email);
  }, []);

  const handleEmailVerified = (verifiedEmail: string) => {
    setStoredEmail(verifiedEmail);
  };
  const { form, onSubmit } = useEmailPasswordForm(handleEmailVerified);

  // 初期ロード時にローディングを表示
  if (storedEmail === undefined) {
    return <LoadingElements fullScreen={true} />;
  }

  // レイアウトの内容を動的に設定
  const layoutProps = storedEmail
    ? {
        // 認証コード送信用
        title: '認証コード入力',
        message: `${storedEmail}に認証コードを送信しました。`,
        subMessage: 'メールに記載された6桁の認証コードを入力してください。',
        children: <AuthCodeInputForm email={storedEmail} />,
      }
    : {
        // Email確認用
        title: '',
        message: 'エラーが発生しました。',
        subMessage: 'メールアドレスとパスワードを再入力してください。',
        children: (
          <div className="max-w-xl -ml-5">
            <AuthForm form={form} onSubmit={onSubmit} submitButtonLabel="確認" mode="login" />
          </div>
        ),
      };

  return (
    <>
      <CenterTitleLayout
        title={layoutProps.title}
        description={layoutProps.message}
        subDescription={layoutProps.subMessage}
      >
        {layoutProps.children}
      </CenterTitleLayout>
    </>
  );
};
export default ConfirmContent;
