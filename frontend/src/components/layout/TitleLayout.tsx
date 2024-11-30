import type {
  ChildrenType,
  ClassNameType,
  DescriptionType,
  SubDescriptionType,
  TitleType,
} from '@/types';
import React from 'react';

const TitleLayout: React.FC<
  ChildrenType & ClassNameType & TitleType & DescriptionType & SubDescriptionType
> = ({ children, title, description, subDescription, className: titleContentClassName }) => {
  return (
    <div className="w-full px-10 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-10 px-1">
        <div className={`${titleContentClassName} space-y-4 pb-5`}>
          <h1 className="2xl:text-4xl text-3xl font-bold">{title}</h1>
          <div className="text-muted-foreground space-y-1 2xl:text-base text-sm">
            {description && <div>{description}</div>}
            {subDescription && <div>{subDescription}</div>}
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default TitleLayout;
