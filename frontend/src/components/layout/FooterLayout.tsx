import type { ChildrenType, ClassNameType } from '@/types';

const FooterLayout: React.FC<ChildrenType & ClassNameType> = ({ children, className }) => {
  return (
    <footer
      role="contentinfo"
      className={`w-full bg-gray-100 dark:bg-gray-900 px-4 py-10 md:px-6 md:py-16 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 ${className}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between px-10">
        {children}
      </div>
    </footer>
  );
};

export default FooterLayout;
