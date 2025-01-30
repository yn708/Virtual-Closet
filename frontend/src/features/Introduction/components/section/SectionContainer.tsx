import type { ChildrenType, ClassNameType } from '@/types';
interface SectionContainerProps extends ChildrenType, ClassNameType {
  ContentClassName?: string;
}

// 共通のセクションコンテナを作成
const SectionContainer = ({
  children,
  className = '',
  ContentClassName = '',
}: SectionContainerProps) => {
  return (
    <section className={`py-32 relative ${className}`}>
      <div className="absolute inset-0 bg-white/90" />
      <div className={`max-w-7xl mx-auto px-4 relative ${ContentClassName}`}>{children}</div>
    </section>
  );
};

export default SectionContainer;
