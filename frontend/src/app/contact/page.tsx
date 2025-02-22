import StepContactForm from '@/features/contact/components/StepContactForm';
import { authOptions } from '@/lib/next-auth';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'お問い合わせ',
};

export default async function ContactPage() {
  const session = await getServerSession(authOptions);
  const isSession = !!session;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <main className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-700">お問い合わせ</h1>
            <p className="mt-4 text-sm text-gray-500">
              ご質問・ご要望などございましたら、下記フォームよりお気軽にお問い合わせください。
            </p>
          </div>
          <StepContactForm isSession={isSession} />
        </div>
      </main>
    </div>
  );
}
