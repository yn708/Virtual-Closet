import CenterTitleLayout from '@/components/layout/CenterTitleLayout';
import ImageAndContentSplitLayout from '@/components/layout/ImageAndContentSplitLayout';
import type { AuthPageTemplate } from '../../types';

const AuthPageTemplate: React.FC<AuthPageTemplate> = ({
  title,
  description,
  subDescription,
  children,
  isReversed,
}) => {
  return (
    <ImageAndContentSplitLayout
      isReversed={isReversed}
      leftContent={
        <CenterTitleLayout
          title={title}
          description={description}
          subDescription={subDescription}
          className="text-center"
        >
          <div className="space-y-5 mx-auto max-w-md">{children}</div>
        </CenterTitleLayout>
      }
      rightContent={
        <div className="text-center py-10">
          <h2 className="2xl:text-8xl md:text-7xl text-5xl font-extrabold tracking-wide space-y-6">
            <p>Virtual</p>
            <p>Closet</p>
          </h2>
        </div>
      }
    />
  );
};

export default AuthPageTemplate;
