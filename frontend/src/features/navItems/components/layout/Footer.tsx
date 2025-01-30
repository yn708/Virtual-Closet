import NormalLink from '@/components/elements/link/NormalLink';
import FooterLayout from '@/components/layout/FooterLayout';
import type { ClassNameType } from '@/types';
import { FOOTER_NAV_ITEMS } from '@/utils/data/navItems';

const Footer = ({ className }: ClassNameType) => {
  return (
    <FooterLayout className={className}>
      <nav className="flex sm:flex-row flex-col items-center gap-7 text-xs lg:text-sm lg:m-0 mb-10 opacity-90">
        {FOOTER_NAV_ITEMS.map((items) => (
          <NormalLink
            key={items.label}
            className="hover:font-bold"
            href={items.href}
            rel="nofollow"
            prefetch={false}
            target="_blank"
            label={items.label}
          />
        ))}
      </nav>
      <p className="text-xs md:text-sm opacity-70">© 2024 Virtual Closet. All rights reserved.</p>
    </FooterLayout>
  );
};

export default Footer;
