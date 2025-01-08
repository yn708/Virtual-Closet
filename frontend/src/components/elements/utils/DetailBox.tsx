import type { ChildrenType, LabelType } from '@/types';

const DetailBox = ({ label, children }: ChildrenType & LabelType) => (
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
    <label className="min-w-20 font-medium">{label}</label>
    {children}
  </div>
);
export default DetailBox;
