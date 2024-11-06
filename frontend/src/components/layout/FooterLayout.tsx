import type { ChildrenType } from '@/types';

const FooterLayout: React.FC<ChildrenType> = ({ children }) => {
  return (
    <footer
      role="contentinfo"
      className="bg-gray-100 dark:bg-gray-900 px-4 py-10 md:px-6 md:py-16 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 mb-14"
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between px-10">
        {children}
      </div>
    </footer>
  );
};

export default FooterLayout;
