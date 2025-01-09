import FooterLayout from '@/components/layout/FooterLayout';
import { LegalDialog } from '@/features/auth/components/elements/dialog/LegalDialog';
import type { ClassNameType } from '@/types';
import { FOOTER_NAV_ITEMS } from '@/utils/data/navItems';
import { privacyData } from '@/utils/data/privacy';
import { termsData } from '@/utils/data/terms';
import Link from 'next/link';

const Footer = ({ className }: ClassNameType) => {
  return (
    <FooterLayout className={className}>
      <nav className="flex sm:flex-row flex-col items-center gap-7 text-xs lg:text-sm lg:m-0 mb-10 opacity-90">
        {FOOTER_NAV_ITEMS.map((items) => (
          <Link key={items.label} className="hover:font-bold" href={items.href}>
            {items.label}
          </Link>
        ))}
        <LegalDialog
          data={privacyData}
          label="プライバシーポリシー"
          className="h-auto text-gray-600 dark:text-gray-300 opacity-90 p-0 font-normal hover:font-bold hover:no-underline lg:text-sm text-xs"
        />
        <LegalDialog
          data={termsData}
          label="利用規約"
          className="h-auto text-gray-600 dark:text-gray-300 opacity-90 p-0 font-normal hover:font-bold hover:no-underline lg:text-sm text-xs"
        />
      </nav>
      <p className="text-sm opacity-70">© 2024 Virtual Closet. All rights reserved.</p>
    </FooterLayout>
  );
};

export default Footer;
