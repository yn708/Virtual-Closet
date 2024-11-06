import type { ChildrenType } from '@/types';

const HeaderLayout: React.FC<ChildrenType> = ({ children }) => {
  return (
    <>
      <header className="fixed bottom-0 inset-x-0 z-50 bg-background">
        <nav className="flex justify-between items-center h-14 px-4 sm:px-6">{children}</nav>
      </header>
    </>
  );
};
export default HeaderLayout;
